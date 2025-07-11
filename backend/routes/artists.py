from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional

from models import (
    Artist, ArtistCreate, ArtistUpdate, UserRole
)
from auth import get_current_active_user, require_role
from database import database

router = APIRouter(prefix="/artists", tags=["artists"])

@router.get("/", response_model=List[Artist])
async def get_artists(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user = Depends(get_current_active_user)
):
    """Get all artists"""
    artists = await database.get_all_artists(skip=skip, limit=limit)
    return artists

@router.post("/", response_model=Artist)
async def create_artist(
    artist_data: ArtistCreate,
    current_user = Depends(require_role([UserRole.LABEL_MANAGER, UserRole.SUPER_ADMIN]))
):
    """Create a new artist (Label Manager or Super Admin only)"""
    artist = await database.create_artist(artist_data, current_user.id)
    return artist

@router.get("/{artist_id}", response_model=Artist)
async def get_artist(
    artist_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get artist by ID"""
    artist = await database.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    return artist

@router.put("/{artist_id}", response_model=Artist)
async def update_artist(
    artist_id: str,
    update_data: ArtistUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update artist"""
    artist = await database.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    # Check permissions
    if (current_user.role == UserRole.LABEL_MANAGER and 
        artist.managed_by != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this artist"
        )
    
    if (current_user.role == UserRole.ARTIST and 
        artist.user_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this artist"
        )
    
    updated_artist = await database.update_artist(artist_id, update_data)
    return updated_artist

@router.delete("/{artist_id}")
async def delete_artist(
    artist_id: str,
    current_user = Depends(get_current_active_user)
):
    """Delete artist"""
    artist = await database.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    # Check permissions
    if (current_user.role == UserRole.LABEL_MANAGER and 
        artist.managed_by != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this artist"
        )
    
    if (current_user.role == UserRole.ARTIST and 
        artist.user_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this artist"
        )
    
    if current_user.role not in [UserRole.LABEL_MANAGER, UserRole.ARTIST, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete artists"
        )
    
    # Delete all songs by this artist
    songs = await database.get_songs_by_artist(artist_id)
    for song in songs:
        await database.delete_song(song.id)
    
    # Delete the artist
    success = await database.delete_artist(artist_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete artist"
        )
    
    return {"message": "Artist deleted successfully"}

@router.get("/my/artists", response_model=List[Artist])
async def get_my_artists(
    current_user = Depends(require_role([UserRole.LABEL_MANAGER]))
):
    """Get artists managed by current label manager"""
    artists = await database.get_artists_by_manager(current_user.id)
    return artists

@router.get("/{artist_id}/statistics")
async def get_artist_statistics(
    artist_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get artist statistics"""
    artist = await database.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    # Check permissions for detailed stats
    if (current_user.role == UserRole.LABEL_MANAGER and 
        artist.managed_by != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view detailed statistics"
        )
    
    if (current_user.role == UserRole.ARTIST and 
        artist.user_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view detailed statistics"
        )
    
    stats = await database.get_artist_statistics(artist_id)
    return stats

@router.post("/{artist_id}/verify")
async def verify_artist(
    artist_id: str,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Verify artist (Super Admin only)"""
    artist = await database.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    await database.db.artists.update_one(
        {"id": artist_id},
        {"$set": {"verified": True}}
    )
    
    return {"message": "Artist verified successfully"}

@router.post("/{artist_id}/unverify")
async def unverify_artist(
    artist_id: str,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Unverify artist (Super Admin only)"""
    artist = await database.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    await database.db.artists.update_one(
        {"id": artist_id},
        {"$set": {"verified": False}}
    )
    
    return {"message": "Artist unverified successfully"}