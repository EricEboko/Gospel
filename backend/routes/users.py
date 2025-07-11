from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime

from ..models import (
    User, UserCreate, UserUpdate, UserResponse, UserRole, UserStatus
)
from ..auth import get_current_active_user, require_role, get_password_hash
from ..database import database

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    role: Optional[UserRole] = None,
    status: Optional[UserStatus] = None,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Get all users (Super Admin only)"""
    if role:
        users = await database.get_users_by_role(role.value)
    else:
        users = await database.get_all_users(skip=skip, limit=limit)
    
    # Filter by status if specified
    if status:
        users = [user for user in users if user.status == status]
    
    return [
        UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            phone_number=user.phone_number,
            country=user.country,
            language=user.language,
            role=user.role,
            status=user.status,
            subscription_plan=user.subscription_plan,
            email_verified=user.email_verified,
            created_at=user.created_at,
            last_login=user.last_login,
            stats=user.stats
        )
        for user in users
    ]

@router.post("/", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Create a new user (Super Admin only)"""
    # Check if user already exists
    existing_user = await database.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password and create user
    password_hash = get_password_hash(user_data.password)
    user = await database.create_user(user_data, password_hash, None)
    
    # Auto-verify email for admin-created users
    await database.verify_user_email(user.id)
    
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        country=user.country,
        language=user.language,
        role=user.role,
        status=user.status,
        subscription_plan=user.subscription_plan,
        email_verified=True,
        created_at=user.created_at,
        last_login=user.last_login,
        stats=user.stats
    )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get user by ID"""
    # Users can only see their own profile unless they're super admin
    if current_user.role != UserRole.SUPER_ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this user"
        )
    
    user = await database.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        country=user.country,
        language=user.language,
        role=user.role,
        status=user.status,
        subscription_plan=user.subscription_plan,
        email_verified=user.email_verified,
        created_at=user.created_at,
        last_login=user.last_login,
        stats=user.stats
    )

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    update_data: UserUpdate,
    current_user = Depends(get_current_active_user)
):
    """Update user"""
    # Users can only update their own profile unless they're super admin
    if current_user.role != UserRole.SUPER_ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user"
        )
    
    user = await database.update_user(user_id, update_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        country=user.country,
        language=user.language,
        role=user.role,
        status=user.status,
        subscription_plan=user.subscription_plan,
        email_verified=user.email_verified,
        created_at=user.created_at,
        last_login=user.last_login,
        stats=user.stats
    )

@router.post("/{user_id}/block")
async def block_user(
    user_id: str,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Block user (Super Admin only)"""
    user = await database.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await database.db.users.update_one(
        {"id": user_id},
        {"$set": {"status": UserStatus.BLOCKED, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "User blocked successfully"}

@router.post("/{user_id}/unblock")
async def unblock_user(
    user_id: str,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Unblock user (Super Admin only)"""
    user = await database.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await database.db.users.update_one(
        {"id": user_id},
        {"$set": {"status": UserStatus.ACTIVE, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "User unblocked successfully"}

@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    remove_artists: bool = Query(False),
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Delete user (Super Admin only)"""
    user = await database.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # If user is a label/manager, handle their artists
    if user.role == UserRole.LABEL_MANAGER:
        artists = await database.get_artists_by_manager(user_id)
        if artists:
            if remove_artists:
                # Delete all artists managed by this user
                for artist in artists:
                    # Delete all songs by this artist
                    songs = await database.get_songs_by_artist(artist.id)
                    for song in songs:
                        await database.delete_song(song.id)
                    # Delete the artist
                    await database.delete_artist(artist.id)
            else:
                # Set artists as unmanaged (free artists)
                await database.db.artists.update_many(
                    {"managed_by": user_id},
                    {"$unset": {"managed_by": ""}}
                )
    
    # Delete the user
    success = await database.delete_user(user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete user"
        )
    
    return {"message": "User deleted successfully"}

@router.get("/labels/managers", response_model=List[UserResponse])
async def get_label_managers(
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Get all label managers"""
    users = await database.get_users_by_role(UserRole.LABEL_MANAGER.value)
    
    return [
        UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            phone_number=user.phone_number,
            country=user.country,
            language=user.language,
            role=user.role,
            status=user.status,
            subscription_plan=user.subscription_plan,
            email_verified=user.email_verified,
            created_at=user.created_at,
            last_login=user.last_login,
            stats=user.stats
        )
        for user in users
    ]