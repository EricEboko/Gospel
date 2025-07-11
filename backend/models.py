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

# Google Ads Models
class AdImpression(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    ad_unit_id: str
    revenue: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
class AdStats(BaseModel):
    total_impressions: int
    total_revenue: float
    revenue_by_date: Dict[str, float]
    top_performing_units: List[Dict[str, Any]]