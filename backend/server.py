"""
Main FastAPI application - Tariqa Tidiane de Tivaouane
Refactored modular structure
"""
from fastapi import FastAPI, APIRouter
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
import os
import logging

from database import db, close_db_connection
from routers import (
    videos_router,
    newsletter_router,
    contact_router,
    quotes_router,
    events_router,
    content_router,
    admin_router,
    khalifes_router,
    archives_router,
    family_tree_router,
    ouvrages_router,
    search_router,
    calendar_router,
    notifications_router,
    wattu_router,
    dynamic_pages_router
)

# Create the main app
app = FastAPI(
    title="L'empreinte de Maodo API",
    description="API pour le portail de la Tariqa Tidiane de Tivaouane",
    version="2.0.0"
)

# Create API router with prefix
api_router = APIRouter(prefix="/api")


# Health check endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes liveness/readiness probes"""
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


@api_router.get("/health")
async def api_health_check():
    """Health check endpoint accessible via /api/health"""
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


@api_router.get("/")
async def root():
    return {"message": "Bienvenue sur le site de la Tariqa Tidiane de Tivaouane"}


# Include all routers
api_router.include_router(videos_router)
api_router.include_router(newsletter_router)
api_router.include_router(contact_router)
api_router.include_router(quotes_router)
api_router.include_router(events_router)
api_router.include_router(content_router)
api_router.include_router(admin_router)
api_router.include_router(khalifes_router)
api_router.include_router(archives_router)
api_router.include_router(family_tree_router)
api_router.include_router(ouvrages_router)
api_router.include_router(search_router)
api_router.include_router(calendar_router)
api_router.include_router(notifications_router)
api_router.include_router(wattu_router)
api_router.include_router(dynamic_pages_router)

# Include the API router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db_connection()
