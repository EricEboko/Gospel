from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

# Import route modules
from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.artists import router as artists_router
from routes.songs import router as songs_router
from routes.statistics import router as statistics_router
from database import database

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(
    title="GospelSpot API",
    description="Christian Music Streaming Platform API",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "message": "GospelSpot API is running"}

# Include all route modules
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(artists_router)
api_router.include_router(songs_router)
api_router.include_router(statistics_router)

# Include the main router in the app
app.include_router(api_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    logger.info("Starting GospelSpot API server...")
    await database.connect()
    logger.info("Database connection established")

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Shutting down GospelSpot API server...")
    await database.close()

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to GospelSpot API",
        "version": "1.0.0",
        "documentation": "/docs"
    }
