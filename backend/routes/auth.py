from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from datetime import datetime, timedelta
from typing import Optional

from ..models import (
    UserCreate, UserResponse, LoginRequest, LoginResponse, 
    EmailVerificationRequest, PasswordResetRequest, PasswordResetConfirm,
    UserRole, UserStatus
)
from ..auth import (
    get_password_hash, verify_password, create_access_token,
    generate_email_verification_token, send_verification_email,
    send_password_reset_email, get_current_user, get_current_active_user
)
from ..database import database

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await database.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password and generate verification token
    password_hash = get_password_hash(user_data.password)
    verification_token = generate_email_verification_token()
    
    # Create user
    user = await database.create_user(user_data, password_hash, verification_token)
    
    # Send verification email
    await send_verification_email(user.email, verification_token)
    
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

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """Login user"""
    user = await database.get_user_by_email(login_data.email)
    
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please verify your email before logging in"
        )
    
    if user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is not active"
        )
    
    # Update last login
    await database.db.users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
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
    )

@router.post("/verify-email")
async def verify_email(verification_data: EmailVerificationRequest):
    """Verify user email"""
    user = await database.get_user_by_verification_token(verification_data.token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    success = await database.verify_user_email(user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to verify email"
        )
    
    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
async def resend_verification(email: str):
    """Resend verification email"""
    user = await database.get_user_by_email(email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Generate new verification token
    verification_token = generate_email_verification_token()
    await database.db.users.update_one(
        {"id": user.id},
        {"$set": {"email_verification_token": verification_token}}
    )
    
    # Send verification email
    await send_verification_email(user.email, verification_token)
    
    return {"message": "Verification email sent"}

@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    """Request password reset"""
    user = await database.get_user_by_email(request.email)
    
    if not user:
        # Don't reveal if user exists or not
        return {"message": "If the email exists, a password reset link has been sent"}
    
    # Generate reset token
    reset_token = generate_email_verification_token()
    
    # Store reset token with expiry
    await database.db.users.update_one(
        {"id": user.id},
        {
            "$set": {
                "password_reset_token": reset_token,
                "password_reset_expires": datetime.utcnow() + timedelta(hours=1)
            }
        }
    )
    
    # Send reset email
    await send_password_reset_email(user.email, reset_token)
    
    return {"message": "If the email exists, a password reset link has been sent"}

@router.post("/reset-password")
async def reset_password(request: PasswordResetConfirm):
    """Reset password with token"""
    user_doc = await database.db.users.find_one({
        "password_reset_token": request.token,
        "password_reset_expires": {"$gt": datetime.utcnow()}
    })
    
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Update password
    password_hash = get_password_hash(request.new_password)
    await database.db.users.update_one(
        {"id": user_doc["id"]},
        {
            "$set": {
                "password_hash": password_hash,
                "updated_at": datetime.utcnow()
            },
            "$unset": {
                "password_reset_token": "",
                "password_reset_expires": ""
            }
        }
    )
    
    return {"message": "Password reset successfully"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_active_user)):
    """Get current user information"""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        phone_number=current_user.phone_number,
        country=current_user.country,
        language=current_user.language,
        role=current_user.role,
        status=current_user.status,
        subscription_plan=current_user.subscription_plan,
        email_verified=current_user.email_verified,
        created_at=current_user.created_at,
        last_login=current_user.last_login,
        stats=current_user.stats
    )

@router.post("/logout")
async def logout(current_user = Depends(get_current_active_user)):
    """Logout user"""
    # In a real implementation, you might want to blacklist the token
    return {"message": "Logged out successfully"}