from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class UserRole(str, Enum):
    USER = "user"
    ARTIST = "artist"
    LABEL_MANAGER = "label_manager"
    SUPER_ADMIN = "super_admin"

class UserStatus(str, Enum):
    PENDING = "pending"  # Email not verified
    ACTIVE = "active"
    BLOCKED = "blocked"
    DELETED = "deleted"

class SubscriptionPlan(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    FAMILY = "family"
    STUDENT = "student"

# User Models
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    country: Optional[str] = None
    language: str = "en"
    
class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.USER
    
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    country: Optional[str] = None
    language: Optional[str] = None
    subscription_plan: Optional[SubscriptionPlan] = None
    
class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: UserRole
    status: UserStatus = UserStatus.PENDING
    subscription_plan: SubscriptionPlan = SubscriptionPlan.FREE
    email_verified: bool = False
    email_verification_token: Optional[str] = None
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    # For artists
    artist_info: Optional[Dict[str, Any]] = None
    
    # For label/managers
    label_info: Optional[Dict[str, Any]] = None
    managed_artists: List[str] = []  # List of artist IDs
    
    # Statistics
    stats: Dict[str, Any] = {}

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str]
    country: Optional[str]
    language: str
    role: UserRole
    status: UserStatus
    subscription_plan: SubscriptionPlan
    email_verified: bool
    created_at: datetime
    last_login: Optional[datetime]
    stats: Dict[str, Any]

# Artist Models
class ArtistBase(BaseModel):
    name: str
    bio: Optional[str] = None
    genre: Optional[str] = None
    country: Optional[str] = None
    image_base64: Optional[str] = None
    website: Optional[str] = None
    social_links: Dict[str, str] = {}
    
class ArtistCreate(ArtistBase):
    user_id: Optional[str] = None  # If artist is a registered user
    
class ArtistUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    genre: Optional[str] = None
    country: Optional[str] = None
    image_base64: Optional[str] = None
    website: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    
class Artist(ArtistBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    managed_by: Optional[str] = None  # Label/Manager ID
    verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Statistics
    total_streams: int = 0
    monthly_listeners: int = 0
    followers: int = 0
    total_songs: int = 0

# Song Models
class SongBase(BaseModel):
    title: str
    artist_id: str
    album: Optional[str] = None
    genre: Optional[str] = None
    duration: Optional[str] = None
    lyrics: Optional[str] = None
    youtube_url: Optional[str] = None
    image_base64: Optional[str] = None
    language: str = "en"
    country: Optional[str] = None
    
class SongCreate(SongBase):
    audio_file_base64: Optional[str] = None
    
class SongUpdate(BaseModel):
    title: Optional[str] = None
    album: Optional[str] = None
    genre: Optional[str] = None
    duration: Optional[str] = None
    lyrics: Optional[str] = None
    youtube_url: Optional[str] = None
    image_base64: Optional[str] = None
    language: Optional[str] = None
    country: Optional[str] = None
    audio_file_base64: Optional[str] = None
    
class Song(SongBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    audio_file_base64: Optional[str] = None
    audioUrl: Optional[str] = None  # For testing with external audio URLs
    artist_name: Optional[str] = None  # Populated from artist lookup
    created_by: str  # User ID who created the song
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Statistics
    play_count: int = 0
    likes: int = 0
    streams_today: int = 0
    streams_this_week: int = 0
    streams_this_month: int = 0

# Authentication Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
    
class EmailVerificationRequest(BaseModel):
    token: str
    
class PasswordResetRequest(BaseModel):
    email: EmailStr
    
class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

# Statistics Models
class ArtistStats(BaseModel):
    artist_id: str
    total_streams: int
    monthly_listeners: int
    top_songs: List[Dict[str, Any]]
    streams_by_country: Dict[str, int]
    streams_by_date: Dict[str, int]
    
class LabelStats(BaseModel):
    label_id: str
    total_artists: int
    total_streams: int
    top_artists: List[Dict[str, Any]]
    revenue_estimates: Dict[str, float]
    
class PlatformStats(BaseModel):
    total_users: int
    active_users: int
    total_streams: int
    revenue: float
    top_genres: List[Dict[str, Any]]
    user_growth: Dict[str, int]

# Advertisement Models
class AdContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    file_type: str  # 'video' or 'audio'
    file_base64: str  # Base64 encoded file content
    duration: int  # Duration in seconds
    skip_after: int = 5  # Seconds before skip button appears
    created_by: str  # User ID who created the ad
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    
class AdCreate(BaseModel):
    title: str
    description: Optional[str] = None
    file_type: str
    file_base64: str
    duration: int
    skip_after: int = 5
    
class AdUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    duration: Optional[int] = None
    skip_after: Optional[int] = None
    is_active: Optional[bool] = None

class AdSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ad_frequency: int = 3  # Show ad every N songs
    min_stream_length: int = 30  # Minimum seconds streamed before ad
    min_ad_duration: int = 5  # Minimum seconds before skip button
    max_ad_duration: int = 60  # Maximum ad duration
    updated_by: str  # User ID who last updated settings
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
class AdSettingsUpdate(BaseModel):
    ad_frequency: Optional[int] = None
    min_stream_length: Optional[int] = None
    min_ad_duration: Optional[int] = None
    max_ad_duration: Optional[int] = None

class AdImpression(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    ad_id: str
    revenue: float
    watched_duration: int  # How long user watched the ad
    was_skipped: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
class AdStats(BaseModel):
    total_impressions: int
    total_revenue: float
    revenue_by_date: Dict[str, float]
    top_performing_ads: List[Dict[str, Any]]
    average_watch_time: float
    skip_rate: float

# Artist Dashboard Models  
class ArtistDashboard(BaseModel):
    artist_id: str
    total_songs: int
    total_streams: int
    monthly_listeners: int
    total_revenue: float
    recent_activity: List[Dict[str, Any]]
    top_songs: List[Dict[str, Any]]
    fan_demographics: Dict[str, Any]
    
class ArtistEarnings(BaseModel):
    artist_id: str
    period: str  # 'daily', 'weekly', 'monthly', 'yearly'
    earnings: List[Dict[str, Any]]  # [{date: str, amount: float}]
    total_earnings: float
    
# Label Manager Enhanced Models
class LabelDashboard(BaseModel):
    label_id: str
    total_artists: int
    total_songs: int
    total_streams: int
    total_revenue: float
    top_artists: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
    revenue_by_artist: List[Dict[str, Any]]

class LabelEarnings(BaseModel):
    label_id: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    earnings_by_date: List[Dict[str, Any]]
    earnings_by_artist: List[Dict[str, Any]]
    total_earnings: float