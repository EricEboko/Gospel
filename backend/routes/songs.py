from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional

from ..models import (
    Song, SongCreate, SongUpdate, UserRole
)
from ..auth import get_current_active_user, require_role
from ..database import database

router = APIRouter(prefix="/songs", tags=["songs"])

@router.get("/", response_model=List[Song])
async def get_songs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    artist_id: Optional[str] = None,
    genre: Optional[str] = None,
    current_user = Depends(get_current_active_user)
):
    """Get all songs"""
    if artist_id:
        songs = await database.get_songs_by_artist(artist_id)
    else:
        songs = await database.get_all_songs(skip=skip, limit=limit)
    
    # Filter by genre if specified
    if genre:
        songs = [song for song in songs if song.genre == genre]
    
    return songs

@router.post("/", response_model=Song)
async def create_song(
    song_data: SongCreate,
    current_user = Depends(get_current_active_user)
):
    """Create a new song"""
    # Check if user has permission to create songs
    if current_user.role not in [UserRole.LABEL_MANAGER, UserRole.ARTIST, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create songs"
        )
    
    # Check if artist exists
    artist = await database.get_artist_by_id(song_data.artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    # Check permissions for the artist
    if current_user.role == UserRole.LABEL_MANAGER:
        if artist.managed_by != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create songs for this artist"
            )
    elif current_user.role == UserRole.ARTIST:
        if artist.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to create songs for this artist"
            )
    
    song = await database.create_song(song_data, current_user.id)
    return song

@router.get("/{song_id}", response_model=Song)
async def get_song(
    song_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get song by ID"""
    song = await database.get_song_by_id(song_id)
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    return song

@router.put("/{song_id}", response_model=Song)
async def update_song(
    song_id: str,
    update_data: SongUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update song"""
    song = await database.get_song_by_id(song_id)
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.LABEL_MANAGER:
        artist = await database.get_artist_by_id(song.artist_id)
        if not artist or artist.managed_by != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this song"
            )
    elif current_user.role == UserRole.ARTIST:
        artist = await database.get_artist_by_id(song.artist_id)
        if not artist or artist.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this song"
            )
    elif current_user.role not in [UserRole.SUPER_ADMIN]:
        if song.created_by != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this song"
            )
    
    updated_song = await database.update_song(song_id, update_data)
    return updated_song

@router.delete("/{song_id}")
async def delete_song(
    song_id: str,
    current_user = Depends(get_current_active_user)
):
    """Delete song"""
    song = await database.get_song_by_id(song_id)
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    # Check permissions
    if current_user.role == UserRole.LABEL_MANAGER:
        artist = await database.get_artist_by_id(song.artist_id)
        if not artist or artist.managed_by != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this song"
            )
    elif current_user.role == UserRole.ARTIST:
        artist = await database.get_artist_by_id(song.artist_id)
        if not artist or artist.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this song"
            )
    elif current_user.role not in [UserRole.SUPER_ADMIN]:
        if song.created_by != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this song"
            )
    
    success = await database.delete_song(song_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete song"
        )
    
    return {"message": "Song deleted successfully"}

@router.get("/my/songs", response_model=List[Song])
async def get_my_songs(
    current_user = Depends(get_current_active_user)
):
    """Get songs created by current user"""
    songs = await database.get_songs_by_creator(current_user.id)
    return songs

@router.post("/{song_id}/play")
async def play_song(
    song_id: str,
    current_user = Depends(get_current_active_user)
):
    """Record a song play (for statistics)"""
    song = await database.get_song_by_id(song_id)
    if not song:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Song not found"
        )
    
    # Increment play count
    success = await database.increment_song_play_count(song_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to record play"
        )
    
    return {"message": "Play recorded successfully"}

@router.get("/artist/{artist_id}", response_model=List[Song])
async def get_songs_by_artist(
    artist_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get all songs by a specific artist"""
    artist = await database.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    songs = await database.get_songs_by_artist(artist_id)
    return songs

@router.get("/search/")
async def search_songs(
    q: str = Query(..., description="Search query"),
    limit: int = Query(50, ge=1, le=200),
    current_user = Depends(get_current_active_user)
):
    """Search songs by title, artist, or lyrics"""
    # Simple search implementation
    all_songs = await database.get_all_songs(limit=1000)
    
    results = []
    query_lower = q.lower()
    
    for song in all_songs:
        # Search in title
        if query_lower in song.title.lower():
            results.append(song)
            continue
        
        # Search in lyrics
        if song.lyrics and query_lower in song.lyrics.lower():
            results.append(song)
            continue
        
        # Search in artist name
        artist = await database.get_artist_by_id(song.artist_id)
        if artist and query_lower in artist.name.lower():
            results.append(song)
            continue
        
        # Search in album
        if song.album and query_lower in song.album.lower():
            results.append(song)
            continue
    
    return results[:limit]

@router.get("/trending/")
async def get_trending_songs(
    limit: int = Query(50, ge=1, le=200),
    current_user = Depends(get_current_active_user)
):
    """Get trending songs based on recent plays"""
    songs = await database.get_all_songs(limit=1000)
    
    # Sort by recent play statistics
    trending_songs = sorted(
        songs, 
        key=lambda x: x.streams_this_week + x.streams_this_month,
        reverse=True
    )
    
    return trending_songs[:limit]

@router.get("/new-releases/")
async def get_new_releases(
    limit: int = Query(50, ge=1, le=200),
    current_user = Depends(get_current_active_user)
):
    """Get new releases"""
    songs = await database.get_all_songs(limit=1000)
    
    # Sort by creation date
    new_releases = sorted(songs, key=lambda x: x.created_at, reverse=True)
    
    return new_releases[:limit]