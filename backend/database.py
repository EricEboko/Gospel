from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
import os
from datetime import datetime

from models import User, Artist, Song, UserCreate, UserUpdate, ArtistCreate, ArtistUpdate, SongCreate, SongUpdate

class Database:
    def __init__(self):
        self.client = None
        self.db = None
        
    async def connect(self):
        if not self.client:
            self.client = AsyncIOMotorClient(os.environ['MONGO_URL'])
            self.db = self.client[os.environ['DB_NAME']]
        
    async def close(self):
        if self.client:
            self.client.close()
            
    async def ensure_connected(self):
        if not self.client:
            await self.connect()
        
    # User Operations
    async def create_user(self, user_data: UserCreate, password_hash: str, email_verification_token: str) -> User:
        await self.ensure_connected()
        
        user = User(
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone_number=user_data.phone_number,
            country=user_data.country,
            language=user_data.language,
            role=user_data.role,
            password_hash=password_hash,
            email_verification_token=email_verification_token
        )
        
        await self.db.users.insert_one(user.dict())
        return user
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        await self.ensure_connected()
        user_doc = await self.db.users.find_one({"id": user_id})
        return User(**user_doc) if user_doc else None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        await self.ensure_connected()
        user_doc = await self.db.users.find_one({"email": email})
        return User(**user_doc) if user_doc else None
    
    async def get_user_by_verification_token(self, token: str) -> Optional[User]:
        await self.ensure_connected()
        user_doc = await self.db.users.find_one({"email_verification_token": token})
        return User(**user_doc) if user_doc else None
    
    async def update_user(self, user_id: str, update_data: UserUpdate) -> Optional[User]:
        await self.ensure_connected()
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        await self.db.users.update_one(
            {"id": user_id},
            {"$set": update_dict}
        )
        return await self.get_user_by_id(user_id)
    
    async def verify_user_email(self, user_id: str) -> bool:
        await self.ensure_connected()
        result = await self.db.users.update_one(
            {"id": user_id},
            {
                "$set": {
                    "email_verified": True,
                    "status": "active",
                    "email_verification_token": None,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        return result.modified_count > 0
    
    async def get_users_by_role(self, role: str) -> List[User]:
        await self.ensure_connected()
        users_cursor = self.db.users.find({"role": role})
        users = []
        async for user_doc in users_cursor:
            users.append(User(**user_doc))
        return users
    
    async def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        await self.ensure_connected()
        users_cursor = self.db.users.find().skip(skip).limit(limit)
        users = []
        async for user_doc in users_cursor:
            users.append(User(**user_doc))
        return users
    
    async def delete_user(self, user_id: str) -> bool:
        await self.ensure_connected()
        result = await self.db.users.update_one(
            {"id": user_id},
            {"$set": {"status": "deleted", "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0
    
    # Artist Operations
    async def create_artist(self, artist_data: ArtistCreate, created_by: str) -> Artist:
        await self.ensure_connected()
        artist = Artist(**artist_data.dict())
        artist.managed_by = created_by
        
        await self.db.artists.insert_one(artist.dict())
        return artist
    
    async def get_artist_by_id(self, artist_id: str) -> Optional[Artist]:
        await self.ensure_connected()
        artist_doc = await self.db.artists.find_one({"id": artist_id})
        return Artist(**artist_doc) if artist_doc else None
    
    async def get_artists_by_manager(self, manager_id: str) -> List[Artist]:
        await self.ensure_connected()
        artists_cursor = self.db.artists.find({"managed_by": manager_id})
        artists = []
        async for artist_doc in artists_cursor:
            artists.append(Artist(**artist_doc))
        return artists
    
    async def get_all_artists(self, skip: int = 0, limit: int = 100) -> List[Artist]:
        await self.ensure_connected()
        artists_cursor = self.db.artists.find().skip(skip).limit(limit)
        artists = []
        async for artist_doc in artists_cursor:
            artists.append(Artist(**artist_doc))
        return artists
    
    async def update_artist(self, artist_id: str, update_data: ArtistUpdate) -> Optional[Artist]:
        await self.ensure_connected()
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        await self.db.artists.update_one(
            {"id": artist_id},
            {"$set": update_dict}
        )
        return await self.get_artist_by_id(artist_id)
    
    async def delete_artist(self, artist_id: str) -> bool:
        await self.ensure_connected()
        result = await self.db.artists.delete_one({"id": artist_id})
        return result.deleted_count > 0
    
    # Song Operations
    async def create_song(self, song_data: SongCreate, created_by: str) -> Song:
        await self.ensure_connected()
        song = Song(**song_data.dict(), created_by=created_by)
        
        await self.db.songs.insert_one(song.dict())
        
        # Update artist's total songs count
        await self.db.artists.update_one(
            {"id": song.artist_id},
            {"$inc": {"total_songs": 1}}
        )
        
        return song
    
    async def get_song_by_id(self, song_id: str) -> Optional[Song]:
        await self.ensure_connected()
        song_doc = await self.db.songs.find_one({"id": song_id})
        if song_doc:
            song = Song(**song_doc)
            # Get artist name
            artist = await self.get_artist_by_id(song.artist_id)
            if artist:
                song.artist_name = artist.name
            return song
        return None
    
    async def get_songs_by_artist(self, artist_id: str) -> List[Song]:
        await self.ensure_connected()
        songs_cursor = self.db.songs.find({"artist_id": artist_id})
        songs = []
        async for song_doc in songs_cursor:
            songs.append(Song(**song_doc))
        return songs
    
    async def get_songs_by_creator(self, creator_id: str) -> List[Song]:
        await self.ensure_connected()
        songs_cursor = self.db.songs.find({"created_by": creator_id})
        songs = []
        async for song_doc in songs_cursor:
            songs.append(Song(**song_doc))
        return songs
    
    async def get_all_songs(self, skip: int = 0, limit: int = 100) -> List[Song]:
        await self.ensure_connected()
        songs_cursor = self.db.songs.find().skip(skip).limit(limit)
        songs = []
        async for song_doc in songs_cursor:
            song = Song(**song_doc)
            # Get artist name
            artist = await self.get_artist_by_id(song.artist_id)
            if artist:
                song.artist_name = artist.name
            songs.append(song)
        return songs
    
    async def update_song(self, song_id: str, update_data: SongUpdate) -> Optional[Song]:
        await self.ensure_connected()
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        await self.db.songs.update_one(
            {"id": song_id},
            {"$set": update_dict}
        )
        return await self.get_song_by_id(song_id)
    
    async def delete_song(self, song_id: str) -> bool:
        await self.ensure_connected()
        # Get song first to update artist's count
        song = await self.get_song_by_id(song_id)
        if song:
            await self.db.artists.update_one(
                {"id": song.artist_id},
                {"$inc": {"total_songs": -1}}
            )
        
        result = await self.db.songs.delete_one({"id": song_id})
        return result.deleted_count > 0
    
    # Statistics Operations
    async def increment_song_play_count(self, song_id: str) -> bool:
        await self.ensure_connected()
        result = await self.db.songs.update_one(
            {"id": song_id},
            {
                "$inc": {
                    "play_count": 1,
                    "streams_today": 1,
                    "streams_this_week": 1,
                    "streams_this_month": 1
                }
            }
        )
        
        # Update artist streams
        song = await self.get_song_by_id(song_id)
        if song:
            await self.db.artists.update_one(
                {"id": song.artist_id},
                {"$inc": {"total_streams": 1}}
            )
        
        return result.modified_count > 0
    
    async def get_artist_statistics(self, artist_id: str) -> Dict[str, Any]:
        await self.ensure_connected()
        artist = await self.get_artist_by_id(artist_id)
        if not artist:
            return {}
        
        songs = await self.get_songs_by_artist(artist_id)
        
        total_streams = sum(song.play_count for song in songs)
        top_songs = sorted(songs, key=lambda x: x.play_count, reverse=True)[:10]
        
        return {
            "artist_id": artist_id,
            "artist_name": artist.name,
            "total_streams": total_streams,
            "total_songs": len(songs),
            "monthly_listeners": artist.monthly_listeners,
            "followers": artist.followers,
            "top_songs": [
                {
                    "id": song.id,
                    "title": song.title,
                    "play_count": song.play_count
                }
                for song in top_songs
            ]
        }
    
    async def get_label_statistics(self, label_id: str) -> Dict[str, Any]:
        await self.ensure_connected()
        artists = await self.get_artists_by_manager(label_id)
        
        total_streams = 0
        total_songs = 0
        artist_stats = []
        
        for artist in artists:
            artist_stat = await self.get_artist_statistics(artist.id)
            total_streams += artist_stat.get("total_streams", 0)
            total_songs += artist_stat.get("total_songs", 0)
            artist_stats.append(artist_stat)
        
        return {
            "label_id": label_id,
            "total_artists": len(artists),
            "total_streams": total_streams,
            "total_songs": total_songs,
            "artists": artist_stats
        }

# Global database instance
database = Database()