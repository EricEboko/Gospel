from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, List, Dict, Any
import os
from datetime import datetime, timedelta
import uuid

from models import User, Artist, Song, UserCreate, UserUpdate, ArtistCreate, ArtistUpdate, SongCreate, SongUpdate, AdCreate, AdContent, AdUpdate, AdSettings, AdSettingsUpdate

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

    # Advertisement Operations
    async def create_ad(self, ad_data: 'AdCreate', created_by: str) -> 'AdContent':
        await self.ensure_connected()
        
        ad = AdContent(
            title=ad_data.title,
            description=ad_data.description,
            file_type=ad_data.file_type,
            file_base64=ad_data.file_base64,
            duration=ad_data.duration,
            skip_after=ad_data.skip_after,
            created_by=created_by
        )
        
        await self.db.advertisements.insert_one(ad.dict())
        return ad
    
    async def get_ad_by_id(self, ad_id: str) -> Optional['AdContent']:
        await self.ensure_connected()
        ad_doc = await self.db.advertisements.find_one({"id": ad_id})
        return AdContent(**ad_doc) if ad_doc else None
    
    async def get_all_ads(self, skip: int = 0, limit: int = 100) -> List['AdContent']:
        await self.ensure_connected()
        ads_cursor = self.db.advertisements.find({"is_active": True}).skip(skip).limit(limit)
        ads = []
        async for ad_doc in ads_cursor:
            ads.append(AdContent(**ad_doc))
        return ads
    
    async def update_ad(self, ad_id: str, update_data: 'AdUpdate') -> Optional['AdContent']:
        await self.ensure_connected()
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        await self.db.advertisements.update_one(
            {"id": ad_id},
            {"$set": update_dict}
        )
        return await self.get_ad_by_id(ad_id)
    
    async def delete_ad(self, ad_id: str) -> bool:
        await self.ensure_connected()
        result = await self.db.advertisements.update_one(
            {"id": ad_id},
            {"$set": {"is_active": False}}
        )
        return result.modified_count > 0
    
    # Ad Settings Operations
    async def get_ad_settings(self) -> Optional['AdSettings']:
        await self.ensure_connected()
        settings_doc = await self.db.ad_settings.find_one()
        return AdSettings(**settings_doc) if settings_doc else None
    
    async def update_ad_settings(self, settings_data: 'AdSettingsUpdate', updated_by: str) -> 'AdSettings':
        await self.ensure_connected()
        update_dict = {k: v for k, v in settings_data.dict().items() if v is not None}
        update_dict["updated_by"] = updated_by
        update_dict["updated_at"] = datetime.utcnow()
        
        result = await self.db.ad_settings.update_one(
            {},
            {"$set": update_dict},
            upsert=True
        )
        
        return await self.get_ad_settings()
    
    # Enhanced Artist Statistics
    async def get_artist_dashboard(self, artist_id: str) -> Dict[str, Any]:
        await self.ensure_connected()
        artist = await self.get_artist_by_id(artist_id)
        if not artist:
            return {}
        
        songs = await self.get_songs_by_artist(artist_id)
        total_streams = sum(song.play_count for song in songs)
        
        # Calculate revenue (simplified - $0.004 per stream)
        total_revenue = total_streams * 0.004
        
        # Get top songs
        top_songs = sorted(songs, key=lambda x: x.play_count, reverse=True)[:5]
        
        # Mock recent activity
        recent_activity = [
            {"type": "new_stream", "song": song.title, "timestamp": datetime.utcnow()}
            for song in top_songs[:3]
        ]
        
        return {
            "artist_id": artist_id,
            "total_songs": len(songs),
            "total_streams": total_streams,
            "monthly_listeners": int(total_streams * 0.3),  # Mock data
            "total_revenue": total_revenue,
            "recent_activity": recent_activity,
            "top_songs": [{"title": song.title, "streams": song.play_count} for song in top_songs],
            "fan_demographics": {"countries": {"USA": 40, "Brazil": 25, "UK": 15, "Others": 20}}
        }
    
    async def get_artist_earnings(self, artist_id: str, start_date: str = None, end_date: str = None) -> Dict[str, Any]:
        await self.ensure_connected()
        songs = await self.get_songs_by_artist(artist_id)
        total_streams = sum(song.play_count for song in songs)
        total_earnings = total_streams * 0.004
        
        # Mock daily earnings for the last 30 days
        earnings = []
        for i in range(30):
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            earnings.append({
                "date": date,
                "amount": round(total_earnings / 30, 2)  # Distribute evenly
            })
        
        return {
            "artist_id": artist_id,
            "period": "daily",
            "earnings": earnings,
            "total_earnings": total_earnings
        }
    
    # Enhanced Label Statistics
    async def get_label_dashboard(self, label_id: str) -> Dict[str, Any]:
        await self.ensure_connected()
        artists = await self.get_artists_by_manager(label_id)
        
        total_streams = 0
        total_songs = 0
        revenue_by_artist = []
        
        for artist in artists:
            songs = await self.get_songs_by_artist(artist.id)
            artist_streams = sum(song.play_count for song in songs)
            artist_revenue = artist_streams * 0.004
            
            total_streams += artist_streams
            total_songs += len(songs)
            
            revenue_by_artist.append({
                "artist_name": artist.name,
                "streams": artist_streams,
                "revenue": artist_revenue
            })
        
        # Sort by revenue
        revenue_by_artist.sort(key=lambda x: x["revenue"], reverse=True)
        
        return {
            "label_id": label_id,
            "total_artists": len(artists),
            "total_songs": total_songs,
            "total_streams": total_streams,
            "total_revenue": total_streams * 0.004,
            "top_artists": revenue_by_artist[:5],
            "recent_activity": [],  # Mock data
            "revenue_by_artist": revenue_by_artist
        }
    
    async def get_label_earnings(self, label_id: str, start_date: str = None, end_date: str = None) -> Dict[str, Any]:
        await self.ensure_connected()
        artists = await self.get_artists_by_manager(label_id)
        
        total_earnings = 0
        earnings_by_artist = []
        
        for artist in artists:
            songs = await self.get_songs_by_artist(artist.id)
            artist_streams = sum(song.play_count for song in songs)
            artist_earnings = artist_streams * 0.004
            
            total_earnings += artist_earnings
            earnings_by_artist.append({
                "artist_name": artist.name,
                "earnings": artist_earnings
            })
        
        # Mock daily earnings for the last 30 days
        earnings_by_date = []
        for i in range(30):
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            earnings_by_date.append({
                "date": date,
                "amount": round(total_earnings / 30, 2)  # Distribute evenly
            })
        
        return {
            "label_id": label_id,
            "start_date": start_date,
            "end_date": end_date,
            "earnings_by_date": earnings_by_date,
            "earnings_by_artist": earnings_by_artist,
            "total_earnings": total_earnings
        }
    
    # Ad Impression Tracking
    async def record_ad_impression(self, user_id: str, ad_id: str, watched_duration: int, was_skipped: bool = False) -> None:
        await self.ensure_connected()
        
        # Calculate revenue based on watch time
        revenue = 0.01 if watched_duration >= 5 else 0.005  # Higher revenue for longer watches
        
        impression = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "ad_id": ad_id,
            "revenue": revenue,
            "watched_duration": watched_duration,
            "was_skipped": was_skipped,
            "timestamp": datetime.utcnow()
        }
        
        await self.db.ad_impressions.insert_one(impression)
    
    async def get_ad_statistics(self) -> Dict[str, Any]:
        await self.ensure_connected()
        
        # Get all impressions
        impressions_cursor = self.db.ad_impressions.find()
        impressions = []
        async for impression in impressions_cursor:
            impressions.append(impression)
        
        total_impressions = len(impressions)
        total_revenue = sum(imp.get("revenue", 0) for imp in impressions)
        
        # Revenue by date (last 30 days)
        revenue_by_date = {}
        for i in range(30):
            date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
            revenue_by_date[date] = 0
        
        for impression in impressions:
            date = impression["timestamp"].strftime("%Y-%m-%d")
            if date in revenue_by_date:
                revenue_by_date[date] += impression.get("revenue", 0)
        
        return {
            "total_impressions": total_impressions,
            "total_revenue": total_revenue,
            "revenue_by_date": revenue_by_date,
            "top_performing_ads": [],  # TODO: Implement
            "average_watch_time": sum(imp.get("watched_duration", 0) for imp in impressions) / max(total_impressions, 1),
            "skip_rate": sum(1 for imp in impressions if imp.get("was_skipped", False)) / max(total_impressions, 1) * 100
        }

# Global database instance
database = Database()