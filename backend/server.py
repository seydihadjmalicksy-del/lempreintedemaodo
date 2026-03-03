"""
Main FastAPI application - Tariqa Tidiane de Tivaouane
Refactored modular structure
"""
from fastapi import FastAPI, APIRouter
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path

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
    dynamic_pages_router,
    homepage_sections_router,
    media_router
)

# Create the main app
app = FastAPI(
    title="L'empreinte de Maodo API",
    description="API pour le portail de la Tariqa Tidiane de Tivaouane",
    version="2.0.0",
    redirect_slashes=False
)

# Create API router with prefix
api_router = APIRouter(prefix="/api")

# CORS middleware - must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes liveness/readiness probes"""
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


@app.post("/health")
async def health_check_post():
    """Health check POST endpoint for production deployment probes"""
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected", "method": "POST"}
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


@api_router.post("/health")
async def api_health_check_post():
    """Health check POST endpoint via /api/health"""
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected", "method": "POST"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


@api_router.get("/")
async def root():
    return {"message": "Bienvenue sur le site de la Tariqa Tidiane de Tivaouane"}


@api_router.post("/")
async def root_post():
    """Handle POST to /api/ - prevents 307 redirect in production"""
    return {"message": "Bienvenue sur le site de la Tariqa Tidiane de Tivaouane", "method": "POST"}


# Direct routes for /api without trailing slash (some deployment probes call this)
@app.get("/api")
async def api_root_no_slash():
    """Handle GET to /api without trailing slash"""
    return {"message": "Bienvenue sur le site de la Tariqa Tidiane de Tivaouane"}


@app.post("/api")
async def api_root_post_no_slash():
    """Handle POST to /api without trailing slash - for deployment probes"""
    return {"message": "Bienvenue sur le site de la Tariqa Tidiane de Tivaouane", "method": "POST"}


# ============== DATA INITIALIZATION ENDPOINTS ==============
# Simple in-memory flag to prevent repeated initialization calls
_init_completed = False

@api_router.post("/init-data")
async def init_data():
    """Initialize default data for production deployment - runs only once"""
    global _init_completed
    
    # Quick return if already initialized in this instance
    if _init_completed:
        return {"message": "Already initialized", "skipped": True}
    
    results = {
        "dynamic_pages": 0,
        "admin_user": False,
        "message": "Initialization complete"
    }
    
    try:
        # Check if data already exists (quick check)
        pages_count = await db.dynamic_pages.count_documents({})
        admin_exists = await db.admin_users.find_one({"username": "admin"}, {"_id": 1})
        
        # If both exist, mark as completed and return
        if pages_count > 0 and admin_exists:
            _init_completed = True
            return {"message": "Data already exists", "skipped": True}
        
        # Seed default dynamic pages if none exist
        if pages_count == 0:
            default_pages = get_default_pages()
            for page_data in default_pages:
                page_data['id'] = str(uuid.uuid4())
                page_data['active'] = True
                page_data['show_in_menu'] = True
                page_data['created_at'] = datetime.now(timezone.utc).isoformat()
                page_data['updated_at'] = datetime.now(timezone.utc).isoformat()
                await db.dynamic_pages.insert_one(page_data)
                results["dynamic_pages"] += 1
        
        # Ensure admin user exists
        if not admin_exists:
            from passlib.hash import bcrypt
            admin_user = {
                "id": str(uuid.uuid4()),
                "username": "admin",
                "password_hash": bcrypt.hash("tivaouane2025"),
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.admin_users.insert_one(admin_user)
            results["admin_user"] = True
        
        _init_completed = True
    except Exception as e:
        logger.error(f"Init data error: {e}")
        results["error"] = str(e)
    
    return results


@api_router.post("/admin/seed")
async def admin_seed():
    """Alias for init-data - seed initial data (cached)"""
    return await init_data()


def get_default_pages():
    """Return default pages for seeding"""
    return [
        {
            "slug": "histoire/origines",
            "titre": {"fr": "Les Origines de la Tijaniyya", "en": "Origins of the Tijaniyya", "ar": "أصول الطريقة التجانية"},
            "description": {"fr": "L'histoire d'une voie soufie qui a traversé les siècles", "en": "The history of a Sufi path that has crossed centuries"},
            "hero_image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg",
            "hero_icon": "BookOpen",
            "parent_menu": "histoire",
            "menu_order": 1,
            "sections": [
                {"type": "text", "titre": {"fr": "La Genèse", "en": "The Genesis"}, "contenu": {"fr": "La Tariqa Tijaniyya fut fondée par Cheikh Ahmed Tijani (1735-1815) à Fès, au Maroc.", "en": "The Tijaniyya Tariqa was founded by Sheikh Ahmed Tijani."}, "order": 1, "visible": True}
            ]
        },
        {
            "slug": "histoire/el-hadji-malick-sy",
            "titre": {"fr": "El Hadji Malick Sy - Maodo", "en": "El Hadji Malick Sy - Maodo", "ar": "الحاج مالك سي"},
            "description": {"fr": "Celui qui a fait de Tivaouane le phare de la spiritualité", "en": "The one who made Tivaouane the beacon of spirituality"},
            "hero_image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg",
            "hero_icon": "Star",
            "parent_menu": "histoire",
            "menu_order": 2,
            "sections": [
                {"type": "text", "titre": {"fr": "Introduction", "en": "Introduction"}, "contenu": {"fr": "El Hadji Malick Sy est une figure monumentale de l'Islam ouest-africain.", "en": "El Hadji Malick Sy is a monumental figure in West African Islam."}, "order": 1, "visible": True}
            ]
        },
        {
            "slug": "histoire/maodo",
            "titre": {"fr": "El Hadji Malick Sy (Maodo)", "en": "El Hadji Malick Sy (Maodo)"},
            "description": {"fr": "La vie et l'œuvre du fondateur", "en": "Life and work of the founder"},
            "hero_icon": "Star",
            "parent_menu": "histoire",
            "menu_order": 3,
            "sections": []
        },
        {
            "slug": "histoire/khalifes",
            "titre": {"fr": "La Lignée des Héritiers", "en": "The Lineage of Heirs", "ar": "سلالة الورثة"},
            "description": {"fr": "Les successeurs spirituels de Maodo", "en": "The spiritual successors of Maodo"},
            "hero_icon": "Users",
            "parent_menu": "histoire",
            "menu_order": 4,
            "sections": []
        },
        {
            "slug": "histoire/geographie",
            "titre": {"fr": "Géographie Sacrée", "en": "Sacred Geography"},
            "description": {"fr": "Les lieux saints de Tivaouane", "en": "The holy places of Tivaouane"},
            "hero_icon": "MapPin",
            "parent_menu": "histoire",
            "menu_order": 5,
            "sections": []
        },
        {
            "slug": "enseignements/piliers",
            "titre": {"fr": "Les Piliers de la Tariqa", "en": "Pillars of the Tariqa", "ar": "أركان الطريقة"},
            "description": {"fr": "Les fondements spirituels de la voie Tijaniyya", "en": "The spiritual foundations of the Tijaniyya path"},
            "hero_icon": "Heart",
            "parent_menu": "enseignements",
            "menu_order": 1,
            "sections": []
        },
        {
            "slug": "enseignements/ecole",
            "titre": {"fr": "L'École de Tivaouane", "en": "The School of Tivaouane"},
            "description": {"fr": "L'héritage éducatif de Maodo", "en": "Maodo's educational legacy"},
            "hero_icon": "GraduationCap",
            "parent_menu": "enseignements",
            "menu_order": 2,
            "sections": []
        },
        {
            "slug": "evenements/gamou",
            "titre": {"fr": "Le Gamou", "en": "The Gamou", "ar": "المولد"},
            "description": {"fr": "La célébration de la naissance du Prophète", "en": "Celebration of the Prophet's birth"},
            "hero_icon": "Calendar",
            "parent_menu": "evenements",
            "menu_order": 1,
            "sections": []
        },
        {
            "slug": "evenements/ziarra",
            "titre": {"fr": "Les Ziarra Annuelles", "en": "Annual Pilgrimages"},
            "description": {"fr": "Les pèlerinages aux lieux saints", "en": "Pilgrimages to holy places"},
            "hero_icon": "MapPin",
            "parent_menu": "evenements",
            "menu_order": 2,
            "sections": []
        },
        {
            "slug": "evenements/ceremonies",
            "titre": {"fr": "Cérémonies Religieuses", "en": "Religious Ceremonies"},
            "description": {"fr": "Les cérémonies de la Tariqa", "en": "Ceremonies of the Tariqa"},
            "hero_icon": "Star",
            "parent_menu": "evenements",
            "menu_order": 3,
            "sections": []
        }
    ]


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
api_router.include_router(homepage_sections_router)
api_router.include_router(media_router)

# Include the API router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============== STATIC FILES FOR UPLOADS ==============
# Mount the uploads directory to serve uploaded media files
UPLOAD_DIR = Path("/app/frontend/public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Mount static files for uploads - this allows files to be served at /uploads/filename
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


@app.on_event("startup")
async def startup_db_client():
    """Test database connection on startup"""
    try:
        await db.command("ping")
        logger.info("MongoDB connection successful")
    except Exception as e:
        logger.warning(f"MongoDB connection test failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db_connection()
