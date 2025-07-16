from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional

from models import (
    AdContent, AdCreate, AdUpdate, AdSettings, AdSettingsUpdate,
    UserRole
)
from auth import get_current_active_user, require_role
from database import database

router = APIRouter(prefix="/advertisements", tags=["advertisements"])

@router.get("/", response_model=List[AdContent])
async def get_advertisements(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Get all advertisements (Super Admin only)"""
    ads = await database.get_all_ads(skip=skip, limit=limit)
    return ads

@router.post("/", response_model=AdContent)
async def create_advertisement(
    ad_data: AdCreate,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Create a new advertisement (Super Admin only)"""
    ad = await database.create_ad(ad_data, current_user.id)
    return ad

@router.get("/{ad_id}", response_model=AdContent)
async def get_advertisement(
    ad_id: str,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Get advertisement by ID (Super Admin only)"""
    ad = await database.get_ad_by_id(ad_id)
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement not found"
        )
    return ad

@router.put("/{ad_id}", response_model=AdContent)
async def update_advertisement(
    ad_id: str,
    update_data: AdUpdate,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Update advertisement (Super Admin only)"""
    ad = await database.get_ad_by_id(ad_id)
    if not ad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement not found"
        )
    
    updated_ad = await database.update_ad(ad_id, update_data)
    return updated_ad

@router.delete("/{ad_id}")
async def delete_advertisement(
    ad_id: str,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Delete advertisement (Super Admin only)"""
    success = await database.delete_ad(ad_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Advertisement not found"
        )
    return {"message": "Advertisement deleted successfully"}

@router.get("/settings/current")
async def get_ad_settings(
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Get current ad settings (Super Admin only)"""
    settings = await database.get_ad_settings()
    if not settings:
        # Return default settings if none exist
        return {
            "ad_frequency": 3,
            "min_stream_length": 30,
            "min_ad_duration": 5,
            "max_ad_duration": 60
        }
    return settings

@router.put("/settings/")
async def update_ad_settings(
    settings_data: AdSettingsUpdate,
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Update ad settings (Super Admin only)"""
    updated_settings = await database.update_ad_settings(settings_data, current_user.id)
    return updated_settings

@router.post("/impressions/{ad_id}")
async def record_ad_impression(
    ad_id: str,
    watched_duration: int,
    was_skipped: bool = False,
    current_user = Depends(get_current_active_user)
):
    """Record an ad impression"""
    await database.record_ad_impression(current_user.id, ad_id, watched_duration, was_skipped)
    return {"message": "Ad impression recorded successfully"}

@router.get("/statistics/")
async def get_ad_statistics(
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Get advertisement statistics (Super Admin only)"""
    stats = await database.get_ad_statistics()
    return stats