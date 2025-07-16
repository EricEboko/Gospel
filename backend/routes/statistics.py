from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta

from models import UserRole, PlatformStats, ArtistStats, LabelStats
from auth import get_current_active_user, require_role
from database import database

router = APIRouter(prefix="/statistics", tags=["statistics"])

@router.get("/artist/{artist_id}")
async def get_artist_statistics(
    artist_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get detailed statistics for an artist"""
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
    
    # Get additional analytics
    songs = await database.get_songs_by_artist(artist_id)
    
    # Calculate revenue estimates (simplified)
    total_streams = sum(song.play_count for song in songs)
    estimated_revenue = total_streams * 0.004  # $0.004 per stream (example rate)
    
    # Get top countries (mock data for now)
    top_countries = {
        "USA": int(total_streams * 0.4),
        "Brazil": int(total_streams * 0.2),
        "UK": int(total_streams * 0.15),
        "Nigeria": int(total_streams * 0.1),
        "Others": int(total_streams * 0.15)
    }
    
    # Get streams by date (last 30 days)
    streams_by_date = {}
    for i in range(30):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        # Mock data - in production, this would be from actual analytics
        streams_by_date[date] = int(total_streams * 0.03)  # Distribute evenly
    
    return {
        **stats,
        "estimated_revenue": estimated_revenue,
        "top_countries": top_countries,
        "streams_by_date": streams_by_date,
        "growth_rate": 12.5,  # Mock growth rate
        "engagement_rate": 8.2,  # Mock engagement rate
    }

@router.get("/artist/{artist_id}/dashboard")
async def get_artist_dashboard(
    artist_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get artist dashboard data"""
    artist = await database.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    # Check permissions - artist can view their own dashboard
    if (current_user.role == UserRole.ARTIST and artist.user_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this dashboard"
        )
    
    # Label managers can view their artists' dashboards
    if (current_user.role == UserRole.LABEL_MANAGER and artist.managed_by != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this dashboard"
        )
    
    dashboard_data = await database.get_artist_dashboard(artist_id)
    return dashboard_data

@router.get("/artist/{artist_id}/earnings")
async def get_artist_earnings(
    artist_id: str,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user = Depends(get_current_active_user)
):
    """Get artist earnings data"""
    artist = await database.get_artist_by_id(artist_id)
    if not artist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Artist not found"
        )
    
    # Check permissions
    if (current_user.role == UserRole.ARTIST and artist.user_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view earnings"
        )
    
    if (current_user.role == UserRole.LABEL_MANAGER and artist.managed_by != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view earnings"
        )
    
    earnings_data = await database.get_artist_earnings(artist_id, start_date, end_date)
    return earnings_data

@router.get("/label/{label_id}")
async def get_label_statistics(
    label_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get statistics for a label/manager"""
    # Check permissions
    if (current_user.role == UserRole.LABEL_MANAGER and 
        current_user.id != label_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view these statistics"
        )
    
    if current_user.role not in [UserRole.LABEL_MANAGER, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view label statistics"
        )
    
    stats = await database.get_label_statistics(label_id)
    
    # Calculate additional metrics
    total_streams = stats.get("total_streams", 0)
    estimated_revenue = total_streams * 0.004  # $0.004 per stream
    
    # Get performance by artist
    artist_performance = []
    artists = await database.get_artists_by_manager(label_id)
    
    for artist in artists:
        artist_songs = await database.get_songs_by_artist(artist.id)
        artist_streams = sum(song.play_count for song in artist_songs)
        artist_revenue = artist_streams * 0.004
        
        artist_performance.append({
            "artist_id": artist.id,
            "artist_name": artist.name,
            "total_streams": artist_streams,
            "estimated_revenue": artist_revenue,
            "song_count": len(artist_songs)
        })
    
    # Sort by revenue
    artist_performance.sort(key=lambda x: x["estimated_revenue"], reverse=True)
    
    return {
        **stats,
        "estimated_revenue": estimated_revenue,
        "artist_performance": artist_performance,
        "top_genres": ["Gospel", "Contemporary Christian", "Praise & Worship"],  # Mock data
        "growth_metrics": {
            "monthly_growth": 15.2,
            "new_listeners": 1250,
            "retention_rate": 78.5
        }
    }

@router.get("/my/label")
async def get_my_label_statistics(
    current_user = Depends(require_role([UserRole.LABEL_MANAGER]))
):
    """Get statistics for current user's label"""
    return await get_label_statistics(current_user.id, current_user)

@router.get("/label/{label_id}/dashboard")
async def get_label_dashboard(
    label_id: str,
    current_user = Depends(get_current_active_user)
):
    """Get label dashboard data"""
    # Check permissions
    if (current_user.role == UserRole.LABEL_MANAGER and current_user.id != label_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this dashboard"
        )
    
    if current_user.role not in [UserRole.LABEL_MANAGER, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view label dashboard"
        )
    
    dashboard_data = await database.get_label_dashboard(label_id)
    return dashboard_data

@router.get("/label/{label_id}/earnings")
async def get_label_earnings(
    label_id: str,
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    current_user = Depends(get_current_active_user)
):
    """Get label earnings data with date filtering"""
    # Check permissions
    if (current_user.role == UserRole.LABEL_MANAGER and current_user.id != label_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view earnings"
        )
    
    if current_user.role not in [UserRole.LABEL_MANAGER, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view label earnings"
        )
    
    earnings_data = await database.get_label_earnings(label_id, start_date, end_date)
    return earnings_data

@router.get("/platform")
async def get_platform_statistics(
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Get platform-wide statistics (Super Admin only)"""
    # Get all users
    users = await database.get_all_users()
    active_users = [user for user in users if user.status == "active"]
    
    # Get all songs
    songs = await database.get_all_songs()
    total_streams = sum(song.play_count for song in songs)
    
    # Calculate revenue from streams
    stream_revenue = total_streams * 0.004
    
    # Get ad revenue
    ad_stats = await database.get_ad_statistics()
    ad_revenue = ad_stats.get("total_revenue", 0)
    
    total_revenue = stream_revenue + ad_revenue
    
    # Get user growth data (mock)
    user_growth = {}
    for i in range(30):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        user_growth[date] = len(active_users) + (i * 2)  # Mock growth
    
    return {
        "total_users": len(users),
        "active_users": len(active_users),
        "total_streams": total_streams,
        "revenue": total_revenue,
        "stream_revenue": stream_revenue,
        "ad_revenue": ad_revenue,
        "total_songs": len(songs),
        "user_growth": user_growth,
        "top_genres": ["Gospel", "Contemporary Christian", "Praise & Worship"],
        "platform_metrics": {
            "avg_session_length": 45.2,
            "bounce_rate": 12.8,
            "conversion_rate": 3.5
        }
    }

@router.get("/dashboard")
async def get_dashboard_statistics(
    current_user = Depends(get_current_active_user)
):
    """Get dashboard statistics based on user role"""
    if current_user.role == UserRole.SUPER_ADMIN:
        return await get_platform_statistics(current_user)
    elif current_user.role == UserRole.LABEL_MANAGER:
        return await get_label_dashboard(current_user.id, current_user)
    elif current_user.role == UserRole.ARTIST:
        # Find artist record for this user
        artists = await database.get_all_artists()
        user_artist = None
        for artist in artists:
            if artist.user_id == current_user.id:
                user_artist = artist
                break
        
        if user_artist:
            return await get_artist_dashboard(user_artist.id, current_user)
        else:
            return {"error": "Artist profile not found"}
    else:
        # Regular user - return basic stats
        songs = await database.get_all_songs()
        return {
            "total_songs": len(songs),
            "message": "Welcome to GospelSpot!"
        }



@router.get("/revenue/ads")
async def get_ads_revenue(
    current_user = Depends(require_role([UserRole.SUPER_ADMIN]))
):
    """Get Google Ads revenue statistics"""
    # Mock ads revenue data
    # In production, this would integrate with Google AdSense API
    
    today = datetime.now().date()
    revenue_data = {}
    
    # Generate mock data for last 30 days
    for i in range(30):
        date = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        # Mock revenue between $50-200 per day
        revenue_data[date] = round(150 + (i * 2.5), 2)
    
    total_revenue = sum(revenue_data.values())
    
    # Top performing ad units (mock)
    top_ad_units = [
        {
            "unit_id": "ca-pub-1234567890123456/1234567890",
            "unit_name": "Banner - Homepage",
            "revenue": 1245.67,
            "impressions": 45678,
            "ctr": 2.3
        },
        {
            "unit_id": "ca-pub-1234567890123456/2345678901",
            "unit_name": "Interstitial - Song Plays",
            "revenue": 987.43,
            "impressions": 23456,
            "ctr": 4.2
        },
        {
            "unit_id": "ca-pub-1234567890123456/3456789012",
            "unit_name": "Native - Playlist",
            "revenue": 654.32,
            "impressions": 34567,
            "ctr": 1.9
        }
    ]
    
    return {
        "total_revenue": total_revenue,
        "revenue_by_date": revenue_data,
        "top_ad_units": top_ad_units,
        "total_impressions": sum(unit["impressions"] for unit in top_ad_units),
        "average_ctr": sum(unit["ctr"] for unit in top_ad_units) / len(top_ad_units),
        "revenue_growth": 15.7,  # Mock growth rate
        "projected_monthly_revenue": total_revenue * 1.2
    }