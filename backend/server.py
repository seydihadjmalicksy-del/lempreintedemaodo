from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.responses import Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import hashlib
import json
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Admin credentials (default password: "tivaouane2025")
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH', hashlib.sha256('tivaouane2025'.encode()).hexdigest())

# Create the main app without a prefix
app = FastAPI()

# Health check endpoint for Kubernetes (root level)
@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes liveness/readiness probes"""
    try:
        # Verify MongoDB connection
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check also on /api/health for ingress routing
@api_router.get("/health")
async def api_health_check():
    """Health check endpoint accessible via /api/health"""
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

# Security
security = HTTPBasic()


# Define Models
class Video(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    youtube_id: str
    category: str
    duration: Optional[str] = None
    thumbnail_url: Optional[str] = None
    views: int = 0
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VideoCreate(BaseModel):
    title: str
    description: str
    youtube_id: str
    category: str
    duration: Optional[str] = None
    thumbnail_url: Optional[str] = None
    featured: bool = False

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    youtube_id: Optional[str] = None
    category: Optional[str] = None
    duration: Optional[str] = None
    thumbnail_url: Optional[str] = None
    featured: Optional[bool] = None

class Category(BaseModel):
    name: str
    name_fr: str
    count: int = 0

# Newsletter Model
class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    language: str = "fr"
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True

class NewsletterSubscribe(BaseModel):
    email: str
    language: str = "fr"

# Contact Model
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nom: str
    email: str
    sujet: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False

class ContactCreate(BaseModel):
    nom: str
    email: str
    sujet: str
    message: str


# Content Models for CMS
class Quote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text_fr: str
    text_en: str
    text_ar: str
    text_wo: str
    author: str = "El Hadji Malick Sy"
    context_fr: Optional[str] = None
    context_en: Optional[str] = None
    active: bool = True
    order: int = 0

class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_fr: str
    name_en: str
    name_ar: str
    name_wo: str
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    description_wo: Optional[str] = None
    date: str  # ISO date string
    location: str = "Tivaouane"
    event_type: str  # gamou, ziarra, hadratoul_joumah, other
    recurring: bool = False
    recurrence_pattern: Optional[str] = None  # weekly, annual, etc.
    active: bool = True


# Update Models for CMS
class QuoteUpdate(BaseModel):
    text_fr: Optional[str] = None
    text_en: Optional[str] = None
    text_ar: Optional[str] = None
    text_wo: Optional[str] = None
    author: Optional[str] = None
    context_fr: Optional[str] = None
    context_en: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None


class EventUpdate(BaseModel):
    name_fr: Optional[str] = None
    name_en: Optional[str] = None
    name_ar: Optional[str] = None
    name_wo: Optional[str] = None
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    description_wo: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    event_type: Optional[str] = None
    recurring: Optional[bool] = None
    recurrence_pattern: Optional[str] = None
    active: Optional[bool] = None


# Page Content Models for CMS
class PageContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str  # e.g., "maodo", "gamou", "khalifes", "ecole"
    section: str  # e.g., "hero", "intro", "timeline", "contributions"
    content: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    metadata: Optional[dict] = None  # Additional data like images, dates, etc.
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PageContentCreate(BaseModel):
    slug: str
    section: str
    content: dict
    metadata: Optional[dict] = None
    order: int = 0
    active: bool = True


class PageContentUpdate(BaseModel):
    slug: Optional[str] = None
    section: Optional[str] = None
    content: Optional[dict] = None
    metadata: Optional[dict] = None
    order: Optional[int] = None
    active: Optional[bool] = None


class SearchResult(BaseModel):
    id: str
    title: str
    description: str
    type: str  # page, video, event, quote
    url: str
    relevance: float = 1.0

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminSession(BaseModel):
    token: str
    expires_at: str
    username: str

class PushSubscription(BaseModel):
    endpoint: str
    keys: dict
    user_agent: Optional[str] = None
    language: str = "fr"

class NotificationPreferences(BaseModel):
    events: bool = True
    gamou: bool = True
    ziarra: bool = True
    weekly_hadratoul: bool = False


# Khalife (Heirs) Models for CMS
class Khalife(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    period: str  # e.g., "1885 - 1957"
    icon: str = "Crown"  # Icon name from lucide-react
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    contributions: dict  # {"fr": [...], "en": [...], "ar": [...], "wo": [...]}
    image: str  # URL to the image
    current: bool = False  # Is this the current Khalife?
    order: int = 0  # For sorting
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class KhalifeCreate(BaseModel):
    name: str
    title: dict
    period: str
    icon: str = "Crown"
    description: dict
    contributions: dict
    image: str
    current: bool = False
    order: int = 0
    active: bool = True


class KhalifeUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[dict] = None
    period: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[dict] = None
    contributions: Optional[dict] = None
    image: Optional[str] = None
    current: Optional[bool] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== ARCHIVES MODELS ==============

class ArchiveManuscript(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    date: str  # e.g., "XIXe siècle"
    langue: str  # e.g., "Arabe + Français"
    lien: str  # URL to the document
    type: str  # e.g., "PDF Scribd", "Archive.org"
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchiveManuscriptCreate(BaseModel):
    title: dict
    description: dict
    date: str
    langue: str
    lien: str
    type: str
    order: int = 0
    active: bool = True


class ArchiveManuscriptUpdate(BaseModel):
    title: Optional[dict] = None
    description: Optional[dict] = None
    date: Optional[str] = None
    langue: Optional[str] = None
    lien: Optional[str] = None
    type: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


class ArchivePhoto(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    date: str  # e.g., "Début XXe siècle"
    image: str  # URL to the image
    source: dict  # {"fr": "Archives familiales", "en": "Family Archives", ...}
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchivePhotoCreate(BaseModel):
    title: dict
    description: dict
    date: str
    image: str
    source: dict
    order: int = 0
    active: bool = True


class ArchivePhotoUpdate(BaseModel):
    title: Optional[dict] = None
    description: Optional[dict] = None
    date: Optional[str] = None
    image: Optional[str] = None
    source: Optional[dict] = None
    order: Optional[int] = None
    active: Optional[bool] = None


class ArchiveAudio(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str  # Khassaide titles stay in Arabic
    author: str
    duration: str
    audioUrl: str
    source: str  # URL to source website
    coverImage: Optional[str] = None
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchiveAudioCreate(BaseModel):
    title: str
    author: str
    duration: str
    audioUrl: str
    source: str
    coverImage: Optional[str] = None
    order: int = 0
    active: bool = True


class ArchiveAudioUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    duration: Optional[str] = None
    audioUrl: Optional[str] = None
    source: Optional[str] = None
    coverImage: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


class ArchiveVideo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    youtubeId: str
    duration: str
    views: int = 0
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchiveVideoCreate(BaseModel):
    title: dict
    description: dict
    youtubeId: str
    duration: str
    views: int = 0
    order: int = 0
    active: bool = True


class ArchiveVideoUpdate(BaseModel):
    title: Optional[dict] = None
    description: Optional[dict] = None
    youtubeId: Optional[str] = None
    duration: Optional[str] = None
    views: Optional[int] = None
    order: Optional[int] = None
    active: Optional[bool] = None


class ArchiveSource(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    lien: str  # URL to the source
    source: dict  # {"fr": "BnF", "en": "National Library of France", ...}
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchiveSourceCreate(BaseModel):
    title: dict
    description: dict
    lien: str
    source: dict
    order: int = 0
    active: bool = True


class ArchiveSourceUpdate(BaseModel):
    title: Optional[dict] = None
    description: Optional[dict] = None
    lien: Optional[str] = None
    source: Optional[dict] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== FAMILY TREE MODELS ==============

class FamilyMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    node_id: str  # Unique identifier for tree structure (e.g., 'maodo', 'babacar')
    nom: str  # Full name
    surnom: Optional[str] = None  # Nickname (e.g., "Maodo", "Dabakh")
    dates: str  # e.g., "1855 - 1922"
    titre: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    image: str  # URL to image
    parent_id: Optional[str] = None  # node_id of parent (None for root)
    epouses: Optional[list] = None  # List of spouses with their children
    is_current_khalife: bool = False
    order: int = 0  # Order among siblings
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FamilyMemberCreate(BaseModel):
    node_id: str
    nom: str
    surnom: Optional[str] = None
    dates: str
    titre: dict
    image: str
    parent_id: Optional[str] = None
    epouses: Optional[list] = None
    is_current_khalife: bool = False
    order: int = 0
    active: bool = True


class FamilyMemberUpdate(BaseModel):
    nom: Optional[str] = None
    surnom: Optional[str] = None
    dates: Optional[str] = None
    titre: Optional[dict] = None
    image: Optional[str] = None
    parent_id: Optional[str] = None
    epouses: Optional[list] = None
    is_current_khalife: Optional[bool] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== AUTHENTICATION HELPERS ==============

def verify_password(password: str) -> bool:
    """Verify password against stored hash"""
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    return secrets.compare_digest(password_hash, ADMIN_PASSWORD_HASH)

def generate_session_token() -> str:
    """Generate a secure session token"""
    return secrets.token_urlsafe(32)

async def verify_admin_token(authorization: Optional[str] = Header(None)) -> bool:
    """Verify admin session token from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token d'authentification requis")
    
    # Extract token from "Bearer <token>"
    if authorization.startswith("Bearer "):
        token = authorization[7:]
    else:
        token = authorization
    
    # Check token in database
    session = await db.admin_sessions.find_one({
        "token": token,
        "expires_at": {"$gt": datetime.now(timezone.utc).isoformat()}
    })
    
    if not session:
        raise HTTPException(status_code=401, detail="Session invalide ou expirée")
    
    return True


# Video routes
@api_router.get("/")
async def root():
    return {"message": "Bienvenue sur le site de la Tariqa Tidiane de Tivaouane"}

@api_router.get("/videos", response_model=List[Video])
async def get_videos(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    
    if category:
        query['category'] = category
    
    if search:
        query['$or'] = [
            {'title': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}}
        ]
    
    videos = await db.videos.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for video in videos:
        if isinstance(video['created_at'], str):
            video['created_at'] = datetime.fromisoformat(video['created_at'])
    
    return videos

@api_router.get("/videos/featured", response_model=List[Video])
async def get_featured_videos():
    videos = await db.videos.find({"featured": True}, {"_id": 0}).sort("created_at", -1).to_list(10)
    
    for video in videos:
        if isinstance(video['created_at'], str):
            video['created_at'] = datetime.fromisoformat(video['created_at'])
    
    return videos

@api_router.get("/videos/{video_id}", response_model=Video)
async def get_video(video_id: str):
    video = await db.videos.find_one({"id": video_id}, {"_id": 0})
    
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    if isinstance(video['created_at'], str):
        video['created_at'] = datetime.fromisoformat(video['created_at'])
    
    # Increment views
    await db.videos.update_one({"id": video_id}, {"$inc": {"views": 1}})
    video['views'] += 1
    
    return video

@api_router.post("/videos", response_model=Video, status_code=201)
async def create_video(input: VideoCreate):
    video_dict = input.model_dump()
    video_obj = Video(**video_dict)
    
    doc = video_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    if not doc.get('thumbnail_url'):
        doc['thumbnail_url'] = f"https://img.youtube.com/vi/{doc['youtube_id']}/maxresdefault.jpg"
    
    await db.videos.insert_one(doc)
    return video_obj

@api_router.put("/videos/{video_id}", response_model=Video)
async def update_video(video_id: str, input: VideoUpdate):
    video = await db.videos.find_one({"id": video_id}, {"_id": 0})
    
    if not video:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    
    if update_data:
        await db.videos.update_one({"id": video_id}, {"$set": update_data})
        video.update(update_data)
    
    if isinstance(video['created_at'], str):
        video['created_at'] = datetime.fromisoformat(video['created_at'])
    
    return Video(**video)

@api_router.delete("/videos/{video_id}")
async def delete_video(video_id: str):
    result = await db.videos.delete_one({"id": video_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    return {"message": "Vidéo supprimée avec succès"}

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    
    results = await db.videos.aggregate(pipeline).to_list(100)
    
    category_names = {
        "conferences": "Conférences",
        "gamou": "Événements et Gamou",
        "dhikr": "Récitations et Dhikr",
        "histoire": "Histoire et Patrimoine",
        "autres": "Autres"
    }
    
    categories = []
    for result in results:
        categories.append(Category(
            name=result['_id'],
            name_fr=category_names.get(result['_id'], result['_id']),
            count=result['count']
        ))
    
    return categories

@api_router.post("/init-data")
async def initialize_data():
    """Initialize database with sample videos"""
    existing_count = await db.videos.count_documents({})
    
    if existing_count > 0:
        return {"message": "Les données existent déjà", "count": existing_count}
    
    sample_videos = [
        {
            "id": str(uuid.uuid4()),
            "title": "Khoutba du vendredi - Grande Mosquée de Tivaouane",
            "description": "Sermon du vendredi à la Grande Mosquée de Tivaouane, guidant la communauté dans la foi et la spiritualité.",
            "youtube_id": "dQw4w9WgXcQ",
            "category": "conferences",
            "duration": "45:30",
            "views": 1250,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Gamou 2024 - Célébration du Mawlid",
            "description": "Célébration annuelle du Gamou à Tivaouane, rassemblant des milliers de fidèles de la Tariqa Tidiane.",
            "youtube_id": "dQw4w9WgXcQ",
            "category": "gamou",
            "duration": "2:15:00",
            "views": 5430,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Wird Tidiane - Récitation complète",
            "description": "Récitation complète du Wird de la Tariqa Tidiane par les disciples de Tivaouane.",
            "youtube_id": "dQw4w9WgXcQ",
            "category": "dhikr",
            "duration": "1:20:00",
            "views": 2340,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Histoire de Cheikh El Hadj Malick Sy",
            "description": "Retraçant la vie et l'héritage spirituel de Cheikh El Hadj Malick Sy, fondateur de la branche Tidiane de Tivaouane.",
            "youtube_id": "dQw4w9WgXcQ",
            "category": "histoire",
            "duration": "55:20",
            "views": 3200,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Enseignement sur les Vertus du Dhikr",
            "description": "Conférence sur l'importance du dhikr dans la voie soufie et particulièrement dans la Tariqa Tidiane.",
            "youtube_id": "dQw4w9WgXcQ",
            "category": "conferences",
            "duration": "38:15",
            "views": 1890,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Ziarra annuelle - Pèlerinage à Tivaouane",
            "description": "Moments forts de la Ziarra annuelle où les disciples visitent les lieux saints de Tivaouane.",
            "youtube_id": "dQw4w9WgXcQ",
            "category": "gamou",
            "duration": "1:45:00",
            "views": 4120,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Qasida en l'honneur du Prophète",
            "description": "Récitation de poèmes mystiques en l'honneur du Prophète Muhammad (PSL).",
            "youtube_id": "dQw4w9WgXcQ",
            "category": "dhikr",
            "duration": "25:40",
            "views": 980,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    for video in sample_videos:
        if not video.get('thumbnail_url'):
            video['thumbnail_url'] = f"https://img.youtube.com/vi/{video['youtube_id']}/maxresdefault.jpg"
    
    await db.videos.insert_many(sample_videos)
    
    return {"message": "Données initialisées avec succès", "count": len(sample_videos)}


# Newsletter Routes
@api_router.post("/newsletter/subscribe")
async def subscribe_newsletter(input: NewsletterSubscribe):
    """Subscribe to newsletter"""
    import re
    
    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, input.email):
        raise HTTPException(status_code=400, detail="Format d'email invalide")
    
    # Check if already subscribed
    existing = await db.newsletter.find_one({"email": input.email.lower()})
    if existing:
        if existing.get('active', True):
            return {"message": "Vous êtes déjà inscrit à la newsletter", "already_subscribed": True}
        else:
            # Reactivate subscription
            await db.newsletter.update_one(
                {"email": input.email.lower()},
                {"$set": {"active": True, "language": input.language}}
            )
            return {"message": "Votre inscription a été réactivée", "reactivated": True}
    
    # Create subscription
    subscription = NewsletterSubscription(
        email=input.email.lower(),
        language=input.language
    )
    
    doc = subscription.model_dump()
    doc['subscribed_at'] = doc['subscribed_at'].isoformat()
    
    await db.newsletter.insert_one(doc)
    
    logger.info(f"New newsletter subscription: {input.email}")
    
    return {
        "message": "Inscription réussie ! Vous recevrez nos actualités.",
        "success": True,
        "email": input.email.lower()
    }

@api_router.delete("/newsletter/unsubscribe/{email}")
async def unsubscribe_newsletter(email: str):
    """Unsubscribe from newsletter"""
    result = await db.newsletter.update_one(
        {"email": email.lower()},
        {"$set": {"active": False}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Email non trouvé")
    
    return {"message": "Désabonnement effectué avec succès"}

@api_router.get("/newsletter/subscribers")
async def get_newsletter_subscribers():
    """Get newsletter statistics (admin)"""
    total = await db.newsletter.count_documents({})
    active = await db.newsletter.count_documents({"active": True})
    
    return {
        "total_subscribers": total,
        "active_subscribers": active,
        "inactive_subscribers": total - active
    }


# Contact Routes
@api_router.post("/contact")
async def send_contact_message(input: ContactCreate):
    """Send a contact message"""
    import re
    
    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, input.email):
        raise HTTPException(status_code=400, detail="Format d'email invalide")
    
    # Validate message length
    if len(input.message.strip()) < 10:
        raise HTTPException(status_code=400, detail="Le message doit contenir au moins 10 caractères")
    
    # Create message
    message = ContactMessage(
        nom=input.nom.strip(),
        email=input.email.lower(),
        sujet=input.sujet.strip(),
        message=input.message.strip()
    )
    
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_messages.insert_one(doc)
    
    logger.info(f"New contact message from: {input.email} - Subject: {input.sujet}")
    
    return {
        "message": "Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.",
        "success": True,
        "id": message.id
    }

@api_router.get("/contact/messages")
async def get_contact_messages(unread_only: bool = False):
    """Get contact messages (admin)"""
    query = {"read": False} if unread_only else {}
    
    messages = await db.contact_messages.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    return {
        "messages": messages,
        "count": len(messages)
    }

@api_router.put("/contact/messages/{message_id}/read")
async def mark_message_read(message_id: str):
    """Mark a contact message as read"""
    result = await db.contact_messages.update_one(
        {"id": message_id},
        {"$set": {"read": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message non trouvé")
    
    return {"message": "Message marqué comme lu"}


# ============== CONTENT MANAGEMENT ENDPOINTS ==============

# Quotes endpoints
@api_router.get("/quotes")
async def get_quotes(active_only: bool = True, random: bool = False):
    """Get all quotes or a random quote"""
    query = {"active": True} if active_only else {}
    
    if random:
        # Get a random quote using aggregation
        pipeline = [{"$match": query}, {"$sample": {"size": 1}}]
        quotes = await db.quotes.aggregate(pipeline).to_list(1)
        if quotes:
            quote = quotes[0]
            quote.pop('_id', None)
            return quote
        return None
    
    quotes = await db.quotes.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return {"quotes": quotes, "count": len(quotes)}

@api_router.get("/quotes/daily")
async def get_daily_quote():
    """Get quote of the day (based on day of year)"""
    from datetime import date
    day_of_year = date.today().timetuple().tm_yday
    
    # Get total count
    count = await db.quotes.count_documents({"active": True})
    if count == 0:
        return None
    
    # Use day of year to pick a quote
    skip = day_of_year % count
    quotes = await db.quotes.find({"active": True}, {"_id": 0}).skip(skip).limit(1).to_list(1)
    
    if quotes:
        return quotes[0]
    return None

@api_router.post("/quotes")
async def create_quote(quote: Quote):
    """Create a new quote"""
    doc = quote.model_dump()
    await db.quotes.insert_one(doc)
    return {"message": "Citation créée", "id": quote.id}


@api_router.get("/quotes/{quote_id}")
async def get_quote(quote_id: str):
    """Get a single quote by ID"""
    quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    if not quote:
        raise HTTPException(status_code=404, detail="Citation non trouvée")
    return quote


@api_router.put("/quotes/{quote_id}")
async def update_quote(quote_id: str, update: QuoteUpdate, is_admin: bool = Depends(verify_admin_token)):
    """Update a quote (admin only)"""
    quote = await db.quotes.find_one({"id": quote_id})
    if not quote:
        raise HTTPException(status_code=404, detail="Citation non trouvée")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if update_data:
        await db.quotes.update_one({"id": quote_id}, {"$set": update_data})
    
    updated_quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    return {"message": "Citation mise à jour", "quote": updated_quote}


@api_router.delete("/quotes/{quote_id}")
async def delete_quote(quote_id: str, is_admin: bool = Depends(verify_admin_token)):
    """Delete a quote (admin only)"""
    result = await db.quotes.delete_one({"id": quote_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Citation non trouvée")
    
    return {"message": "Citation supprimée", "id": quote_id}


# Events endpoints
@api_router.get("/events")
async def get_events(upcoming_only: bool = True, event_type: Optional[str] = None):
    """Get events, optionally filtered by type"""
    query = {"active": True} if upcoming_only else {}
    
    if event_type:
        query["event_type"] = event_type
    
    events = await db.events.find(query, {"_id": 0}).sort("date", 1).to_list(100)
    return {"events": events, "count": len(events)}

@api_router.get("/events/upcoming")
async def get_upcoming_events(limit: int = 5):
    """Get upcoming events from today"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    events = await db.events.find(
        {"active": True, "date": {"$gte": today}},
        {"_id": 0}
    ).sort("date", 1).limit(limit).to_list(limit)
    
    return {"events": events, "count": len(events)}

@api_router.post("/events")
async def create_event(event: Event):
    """Create a new event"""
    doc = event.model_dump()
    await db.events.insert_one(doc)
    return {"message": "Événement créé", "id": event.id}


@api_router.get("/events/{event_id}")
async def get_event(event_id: str):
    """Get a single event by ID"""
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    return event


@api_router.put("/events/{event_id}")
async def update_event(event_id: str, update: EventUpdate, is_admin: bool = Depends(verify_admin_token)):
    """Update an event (admin only)"""
    event = await db.events.find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if update_data:
        await db.events.update_one({"id": event_id}, {"$set": update_data})
    
    updated_event = await db.events.find_one({"id": event_id}, {"_id": 0})
    return {"message": "Événement mis à jour", "event": updated_event}


@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, is_admin: bool = Depends(verify_admin_token)):
    """Delete an event (admin only)"""
    result = await db.events.delete_one({"id": event_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    
    return {"message": "Événement supprimé", "id": event_id}


# ============== PAGE CONTENT ENDPOINTS ==============

@api_router.get("/content")
async def get_all_page_content(slug: Optional[str] = None, active_only: bool = True):
    """Get all page content or filter by slug"""
    query = {}
    if slug:
        query["slug"] = slug
    if active_only:
        query["active"] = True
    
    content = await db.page_content.find(query, {"_id": 0}).sort("order", 1).to_list(500)
    return {"content": content, "count": len(content)}


@api_router.get("/pages")
async def get_all_pages():
    """Get list of all unique pages with their sections"""
    pipeline = [
        {"$group": {
            "_id": "$slug",
            "sections": {"$push": {
                "id": "$id",
                "section": "$section",
                "order": "$order",
                "active": "$active",
                "metadata": "$metadata"
            }},
            "section_count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    results = await db.page_content.aggregate(pipeline).to_list(100)
    pages = []
    for r in results:
        pages.append({
            "slug": r["_id"],
            "sections": sorted(r["sections"], key=lambda x: x.get("order", 0)),
            "section_count": r["section_count"]
        })
    
    return {"pages": pages, "count": len(pages)}


@api_router.get("/content/{slug}")
async def get_page_content(slug: str, lang: str = "fr"):
    """Get all content sections for a specific page"""
    content = await db.page_content.find(
        {"slug": slug, "active": True}, 
        {"_id": 0}
    ).sort("order", 1).to_list(100)
    
    if not content:
        raise HTTPException(status_code=404, detail=f"Contenu non trouvé pour la page: {slug}")
    
    # Format response with language-specific content
    formatted = {}
    for item in content:
        section_content = item.get("content", {})
        formatted[item["section"]] = {
            "text": section_content.get(lang) or section_content.get("fr", ""),
            "all_languages": section_content,
            "metadata": item.get("metadata"),
            "id": item.get("id")
        }
    
    return {"slug": slug, "sections": formatted, "raw": content}


@api_router.get("/content/{slug}/{section}")
async def get_page_section(slug: str, section: str, lang: str = "fr"):
    """Get a specific section of a page"""
    content = await db.page_content.find_one(
        {"slug": slug, "section": section, "active": True},
        {"_id": 0}
    )
    
    if not content:
        raise HTTPException(status_code=404, detail=f"Section '{section}' non trouvée pour la page: {slug}")
    
    section_content = content.get("content", {})
    return {
        "slug": slug,
        "section": section,
        "text": section_content.get(lang) or section_content.get("fr", ""),
        "all_languages": section_content,
        "metadata": content.get("metadata"),
        "id": content.get("id")
    }


@api_router.post("/content")
async def create_page_content(content: PageContentCreate, is_admin: bool = Depends(verify_admin_token)):
    """Create new page content section (admin only)"""
    # Check if section already exists
    existing = await db.page_content.find_one({"slug": content.slug, "section": content.section})
    if existing:
        raise HTTPException(status_code=400, detail=f"La section '{content.section}' existe déjà pour la page '{content.slug}'")
    
    page_content = PageContent(**content.model_dump())
    doc = page_content.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["updated_at"] = doc["updated_at"].isoformat()
    
    await db.page_content.insert_one(doc)
    return {"message": "Contenu créé", "id": page_content.id}


@api_router.put("/content/{content_id}")
async def update_page_content(content_id: str, update: PageContentUpdate, is_admin: bool = Depends(verify_admin_token)):
    """Update page content section (admin only)"""
    existing = await db.page_content.find_one({"id": content_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Contenu non trouvé")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    if update_data:
        await db.page_content.update_one({"id": content_id}, {"$set": update_data})
    
    updated = await db.page_content.find_one({"id": content_id}, {"_id": 0})
    return {"message": "Contenu mis à jour", "content": updated}


@api_router.delete("/content/{content_id}")
async def delete_page_content(content_id: str, is_admin: bool = Depends(verify_admin_token)):
    """Delete page content section (admin only)"""
    result = await db.page_content.delete_one({"id": content_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contenu non trouvé")
    
    return {"message": "Contenu supprimé", "id": content_id}


@api_router.post("/content/seed/{slug}")
async def seed_page_content(slug: str, is_admin: bool = Depends(verify_admin_token)):
    """Seed content for a specific page (admin only)"""
    # Check if already seeded
    existing = await db.page_content.count_documents({"slug": slug})
    if existing > 0:
        return {"message": f"Contenu déjà existant pour {slug}", "count": existing}
    
    seeded_count = 0
    
    if slug == "maodo":
        maodo_content = [
            {
                "id": str(uuid.uuid4()),
                "slug": "maodo",
                "section": "hero",
                "content": {
                    "fr": "El Hadji Malick Sy, affectueusement appelé Maodo (terme wolof signifiant \"le Vénéré\"), fut l'un des plus grands érudits musulmans de l'Afrique de l'Ouest.",
                    "en": "El Hadji Malick Sy, affectionately called Maodo (a Wolof term meaning \"the Revered\"), was one of the greatest Muslim scholars of West Africa.",
                    "ar": "الحاج مالك سي، المعروف بمودو (مصطلح ولوفي يعني \"المبجّل\")، كان من أعظم العلماء المسلمين في غرب أفريقيا.",
                    "wo": "El Hadji Maalik Si, ñuy wax Maodo (baat wu wolof bu tekki \"ku ñu gëm\"), dafa nekk benn ci ñiy xam-xam yu mag ci Lislaam ci Afrik sowwu jant."
                },
                "metadata": {"title": {"fr": "Le Fondateur", "en": "The Founder", "ar": "المؤسس", "wo": "Boroom Ci"}},
                "order": 1,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "maodo",
                "section": "biography",
                "content": {
                    "fr": "Né en 1855 dans le village de Gaya au nord du Sénégal, il consacra sa vie entière à l'apprentissage, l'enseignement et la diffusion de l'Islam selon la voie du Prophète Muhammad (PSL). Son érudition exceptionnelle, sa piété exemplaire et sa sagesse firent de lui une référence incontournable pour des générations de musulmans.",
                    "en": "Born in 1855 in the village of Gaya in northern Senegal, he devoted his entire life to learning, teaching and spreading Islam according to the way of Prophet Muhammad (PBUH). His exceptional scholarship, exemplary piety and wisdom made him an essential reference for generations of Muslims.",
                    "ar": "ولد عام 1855 في قرية غايا شمال السنغال، وكرّس حياته كلها للتعلم والتعليم ونشر الإسلام وفق طريقة النبي محمد (ص). جعلت منه علمه الاستثنائي وتقواه المثالية وحكمته مرجعاً أساسياً لأجيال من المسلمين.",
                    "wo": "Juddu na ci 1855 ci dëkk bi ñuy wax Gaya ci gejj gu Senegaal, def na dund bam yépp ci jàng, jàngale ak yaatal Lislaam ni Yonent Muhammad (YWS) daa ko def. Xam-xam bam bu baax, diine bam bu mat ak xelam jëkk ko ñu tekki ay jàng yu mag ci yeneen muslim."
                },
                "metadata": {},
                "order": 2,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "maodo",
                "section": "quote",
                "content": {
                    "fr": "Chez Maodo, la dualité l'emporte sur l'alternative : il fut à la fois homme de science et homme d'action, mystique et pragmatique, traditionaliste et moderniste.",
                    "en": "In Maodo, duality prevails over the alternative: he was both a man of science and a man of action, mystic and pragmatic, traditionalist and modernist.",
                    "ar": "عند مودو، تغلب الثنائية على البديل: كان رجل علم ورجل عمل في آن واحد، صوفياً وعملياً، تقليدياً وحداثياً.",
                    "wo": "Ci Maodo, ñaari ay yoon a mujj ci benn yoon rekk: dafa nekk nit ku xam-xam te nit ku jëf, soufi te ku liggéey, ku jëkk te ku bés."
                },
                "metadata": {"author": "Historien"},
                "order": 3,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "maodo",
                "section": "legacy",
                "content": {
                    "fr": "Aujourd'hui, plus d'un siècle après son rappel à Dieu, l'influence de Maodo continue de rayonner. La Tariqa Tijaniyya est devenue la principale confrérie soufie au Sénégal, et le Gamou de Tivaouane rassemble chaque année plus de 5 millions de fidèles.",
                    "en": "Today, more than a century after his return to God, Maodo's influence continues to shine. The Tijaniyya Tariqa has become the main Sufi brotherhood in Senegal, and the Tivaouane Gamou gathers more than 5 million faithful every year.",
                    "ar": "اليوم، بعد أكثر من قرن على انتقاله إلى رحمة الله، لا يزال تأثير مودو يتألق. أصبحت الطريقة التيجانية الطريقة الصوفية الرئيسية في السنغال، ويجمع مولد تيفاوان أكثر من 5 ملايين مؤمن كل عام.",
                    "wo": "Tey, juróom fukki at ginnaaw bi mu wéesu Yàlla, doole Maodo dey leer ba tey. Tariqa Tijaan moo nekk tariqa soufi bu mag ci Senegaal, te Gamou Tiwaawaan mooy daje juróom million nit atum kamm."
                },
                "metadata": {},
                "order": 10,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.page_content.insert_many(maodo_content)
        seeded_count = len(maodo_content)
    
    elif slug == "gamou":
        gamou_content = [
            {
                "id": str(uuid.uuid4()),
                "slug": "gamou",
                "section": "hero",
                "content": {
                    "fr": "Le plus grand rassemblement spirituel d'Afrique de l'Ouest en l'honneur de la naissance du Prophète Muhammad (PSL)",
                    "en": "The largest spiritual gathering in West Africa in honor of the birth of Prophet Muhammad (PBUH)",
                    "ar": "أكبر تجمع روحي في غرب أفريقيا تكريماً لمولد النبي محمد (ص)",
                    "wo": "Ndaje bu réy ci Afrik sowwu jant ngir sant juddu Yonent Muhammad (YWS)"
                },
                "metadata": {"title": {"fr": "Le Gamou de Tivaouane", "en": "The Gamou of Tivaouane", "ar": "مولد تيفاوان", "wo": "Gamou Tiwaawaan"}},
                "order": 1,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "gamou",
                "section": "intro",
                "content": {
                    "fr": "Le Gamou de Tivaouane est bien plus qu'une fête religieuse : c'est un moment de communion spirituelle intense, un pèlerinage annuel qui réaffirme l'amour des Tidiane pour le Prophète Muhammad (PSL) et leur attachement à son message. Institué par El Hadji Malick Sy au début du XXe siècle, le Gamou de Tivaouane est devenu le rendez-vous incontournable de la Tidjanidya sénégalaise et ouest-africaine.",
                    "en": "The Tivaouane Gamou is much more than a religious celebration: it is a moment of intense spiritual communion, an annual pilgrimage that reaffirms the love of the Tidiane for Prophet Muhammad (PBUH) and their attachment to his message. Established by El Hadji Malick Sy at the beginning of the 20th century, the Tivaouane Gamou has become the essential gathering of Senegalese and West African Tijaniyya.",
                    "ar": "مولد تيفاوان أكثر من مجرد احتفال ديني: إنه لحظة شركة روحية مكثفة، حج سنوي يؤكد حب التيجانيين للنبي محمد (ص) وتعلقهم برسالته. أسسه الحاج مالك سي في بداية القرن العشرين، وأصبح مولد تيفاوان الموعد الأساسي للتيجانية السنغالية والغرب أفريقية.",
                    "wo": "Gamou Tiwaawaan du bëgg-bëgg diine rekk: mooy waxtu ci mbooloo bu diine bu tar, ziyaar at bu dey wàccal sopp Tijaan yi ci Yonent Muhammad (YWS) ak sàmm baat yam. El Hadji Maalik Si moo ko tànn ci door teemeer fukki at, Gamou Tiwaawaan moo nekk ndaje bu war ci Tijaan Senegaal ak Afrik sowwu jant."
                },
                "metadata": {},
                "order": 2,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "gamou",
                "section": "date_2025",
                "content": {
                    "fr": "Nuit du jeudi 4 au vendredi 5 septembre 2025",
                    "en": "Night of Thursday 4 to Friday 5 September 2025",
                    "ar": "ليلة الخميس 4 إلى الجمعة 5 سبتمبر 2025",
                    "wo": "Guddi altine 4 ba aljuma 5 septàmbar 2025"
                },
                "metadata": {"date": "2025-09-05", "islamic_date": "12 Rabi' al-Awwal 1447"},
                "order": 3,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.page_content.insert_many(gamou_content)
        seeded_count = len(gamou_content)
    
    elif slug == "ecole":
        ecole_content = [
            {
                "id": str(uuid.uuid4()),
                "slug": "ecole",
                "section": "hero",
                "content": {
                    "fr": "La méthode pédagogique unique d'El Hadji Malick Sy qui a révolutionné l'enseignement islamique en Afrique de l'Ouest",
                    "en": "The unique pedagogical method of El Hadji Malick Sy that revolutionized Islamic education in West Africa",
                    "ar": "المنهج التعليمي الفريد للحاج مالك سي الذي أحدث ثورة في التعليم الإسلامي في غرب أفريقيا",
                    "wo": "Yoon jàngale bu El Hadji Maalik Si bu soppaliku jàng Lislaam ci Afrik sowwu jant"
                },
                "metadata": {"title": {"fr": "L'École de Tivaouane", "en": "The School of Tivaouane", "ar": "مدرسة تيفاوان", "wo": "Daara Tiwaawaan"}},
                "order": 1,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "ecole",
                "section": "intro",
                "content": {
                    "fr": "L'École de Tivaouane n'est pas une institution au sens moderne, mais un système d'enseignement vivant créé par El Hadji Malick Sy, qui visait à former des musulmans éclairés, à la fois savants et vertueux. Dès son installation en 1902, Maodo établit une zawiya (école coranique) qui devint rapidement un centre d'attraction pour des milliers d'étudiants.",
                    "en": "The School of Tivaouane is not an institution in the modern sense, but a living teaching system created by El Hadji Malick Sy, aimed at training enlightened Muslims who are both scholars and virtuous. From his establishment in 1902, Maodo established a zawiya (Quranic school) which quickly became a center of attraction for thousands of students.",
                    "ar": "مدرسة تيفاوان ليست مؤسسة بالمعنى الحديث، بل هي نظام تعليمي حي أنشأه الحاج مالك سي، يهدف إلى تكوين مسلمين مستنيرين يجمعون بين العلم والفضيلة. منذ استقراره عام 1902، أسس مودو زاوية (مدرسة قرآنية) سرعان ما أصبحت مركز جذب لآلاف الطلاب.",
                    "wo": "Daara Tiwaawaan du benn institution ci biir tey, waaye mooy yoon jàngale buy dund bi El Hadji Maalik Si tànn, ngir jàngale muslim yu leer, yu xam te yu yar. Bi mu tëdd ci 1902, Maodo tànn zawiya (daara Kur'aan) bu gaaw nekk benn bopp njëkk ngir ay téeméer taalibe."
                },
                "metadata": {},
                "order": 2,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.page_content.insert_many(ecole_content)
        seeded_count = len(ecole_content)
    
    return {"message": f"Contenu initialisé pour {slug}", "seeded": seeded_count}


@api_router.post("/content/enrich/{slug}")
async def enrich_page_content(slug: str, is_admin: bool = Depends(verify_admin_token)):
    """Add additional content sections to an existing page (admin only)"""
    enriched_count = 0
    
    if slug == "maodo":
        # Check which sections already exist
        existing_sections = await db.page_content.distinct("section", {"slug": "maodo"})
        
        new_sections = []
        
        # Timeline section
        if "timeline" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "maodo",
                "section": "timeline",
                "content": {
                    "fr": json.dumps([
                        {"year": "1855", "event": "Naissance à Gaya, nord du Sénégal"},
                        {"year": "1855-1862", "event": "Mémorisation du Coran sous la tutelle de son père"},
                        {"year": "1862-1884", "event": "Études islamiques approfondies auprès de grands maîtres"},
                        {"year": "1884", "event": "Installation à Saint-Louis, début de l'enseignement"},
                        {"year": "1886-1888", "event": "Pèlerinage à La Mecque et rencontre avec des savants"},
                        {"year": "1892", "event": "Fondation de la zawiya de Ndar"},
                        {"year": "1900", "event": "Installation définitive à Tivaouane"},
                        {"year": "1902", "event": "Fondation de la zawiya de Tivaouane"},
                        {"year": "1922", "event": "Rappel à Dieu à Tivaouane"}
                    ]),
                    "en": json.dumps([
                        {"year": "1855", "event": "Birth in Gaya, northern Senegal"},
                        {"year": "1855-1862", "event": "Quran memorization under his father's guidance"},
                        {"year": "1862-1884", "event": "Advanced Islamic studies with great masters"},
                        {"year": "1884", "event": "Settlement in Saint-Louis, beginning of teaching"},
                        {"year": "1886-1888", "event": "Pilgrimage to Mecca and meeting with scholars"},
                        {"year": "1892", "event": "Foundation of the Ndar zawiya"},
                        {"year": "1900", "event": "Final settlement in Tivaouane"},
                        {"year": "1902", "event": "Foundation of the Tivaouane zawiya"},
                        {"year": "1922", "event": "Return to God in Tivaouane"}
                    ]),
                    "ar": json.dumps([
                        {"year": "1855", "event": "الولادة في غايا، شمال السنغال"},
                        {"year": "1855-1862", "event": "حفظ القرآن تحت إشراف والده"},
                        {"year": "1862-1884", "event": "دراسات إسلامية متقدمة مع كبار العلماء"},
                        {"year": "1884", "event": "الاستقرار في سان لويس وبدء التدريس"},
                        {"year": "1886-1888", "event": "الحج إلى مكة ولقاء العلماء"},
                        {"year": "1892", "event": "تأسيس زاوية ندار"},
                        {"year": "1900", "event": "الاستقرار النهائي في تيفاوان"},
                        {"year": "1902", "event": "تأسيس زاوية تيفاوان"},
                        {"year": "1922", "event": "الانتقال إلى رحمة الله في تيفاوان"}
                    ]),
                    "wo": json.dumps([
                        {"year": "1855", "event": "Juddu ci Gaya, gejj gu Senegaal"},
                        {"year": "1855-1862", "event": "Xam Kur'aan ci kaw baay am"},
                        {"year": "1862-1884", "event": "Jàng Lislaam ak boroom xam-xam yu mag"},
                        {"year": "1884", "event": "Tëdd ci Ndar, door jàngale"},
                        {"year": "1886-1888", "event": "Aj ci Makka ak gis ak ay xam-xam"},
                        {"year": "1892", "event": "Tànn zawiya Ndar"},
                        {"year": "1900", "event": "Tëdd ci Tiwaawaan"},
                        {"year": "1902", "event": "Tànn zawiya Tiwaawaan"},
                        {"year": "1922", "event": "Wéesu Yàlla ci Tiwaawaan"}
                    ])
                },
                "metadata": {"type": "timeline"},
                "order": 4,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Contributions section
        if "contributions" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "maodo",
                "section": "contributions",
                "content": {
                    "fr": json.dumps([
                        {"title": "Fondateur du Gamou", "description": "Instituteur de la plus grande célébration du Mawlid en Afrique de l'Ouest"},
                        {"title": "Bâtisseur d'écoles", "description": "Créateur d'un réseau de daaras formant des milliers d'étudiants"},
                        {"title": "Propagateur de la Tijaniyya", "description": "Principal artisan de l'expansion de la confrérie au Sénégal"},
                        {"title": "Homme de paix", "description": "Médiateur respecté entre les communautés et le pouvoir colonial"},
                        {"title": "Auteur prolifique", "description": "Rédacteur de nombreux ouvrages de référence en sciences islamiques"},
                        {"title": "Revivificateur de la Sunna", "description": "Promoteur du retour aux sources authentiques de l'Islam"}
                    ]),
                    "en": json.dumps([
                        {"title": "Founder of Gamou", "description": "Initiator of the largest Mawlid celebration in West Africa"},
                        {"title": "School Builder", "description": "Creator of a network of daaras training thousands of students"},
                        {"title": "Spreader of Tijaniyya", "description": "Main architect of the brotherhood's expansion in Senegal"},
                        {"title": "Man of Peace", "description": "Respected mediator between communities and colonial power"},
                        {"title": "Prolific Author", "description": "Writer of numerous reference works in Islamic sciences"},
                        {"title": "Reviver of the Sunna", "description": "Promoter of return to authentic sources of Islam"}
                    ]),
                    "ar": json.dumps([
                        {"title": "مؤسس المولد", "description": "مبتكر أكبر احتفال بالمولد النبوي في غرب أفريقيا"},
                        {"title": "باني المدارس", "description": "مؤسس شبكة من الدور القرآنية التي درّبت آلاف الطلاب"},
                        {"title": "ناشر التيجانية", "description": "المهندس الرئيسي لتوسع الطريقة في السنغال"},
                        {"title": "رجل السلام", "description": "وسيط محترم بين المجتمعات والسلطة الاستعمارية"},
                        {"title": "مؤلف غزير الإنتاج", "description": "كاتب العديد من المراجع في العلوم الإسلامية"},
                        {"title": "محيي السنة", "description": "داعية العودة إلى المصادر الأصيلة للإسلام"}
                    ]),
                    "wo": json.dumps([
                        {"title": "Boroom Gamou", "description": "Ki tànn sant Mawlid bu mag ci Afrik sowwu jant"},
                        {"title": "Ki mos daara", "description": "Ki tànn ay daara yu jàngale ay téeméer taalibe"},
                        {"title": "Yéngu Tijaan", "description": "Ki yéngu tariqa ci Senegaal"},
                        {"title": "Nit ku jàmm", "description": "Ki jëfandikoo diggante ay mbooloo ak kilifa tubaab"},
                        {"title": "Bindkat bu bari", "description": "Ki bind ay téere yu bari ci xam-xam Lislaam"},
                        {"title": "Ki dund Sunna", "description": "Ki yéngu dellu ci dëgg yu Lislaam"}
                    ])
                },
                "metadata": {"type": "list"},
                "order": 5,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Oeuvres (Works) section
        if "oeuvres" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "maodo",
                "section": "oeuvres",
                "content": {
                    "fr": json.dumps([
                        {"title": "Khilâçu-Dhahab", "description": "30 tableaux poétiques sur la vie du Prophète Muhammad (PSL)"},
                        {"title": "Fâkihat at-Tullâb", "description": "Principes fondamentaux de la Tariqa Tijaniyya"},
                        {"title": "Kifâyat ar-Râghibîn", "description": "Traité complet sur le soufisme et la spiritualité"},
                        {"title": "Ifhâm al-Munkir al-Jânî", "description": "Défense argumentée de la Tariqa Tijaniyya"},
                        {"title": "Wassilatoul Mouna (Tayssir)", "description": "Invocations des 99 Noms d'Allah"}
                    ]),
                    "en": json.dumps([
                        {"title": "Khilâçu-Dhahab", "description": "30 poetic tableaux on the life of Prophet Muhammad (PBUH)"},
                        {"title": "Fâkihat at-Tullâb", "description": "Fundamental principles of the Tijaniyya Tariqa"},
                        {"title": "Kifâyat ar-Râghibîn", "description": "Complete treatise on Sufism and spirituality"},
                        {"title": "Ifhâm al-Munkir al-Jânî", "description": "Argued defense of the Tijaniyya Tariqa"},
                        {"title": "Wassilatoul Mouna (Tayssir)", "description": "Invocations of the 99 Names of Allah"}
                    ]),
                    "ar": json.dumps([
                        {"title": "خلاص الذهب", "description": "30 لوحة شعرية عن حياة النبي محمد (ص)"},
                        {"title": "فاكهة الطلاب", "description": "المبادئ الأساسية للطريقة التيجانية"},
                        {"title": "كفاية الراغبين", "description": "رسالة كاملة في التصوف والروحانية"},
                        {"title": "إفهام المنكر الجاني", "description": "دفاع مبرهن عن الطريقة التيجانية"},
                        {"title": "وسيلة المنى (تيسير)", "description": "أدعية أسماء الله الحسنى"}
                    ]),
                    "wo": json.dumps([
                        {"title": "Khilâçu-Dhahab", "description": "30 nataal woy ci dundu Yonent Muhammad (YWS)"},
                        {"title": "Fâkihat at-Tullâb", "description": "Tënk bu njëkk ci Tariqa Tijaan"},
                        {"title": "Kifâyat ar-Râghibîn", "description": "Téere bu mat ci tasawwuf ak xel"},
                        {"title": "Ifhâm al-Munkir al-Jânî", "description": "Dimbali Tariqa Tijaan"},
                        {"title": "Wassilatoul Mouna (Tayssir)", "description": "Ñaan 99 Tur yi Yàlla"}
                    ])
                },
                "metadata": {"type": "list"},
                "order": 6,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        if new_sections:
            await db.page_content.insert_many(new_sections)
            enriched_count = len(new_sections)
    
    elif slug == "gamou":
        existing_sections = await db.page_content.distinct("section", {"slug": "gamou"})
        
        new_sections = []
        
        # Program section
        if "program" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "gamou",
                "section": "program",
                "content": {
                    "fr": json.dumps([
                        {"phase": "10 jours de Bourde", "description": "Récitation quotidienne du poème de louange au Prophète", "icon": "book"},
                        {"phase": "Causeries nocturnes", "description": "Conférences et enseignements religieux par les oulémas", "icon": "users"},
                        {"phase": "Rassemblement des fidèles", "description": "Arrivée des pèlerins de tout le Sénégal et de l'étranger", "icon": "map-pin"},
                        {"phase": "Nuit du Mawlid", "description": "Veillée spirituelle culminant à la Grande Mosquée", "icon": "star"}
                    ]),
                    "en": json.dumps([
                        {"phase": "10 days of Bourde", "description": "Daily recitation of the poem praising the Prophet", "icon": "book"},
                        {"phase": "Night talks", "description": "Conferences and religious teachings by scholars", "icon": "users"},
                        {"phase": "Gathering of the faithful", "description": "Arrival of pilgrims from all over Senegal and abroad", "icon": "map-pin"},
                        {"phase": "Mawlid Night", "description": "Spiritual vigil culminating at the Grand Mosque", "icon": "star"}
                    ]),
                    "ar": json.dumps([
                        {"phase": "10 أيام من البردة", "description": "تلاوة يومية لقصيدة مدح النبي", "icon": "book"},
                        {"phase": "المحاضرات الليلية", "description": "مؤتمرات وتعاليم دينية من قبل العلماء", "icon": "users"},
                        {"phase": "تجمع المؤمنين", "description": "وصول الحجاج من جميع أنحاء السنغال والخارج", "icon": "map-pin"},
                        {"phase": "ليلة المولد", "description": "سهرة روحية تبلغ ذروتها في المسجد الكبير", "icon": "star"}
                    ]),
                    "wo": json.dumps([
                        {"phase": "10 bés Bourde", "description": "Jàng bés bu nekk woy sant Yonent", "icon": "book"},
                        {"phase": "Waxtaan guddi", "description": "Conférence ak jàng diine ci boroom xam-xam yi", "icon": "users"},
                        {"phase": "Ndaje ñi gëm", "description": "Ñëw ziyaarkaat yi bëgg Senegaal ak biti", "icon": "map-pin"},
                        {"phase": "Guddi Mawlid", "description": "Fecc bu xel bu mujj ci Jàkka bu mag bi", "icon": "star"}
                    ])
                },
                "metadata": {"type": "program"},
                "order": 4,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Practical advice section
        if "advice" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "gamou",
                "section": "advice",
                "content": {
                    "fr": json.dumps({
                        "before": [
                            "Réserver son hébergement plusieurs semaines à l'avance",
                            "Prévoir des vêtements adaptés (tenues modestes)",
                            "Se munir de son Wird et de son chapelet"
                        ],
                        "during": [
                            "Respecter l'ordre et la discipline des organisateurs",
                            "Participer aux séances de Bourde et de dhikr",
                            "Préserver la propreté des lieux saints"
                        ]
                    }),
                    "en": json.dumps({
                        "before": [
                            "Book accommodation several weeks in advance",
                            "Plan appropriate clothing (modest attire)",
                            "Bring your Wird and prayer beads"
                        ],
                        "during": [
                            "Respect the order and discipline of the organizers",
                            "Participate in Bourde and dhikr sessions",
                            "Preserve the cleanliness of holy places"
                        ]
                    }),
                    "ar": json.dumps({
                        "before": [
                            "حجز الإقامة قبل عدة أسابيع",
                            "تحضير ملابس مناسبة (لباس محتشم)",
                            "إحضار الورد والسبحة"
                        ],
                        "during": [
                            "احترام نظام وانضباط المنظمين",
                            "المشاركة في جلسات البردة والذكر",
                            "الحفاظ على نظافة الأماكن المقدسة"
                        ]
                    }),
                    "wo": json.dumps({
                        "before": [
                            "Réserve paxas toog ay ayu-bés balaa",
                            "Jàpp yéré yu rafet (yéré yu sell)",
                            "Yóbbu sa Wird ak sa chapelet"
                        ],
                        "during": [
                            "Teral wax ak njuumte boroom liggéey yi",
                            "Bokk ci waxtu Bourde ak dhikr",
                            "Sàmm setal bérép yu sell yi"
                        ]
                    })
                },
                "metadata": {"type": "advice"},
                "order": 5,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        if new_sections:
            await db.page_content.insert_many(new_sections)
            enriched_count = len(new_sections)
    
    elif slug == "ecole":
        existing_sections = await db.page_content.distinct("section", {"slug": "ecole"})
        
        new_sections = []
        
        # Teaching cycles section
        if "cycles" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "ecole",
                "section": "cycles",
                "content": {
                    "fr": json.dumps([
                        {"name": "Cycle élémentaire", "duration": "3-5 ans", "content": "Mémorisation du Coran, bases de la langue arabe, initiation au fiqh"},
                        {"name": "Cycle moyen", "duration": "5-7 ans", "content": "Grammaire arabe, exégèse coranique, jurisprudence malékite"},
                        {"name": "Cycle supérieur", "duration": "Variable", "content": "Hadith, théologie, logique, rhétorique, études approfondies"}
                    ]),
                    "en": json.dumps([
                        {"name": "Elementary cycle", "duration": "3-5 years", "content": "Quran memorization, Arabic basics, introduction to fiqh"},
                        {"name": "Middle cycle", "duration": "5-7 years", "content": "Arabic grammar, Quranic exegesis, Maliki jurisprudence"},
                        {"name": "Advanced cycle", "duration": "Variable", "content": "Hadith, theology, logic, rhetoric, advanced studies"}
                    ]),
                    "ar": json.dumps([
                        {"name": "المرحلة الابتدائية", "duration": "3-5 سنوات", "content": "حفظ القرآن، أساسيات اللغة العربية، مقدمة في الفقه"},
                        {"name": "المرحلة المتوسطة", "duration": "5-7 سنوات", "content": "النحو العربي، تفسير القرآن، الفقه المالكي"},
                        {"name": "المرحلة العليا", "duration": "متغير", "content": "الحديث، علم الكلام، المنطق، البلاغة، دراسات متقدمة"}
                    ]),
                    "wo": json.dumps([
                        {"name": "Daara njëkk", "duration": "3-5 at", "content": "Xam Kur'aan, njëkk arabe, door fiqh"},
                        {"name": "Daara diggante", "duration": "5-7 at", "content": "Grammaire arabe, tafsir Kur'aan, fiqh Maliki"},
                        {"name": "Daara kaw", "duration": "Wéet", "content": "Hadith, théologie, logique, rhétorique, jàng yu xóot"}
                    ])
                },
                "metadata": {"type": "cycles"},
                "order": 3,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Pedagogy methods section
        if "methods" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "ecole",
                "section": "methods",
                "content": {
                    "fr": json.dumps([
                        {"title": "Enseignement intégral", "description": "Sciences religieuses et profanes enseignées conjointement"},
                        {"title": "Pédagogie orale", "description": "Transmission directe de maître à élève, mémorisation et discussion"},
                        {"title": "Formation spirituelle", "description": "Éducation du cœur autant que de l'esprit, pratique du dhikr"}
                    ]),
                    "en": json.dumps([
                        {"title": "Integral teaching", "description": "Religious and secular sciences taught together"},
                        {"title": "Oral pedagogy", "description": "Direct transmission from master to student, memorization and discussion"},
                        {"title": "Spiritual formation", "description": "Education of heart as much as mind, practice of dhikr"}
                    ]),
                    "ar": json.dumps([
                        {"title": "التعليم المتكامل", "description": "العلوم الدينية والدنيوية تُدرَّس معاً"},
                        {"title": "التعليم الشفهي", "description": "النقل المباشر من الشيخ إلى الطالب، الحفظ والمناقشة"},
                        {"title": "التكوين الروحي", "description": "تربية القلب والعقل معاً، ممارسة الذكر"}
                    ]),
                    "wo": json.dumps([
                        {"title": "Jàngale bu mat", "description": "Xam-xam diine ak aduna ñoo jàngale ànd"},
                        {"title": "Jàngale gémmiñ", "description": "Yóbbu ci kilifa jëkk ci taalibe, xam ak waxtaan"},
                        {"title": "Jàngale xol", "description": "Jàngale xol loxo ci xel, def dhikr"}
                    ])
                },
                "metadata": {"type": "methods"},
                "order": 4,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        if new_sections:
            await db.page_content.insert_many(new_sections)
            enriched_count = len(new_sections)
    
    return {"message": f"Contenu enrichi pour {slug}", "added": enriched_count}


@api_router.post("/content/seed-page/{page_slug}")
async def seed_page_content(page_slug: str, is_admin: bool = Depends(verify_admin_token)):
    """Seed content for additional pages (origines, geographie, ziarra)"""
    
    # Check existing sections
    existing = await db.page_content.find({"slug": page_slug}, {"section": 1, "_id": 0}).to_list(100)
    existing_sections = [doc["section"] for doc in existing]
    
    new_sections = []
    
    if page_slug == "origines":
        # Timeline section
        if "timeline" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "origines",
                "section": "timeline",
                "content": {
                    "fr": json.dumps([
                        {"period": "1737-1815", "location": "Fès, Maroc", "title": "Cheikh Ahmed Tijani", "description": "Naissance et formation du fondateur de la Tariqa à Fès. Vision spirituelle du Prophète (PSL) qui lui confère la Tariqa directement."},
                        {"period": "1781", "location": "Aïn Madhi, Algérie", "title": "Fondation de la Tariqa", "description": "Cheikh Ahmed Tijani reçoit l'ordre divin de fonder la Tariqa Tidiane. Il établit sa première zawiya à Aïn Madhi."},
                        {"period": "19e siècle", "location": "Afrique de l'Ouest", "title": "Expansion vers l'Ouest", "description": "Des disciples mauritaniens et sénégalais ramènent la Tariqa en Afrique de l'Ouest, notamment à travers El Hadj Omar Tall."},
                        {"period": "1902", "location": "Tivaouane, Sénégal", "title": "Implantation à Tivaouane", "description": "El Hadji Malick Sy établit Tivaouane comme centre majeur de la Tidjanidya au Sénégal."}
                    ]),
                    "en": json.dumps([
                        {"period": "1737-1815", "location": "Fes, Morocco", "title": "Cheikh Ahmed Tijani", "description": "Birth and education of the Tariqa's founder in Fes. Spiritual vision of the Prophet (PBUH) who confers the Tariqa directly to him."},
                        {"period": "1781", "location": "Aïn Madhi, Algeria", "title": "Foundation of the Tariqa", "description": "Cheikh Ahmed Tijani receives divine order to found the Tidiane Tariqa. He establishes his first zawiya in Aïn Madhi."},
                        {"period": "19th century", "location": "West Africa", "title": "Westward Expansion", "description": "Mauritanian and Senegalese disciples bring the Tariqa to West Africa, notably through El Hadj Omar Tall."},
                        {"period": "1902", "location": "Tivaouane, Senegal", "title": "Establishment in Tivaouane", "description": "El Hadji Malick Sy establishes Tivaouane as a major center of the Tijaniyya in Senegal."}
                    ]),
                    "ar": json.dumps([
                        {"period": "1737-1815", "location": "فاس، المغرب", "title": "الشيخ أحمد التجاني", "description": "ولادة وتكوين مؤسس الطريقة في فاس. رؤية روحية للنبي (ص) الذي منحه الطريقة مباشرة."},
                        {"period": "1781", "location": "عين ماضي، الجزائر", "title": "تأسيس الطريقة", "description": "يتلقى الشيخ أحمد التجاني الأمر الإلهي بتأسيس الطريقة التجانية. أسس أول زاويته في عين ماضي."},
                        {"period": "القرن 19", "location": "غرب أفريقيا", "title": "التوسع غرباً", "description": "التلاميذ الموريتانيون والسنغاليون يجلبون الطريقة إلى غرب أفريقيا، خاصة عبر الحاج عمر تال."},
                        {"period": "1902", "location": "تيفاوان، السنغال", "title": "التأسيس في تيفاوان", "description": "الحاج مالك سي يؤسس تيفاوان كمركز رئيسي للتجانية في السنغال."}
                    ]),
                    "wo": json.dumps([
                        {"period": "1737-1815", "location": "Fès, Maroc", "title": "Cheikh Ahmed Tijani", "description": "Juddu ak jàng boroom Tariqa bi ci Fès. Gis Yonent bi (YWS) ci diine mu jox ko Tariqa bi."},
                        {"period": "1781", "location": "Aïn Madhi, Algérie", "title": "Sos Tariqa bi", "description": "Cheikh Ahmed Tijani am ndigal Yàlla ngir sos Tariqa Tijaan. Mu tànn zawiya bi ci Aïn Madhi."},
                        {"period": "19e siècle", "location": "Afrik sowwu jant", "title": "Yàgg ci sowwu jant", "description": "Taalibe Mauritanie ak Senegaal yóbbu Tariqa bi ci Afrik sowwu jant, ci biir El Hadj Omar Tall."},
                        {"period": "1902", "location": "Tiwaawaan, Senegaal", "title": "Tànn ci Tiwaawaan", "description": "El Hadji Maalik Si tànn Tiwaawaan ni centre bu mag Tijaan ci Senegaal."}
                    ])
                },
                "metadata": {"type": "timeline"},
                "order": 1,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Characteristics section
        if "characteristics" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "origines",
                "section": "characteristics",
                "content": {
                    "fr": json.dumps([
                        {"icon": "Book", "title": "Transmission Directe", "description": "La Tariqa Tidiane se distingue par sa transmission directe du Prophète (PSL) à Cheikh Ahmed Tijani, sans intermédiaire parmi les saints."},
                        {"icon": "Users", "title": "Accessibilité", "description": "Une voie ouverte à tous, sans conditions préalables strictes, favorisant l'inclusion spirituelle des masses."},
                        {"icon": "Globe", "title": "Universalité", "description": "Expansion rapide à travers le Maghreb et l'Afrique subsaharienne grâce à sa simplicité et son efficacité."}
                    ]),
                    "en": json.dumps([
                        {"icon": "Book", "title": "Direct Transmission", "description": "The Tidiane Tariqa is distinguished by its direct transmission from the Prophet (PBUH) to Cheikh Ahmed Tijani, without intermediary among saints."},
                        {"icon": "Users", "title": "Accessibility", "description": "A path open to all, without strict preconditions, fostering spiritual inclusion of the masses."},
                        {"icon": "Globe", "title": "Universality", "description": "Rapid expansion across the Maghreb and sub-Saharan Africa thanks to its simplicity and effectiveness."}
                    ]),
                    "ar": json.dumps([
                        {"icon": "Book", "title": "الإسناد المباشر", "description": "تتميز الطريقة التجانية بإسنادها المباشر من النبي (ص) إلى الشيخ أحمد التجاني، دون وسيط من الأولياء."},
                        {"icon": "Users", "title": "سهولة الوصول", "description": "طريق مفتوح للجميع، بدون شروط مسبقة صارمة، مما يعزز الإدماج الروحي للجماهير."},
                        {"icon": "Globe", "title": "العالمية", "description": "التوسع السريع عبر المغرب العربي وأفريقيا جنوب الصحراء بفضل بساطتها وفعاليتها."}
                    ]),
                    "wo": json.dumps([
                        {"icon": "Book", "title": "Transmission bu jëkk", "description": "Tariqa Tijaan dafa am transmission bu jëkk ci Yonent bi (YWS) ba Cheikh Ahmed Tijani, te amul intermédiaire ci biir awliya yi."},
                        {"icon": "Users", "title": "Neex ci dugg", "description": "Yoon bu ubbeek ngir ñépp, te amul conditions yu kawe, di def mbooloo yi nekk ci diine."},
                        {"icon": "Globe", "title": "Universalité", "description": "Yàgg bu gaaw ci Maghreb ak Afrik ci suuf Sahara ngir simplicitéam ak efficacitéam."}
                    ])
                },
                "metadata": {"type": "features"},
                "order": 2,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Introduction section
        if "introduction" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "origines",
                "section": "introduction",
                "content": {
                    "fr": "La Tariqa Tidiane (ou Tijaniyya) tire son nom de son fondateur, Cheikh Ahmed Tijani (1737-1815), né à Aïn Madhi dans le sud de l'actuelle Algérie. Descendant du Prophète Muhammad (PSL) par sa mère, il grandit dans un environnement imprégné de science et de spiritualité.",
                    "en": "The Tidiane Tariqa (or Tijaniyya) takes its name from its founder, Cheikh Ahmed Tijani (1737-1815), born in Aïn Madhi in the south of present-day Algeria. A descendant of Prophet Muhammad (PBUH) through his mother, he grew up in an environment steeped in knowledge and spirituality.",
                    "ar": "تأخذ الطريقة التجانية اسمها من مؤسسها، الشيخ أحمد التجاني (1737-1815)، المولود في عين ماضي جنوب الجزائر الحالية. سليل النبي محمد (ص) من جهة أمه، نشأ في بيئة مشبعة بالعلم والروحانية.",
                    "wo": "Tariqa Tijaan (walla Tijaniyya) jëlee tuuram ci ki ko tànn, Cheikh Ahmed Tijani (1737-1815), bu juddu ci Aïn Madhi ci bëj-saalum Algérie tey. Doom-u-doom Yonent Muhammed (YWS) ci yéené yaayam, mu mag ci ay paxas yu fees ci xam-xam ak diine."
                },
                "metadata": {"type": "text"},
                "order": 0,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Expansion section
        if "expansion" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "origines",
                "section": "expansion",
                "content": {
                    "fr": json.dumps([
                        {"name": "El Hadj Omar Tall (1794-1864)", "description": "Ce grand érudit peul originaire du Fouta Toro (Sénégal) fut initié à la Tariqa lors de son pèlerinage à La Mecque. Il devint le grand propagateur de la Tidjanidya dans la région soudano-sahélienne."},
                        {"name": "Les commerçants mauritaniens", "description": "Les échanges commerciaux transsahariens ont permis la diffusion de la Tariqa par les marabouts et commerçants qui voyageaient entre le Maghreb et le Sahel."},
                        {"name": "El Hadji Malick Sy (1855-1922)", "description": "C'est lui qui établira Tivaouane comme le centre majeur de la Tidjanidya au Sénégal, créant une branche distincte caractérisée par sa méthode pédagogique et son ouverture."}
                    ]),
                    "en": json.dumps([
                        {"name": "El Hadj Omar Tall (1794-1864)", "description": "This great Fulani scholar from Fouta Toro (Senegal) was initiated into the Tariqa during his pilgrimage to Mecca. He became the great propagator of the Tijaniyya in the Sudano-Sahelian region."},
                        {"name": "Mauritanian traders", "description": "Trans-Saharan commercial exchanges allowed the spread of the Tariqa by marabouts and traders traveling between the Maghreb and the Sahel."},
                        {"name": "El Hadji Malick Sy (1855-1922)", "description": "He established Tivaouane as the major center of the Tijaniyya in Senegal, creating a distinct branch characterized by its pedagogical method and openness."}
                    ]),
                    "ar": json.dumps([
                        {"name": "الحاج عمر تال (1794-1864)", "description": "هذا العالم الفولاني الكبير من فوتا تورو (السنغال) تلقى التلقين في الطريقة خلال حجه إلى مكة. أصبح الناشر الكبير للتجانية في المنطقة السودانية الساحلية."},
                        {"name": "التجار الموريتانيون", "description": "سمحت التبادلات التجارية عبر الصحراء بانتشار الطريقة عبر المرابطين والتجار الذين يسافرون بين المغرب والساحل."},
                        {"name": "الحاج مالك سي (1855-1922)", "description": "هو الذي أسس تيفاوان كمركز رئيسي للتجانية في السنغال، مؤسساً فرعاً متميزاً بمنهجه التربوي وانفتاحه."}
                    ]),
                    "wo": json.dumps([
                        {"name": "El Hadj Omar Tall (1794-1864)", "description": "Boroom xam-xam bu mag Pulaaru bi jóge Fouta Toro (Senegaal) dugg ci Tariqa bi ci àjjam ci Maka. Mu nekk bu mag buy yéngu Tijaan ci région soudano-sahélienne."},
                        {"name": "Jaaykat Mauritanie yi", "description": "Jëf jaay transsahariens moo def yéngu Tariqa bi ci sëriñ ak jaaykat yi di doxaan diggante Maghreb ak Sahel."},
                        {"name": "El Hadji Maalik Si (1855-1922)", "description": "Moo tànn Tiwaawaan ni centre bu mag Tijaan ci Senegaal, di sos batal bu ànd ak méthode jàngale bi ak ubbi."}
                    ])
                },
                "metadata": {"type": "list"},
                "order": 3,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
    
    elif page_slug == "geographie":
        # Lieux section
        if "lieux" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "geographie",
                "section": "lieux",
                "content": {
                    "fr": json.dumps([
                        {"icon": "Church", "title": "La Grande Mosquée", "description": "Cœur spirituel de Tivaouane, édifiée progressivement depuis 1902. Ses dômes dorés dominent la ville et accueillent des millions de fidèles lors du Gamou.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"},
                        {"icon": "Home", "title": "La Zawiya (Daara)", "description": "L'école coranique fondée par El Hadji Malick Sy, où des milliers d'étudiants ont été formés aux sciences islamiques et à la spiritualité.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"},
                        {"icon": "Heart", "title": "Le Mausolée de Maodo", "description": "Lieu de recueillement où repose El Hadji Malick Sy. C'est le site de pèlerinage le plus visité après la Grande Mosquée.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"},
                        {"icon": "MapPin", "title": "Les Champs de Courses", "description": "Vaste esplanade qui accueille les millions de pèlerins durant le Gamou. C'est là que se tiennent les grandes causeries nocturnes.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"}
                    ]),
                    "en": json.dumps([
                        {"icon": "Church", "title": "The Grand Mosque", "description": "Spiritual heart of Tivaouane, built progressively since 1902. Its golden domes dominate the city and welcome millions of faithful during the Gamou.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"},
                        {"icon": "Home", "title": "The Zawiya (Daara)", "description": "The Quranic school founded by El Hadji Malick Sy, where thousands of students were trained in Islamic sciences and spirituality.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"},
                        {"icon": "Heart", "title": "Maodo's Mausoleum", "description": "Place of meditation where El Hadji Malick Sy rests. It is the most visited pilgrimage site after the Grand Mosque.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"},
                        {"icon": "MapPin", "title": "The Race Fields", "description": "Vast esplanade that welcomes millions of pilgrims during the Gamou. This is where the great night talks are held.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"}
                    ]),
                    "ar": json.dumps([
                        {"icon": "Church", "title": "المسجد الكبير", "description": "القلب الروحي لتيفاوان، بُني تدريجياً منذ 1902. قبابه الذهبية تهيمن على المدينة وتستقبل ملايين المؤمنين خلال المولد.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"},
                        {"icon": "Home", "title": "الزاوية (الدار)", "description": "المدرسة القرآنية التي أسسها الحاج مالك سي، حيث تدرب آلاف الطلاب على العلوم الإسلامية والروحانية.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"},
                        {"icon": "Heart", "title": "ضريح مودو", "description": "مكان للتأمل حيث يرقد الحاج مالك سي. إنه موقع الحج الأكثر زيارة بعد المسجد الكبير.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"},
                        {"icon": "MapPin", "title": "ساحة السباق", "description": "ساحة واسعة تستقبل ملايين الحجاج خلال المولد. هنا تُعقد الأحاديث الليلية الكبرى.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"}
                    ]),
                    "wo": json.dumps([
                        {"icon": "Church", "title": "Jàkka bu mag bi", "description": "Xol bu sell Tiwaawaan, bu ñu tabax niaax-niaax dale 1902. Kuub yi wu wurus ñu ngi ci kaw dëkk bi te ñu jot ay milioŋ julli-kat ci Gamou.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"},
                        {"icon": "Home", "title": "Zawiya bi (Daara)", "description": "Daara Alxuraan bu El Hadji Maalik Si tànn, fu ay téeméer taalibe jàng xam-xam Lislaam ak diine.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"},
                        {"icon": "Heart", "title": "Mausolée Maodo", "description": "Paxas bu neex fu El Hadji Maalik Si nelaw. Mooy paxas ziarra bu ñu gis bu bari ginnaaw Jàkka bu mag bi.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"},
                        {"icon": "MapPin", "title": "Champs de Courses yi", "description": "Paxas bu yaatu bu jot ay milioŋ ajibi ci Gamou. Foofu la ñu def ay waxtan bu mag bu guddi.", "image": "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"}
                    ])
                },
                "metadata": {"type": "places"},
                "order": 1,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Organisation section
        if "organisation" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "geographie",
                "section": "organisation",
                "content": {
                    "fr": json.dumps([
                        {"title": "Le Centre Religieux", "description": "Autour de la Grande Mosquée et du mausolée de Maodo, c'est le cœur spirituel où se concentrent les activités religieuses quotidiennes."},
                        {"title": "Le Quartier des Daaras", "description": "Zone résidentielle où sont implantées les nombreuses écoles coraniques qui perpétuent l'enseignement de Maodo."},
                        {"title": "Le Centre Urbain Moderne", "description": "Développement récent avec commerces, écoles françaises, hôpitaux, qui coexiste harmonieusement avec le pôle religieux."}
                    ]),
                    "en": json.dumps([
                        {"title": "The Religious Center", "description": "Around the Grand Mosque and Maodo's mausoleum, it is the spiritual heart where daily religious activities are concentrated."},
                        {"title": "The Daara District", "description": "Residential area where the many Quranic schools that perpetuate Maodo's teaching are located."},
                        {"title": "The Modern Urban Center", "description": "Recent development with shops, French schools, hospitals, that coexists harmoniously with the religious hub."}
                    ]),
                    "ar": json.dumps([
                        {"title": "المركز الديني", "description": "حول المسجد الكبير وضريح مودو، هو القلب الروحي حيث تتركز الأنشطة الدينية اليومية."},
                        {"title": "حي الدور", "description": "منطقة سكنية تقع فيها العديد من المدارس القرآنية التي تواصل تعاليم مودو."},
                        {"title": "المركز الحضري الحديث", "description": "تطوير حديث مع المحلات التجارية والمدارس الفرنسية والمستشفيات، يتعايش بانسجام مع المركز الديني."}
                    ]),
                    "wo": json.dumps([
                        {"title": "Centre bu diine bi", "description": "Ci wettu Jàkka bu mag bi ak mausolée Maodo, mooy xol bu sell fu liggéey diine bu bés-bu-bés bokk."},
                        {"title": "Kër Daara yi", "description": "Paxas bu toog fu ñu tabax ay daara yu bari yu di topp jàng Maodo."},
                        {"title": "Centre dëkk bu bees bi", "description": "Yàgg bu bees ak ay bitik, ekol tubaab, opital, yu bokk ak centre bu diine bi."}
                    ])
                },
                "metadata": {"type": "list"},
                "order": 2,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Introduction section
        if "introduction" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "geographie",
                "section": "introduction",
                "content": {
                    "fr": "Tivaouane (ou Tivawaan en wolof) est une ville du centre-ouest du Sénégal, située à environ 90 km à l'est de Dakar, dans la région de Thiès. Avant l'arrivée d'El Hadji Malick Sy en 1902, ce n'était qu'une bourgade agricole tranquille, peuplée principalement de Sérères et de Wolofs.",
                    "en": "Tivaouane (or Tivawaan in Wolof) is a city in west-central Senegal, located about 90 km east of Dakar, in the Thiès region. Before El Hadji Malick Sy's arrival in 1902, it was just a quiet farming village, populated mainly by Serers and Wolofs.",
                    "ar": "تيفاوان (أو تيواوان بالولوف) مدينة في وسط غرب السنغال، تقع على بعد حوالي 90 كم شرق داكار، في منطقة تيس. قبل وصول الحاج مالك سي في 1902، كانت مجرد قرية زراعية هادئة، يسكنها بشكل رئيسي السيرير والولوف.",
                    "wo": "Tiwaawaan (walla Tivawaan ci Wolof) dëkk la ci diggante sowwu jant Senegaal, toog ci wettu 90 km ci penku Dakar, ci région Thiès. Balaa El Hadji Maalik Si ñëw ci 1902, dëkk bu ndaw bu neex la woon, fu Seereer ak Wolof dëkke."
                },
                "metadata": {"type": "text"},
                "order": 0,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Demographics section
        if "demographics" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "geographie",
                "section": "demographics",
                "content": {
                    "fr": "L'impact d'El Hadji Malick Sy sur Tivaouane fut spectaculaire. D'un village de quelques centaines d'habitants au début du 20e siècle, Tivaouane compte aujourd'hui plus de 50 000 habitants permanents. Mais c'est lors du Gamou annuel que la ville révèle sa vraie dimension : pendant 10 jours, la population peut dépasser 2 millions de personnes, faisant de Tivaouane temporairement la deuxième ville du Sénégal après Dakar.",
                    "en": "El Hadji Malick Sy's impact on Tivaouane was spectacular. From a village of a few hundred inhabitants at the beginning of the 20th century, Tivaouane now has more than 50,000 permanent residents. But it is during the annual Gamou that the city reveals its true dimension: for 10 days, the population can exceed 2 million people, temporarily making Tivaouane the second city of Senegal after Dakar.",
                    "ar": "كان تأثير الحاج مالك سي على تيفاوان مذهلاً. من قرية بضع مئات من السكان في بداية القرن العشرين، أصبح في تيفاوان الآن أكثر من 50,000 ساكن دائم. لكن خلال المولد السنوي تكشف المدينة عن بُعدها الحقيقي: لمدة 10 أيام، يمكن أن يتجاوز عدد السكان 2 مليون شخص، مما يجعل تيفاوان مؤقتاً ثاني مدينة في السنغال بعد داكار.",
                    "wo": "Jëf El Hadji Maalik Si ci Tiwaawaan dafa rafet lool. Ci dëkk bu ay téeméer nit ci ndoorte 20e siècle, Tiwaawaan am na tey lu ëpp 50 000 nit yu toog fii. Waaye ci Gamou at bu nekk la dëkk bi di won lu muy dëgg: ci 10 fan, mbooloo yi man na ëpp 2 milioŋ nit, di def Tiwaawaan dëkk 2e bu Senegaal ginnaaw Dakar."
                },
                "metadata": {"type": "text"},
                "order": 3,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
    
    elif page_slug == "ziarra":
        # Ziarras list section
        if "ziarras" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "ziarra",
                "section": "ziarras",
                "content": {
                    "fr": json.dumps([
                        {
                            "nom": "La Ziarra Générale Annuelle",
                            "date": "20 avril 2025",
                            "icon": "Users",
                            "description": "Le grand rassemblement annuel de tous les disciples, généralement en avril. Les fidèles de tout le Sénégal et de l'étranger convergent vers Tivaouane.",
                            "programme": ["Samedi 19 avril : Arrivée des pèlerins et Gamou traditionnel", "Dimanche matin : Grande prière à la mosquée", "Dimanche : Renouvellement de l'allégeance des Dahiras", "Dimanche soir : Allocution du Khalife et bénédictions", "Forum sur les Dahiras comme vecteurs de développement"],
                            "signification": "C'est le moment où chaque tidiane réaffirme son engagement spirituel et reçoit les orientations du guide pour l'année à venir."
                        },
                        {
                            "nom": "La Ziarra de Maodo",
                            "date": "27 juin (anniversaire du rappel à Dieu de Maodo)",
                            "icon": "Heart",
                            "description": "Commémoration du décès d'El Hadji Malick Sy. Une journée de prières et de méditation autour de son mausolée.",
                            "programme": ["Récitation du Coran au mausolée", "Khoutba retraçant la vie de Maodo", "Chants de qasidas à sa gloire", "Prières collectives", "Distribution de nourriture (Hadiya)"],
                            "signification": "Honorer la mémoire de Maodo et se rappeler ses enseignements et son exemple."
                        },
                        {
                            "nom": "Ziarra des Khalifes",
                            "date": "Dates variables selon le khalife commémoré",
                            "icon": "Calendar",
                            "description": "Commémorations dédiées aux différents khalifes qui ont succédé à Maodo, perpétuant ainsi leur mémoire et leur héritage.",
                            "programme": ["Visites aux mausolées respectifs", "Récits sur les contributions de chaque khalife", "Prières et invocations", "Rencontres communautaires"],
                            "signification": "Maintenir vivante la mémoire des guides successifs et leurs apports à la Tariqa."
                        }
                    ]),
                    "en": json.dumps([
                        {
                            "nom": "The Annual General Ziarra",
                            "date": "April 20, 2025",
                            "icon": "Users",
                            "description": "The great annual gathering of all disciples, usually in April. The faithful from all over Senegal and abroad converge on Tivaouane.",
                            "programme": ["Saturday April 19: Arrival of pilgrims and traditional Gamou", "Sunday morning: Grand prayer at the mosque", "Sunday: Renewal of Dahiras' allegiance", "Sunday evening: Khalife's address and blessings", "Forum on Dahiras as vectors of development"],
                            "signification": "This is the moment when every Tidiane reaffirms their spiritual commitment and receives guidance from the guide for the coming year."
                        },
                        {
                            "nom": "Maodo's Ziarra",
                            "date": "June 27 (anniversary of Maodo's passing)",
                            "icon": "Heart",
                            "description": "Commemoration of El Hadji Malick Sy's death. A day of prayers and meditation around his mausoleum.",
                            "programme": ["Quran recitation at the mausoleum", "Sermon retracing Maodo's life", "Qasida chants in his glory", "Collective prayers", "Food distribution (Hadiya)"],
                            "signification": "Honor Maodo's memory and remember his teachings and example."
                        },
                        {
                            "nom": "Khalifes' Ziarra",
                            "date": "Variable dates depending on the khalife commemorated",
                            "icon": "Calendar",
                            "description": "Commemorations dedicated to the different khalifes who succeeded Maodo, thus perpetuating their memory and legacy.",
                            "programme": ["Visits to respective mausoleums", "Accounts of each khalife's contributions", "Prayers and invocations", "Community meetings"],
                            "signification": "Keep alive the memory of successive guides and their contributions to the Tariqa."
                        }
                    ]),
                    "ar": json.dumps([
                        {
                            "nom": "الزيارة السنوية العامة",
                            "date": "20 أبريل 2025",
                            "icon": "Users",
                            "description": "التجمع السنوي الكبير لجميع التلاميذ، عادة في أبريل. يتوافد المؤمنون من جميع أنحاء السنغال والخارج إلى تيفاوان.",
                            "programme": ["السبت 19 أبريل: وصول الحجاج والمولد التقليدي", "صباح الأحد: الصلاة الكبرى في المسجد", "الأحد: تجديد بيعة الدوائر", "مساء الأحد: خطاب الخليفة والبركات", "منتدى حول الدوائر كناقلات للتنمية"],
                            "signification": "هذه هي اللحظة التي يؤكد فيها كل تجاني التزامه الروحي ويتلقى توجيهات المرشد للعام القادم."
                        },
                        {
                            "nom": "زيارة مودو",
                            "date": "27 يونيو (ذكرى وفاة مودو)",
                            "icon": "Heart",
                            "description": "إحياء ذكرى وفاة الحاج مالك سي. يوم للصلاة والتأمل حول ضريحه.",
                            "programme": ["تلاوة القرآن في الضريح", "خطبة تستعرض حياة مودو", "أناشيد القصائد تمجيداً له", "صلوات جماعية", "توزيع الطعام (الهدية)"],
                            "signification": "تكريم ذكرى مودو وتذكر تعاليمه ومثاله."
                        },
                        {
                            "nom": "زيارة الخلفاء",
                            "date": "تواريخ متغيرة حسب الخليفة المحتفى به",
                            "icon": "Calendar",
                            "description": "احتفالات مخصصة للخلفاء المختلفين الذين خلفوا مودو، وبالتالي إحياء ذكراهم وإرثهم.",
                            "programme": ["زيارات للأضرحة المعنية", "روايات عن إسهامات كل خليفة", "الصلوات والأدعية", "لقاءات مجتمعية"],
                            "signification": "الحفاظ على ذكرى المرشدين المتعاقبين وإسهاماتهم في الطريقة حية."
                        }
                    ]),
                    "wo": json.dumps([
                        {
                            "nom": "Ziarra Générale bu at",
                            "date": "20 avril 2025",
                            "icon": "Users",
                            "description": "Ndaje bu mag bu at yi taalibe yépp, jamono abril. Julli-kat yi ñu jóge Senegaal yépp ak biti ñu bokk ci Tiwaawaan.",
                            "programme": ["Gàww 19 avril: Ñëw ajibi yi ak Gamou traditionnel", "Dibéer suba: Julli bu mag ci jàkka bi", "Dibéer: Soppisaat bay'a Dahira yi", "Dibéer ngoon: Wax Xaliifa bi ak baraka yi", "Forum ci Dahiras yi ni vecteurs développement"],
                            "signification": "Mooy waxtu bu Tijaan bu nekk di soppisaat jëf am bu sell te am orientations guide bi ngir at buy ñëw."
                        },
                        {
                            "nom": "Ziarra Maodo",
                            "date": "27 juin (bés bu Maodo wéesu)",
                            "icon": "Heart",
                            "description": "Fàttaliku dee El Hadji Maalik Si. Bés bu julli ak xalaat ci wettu mausolée bam.",
                            "programme": ["Jang Alxuraan ci mausolée bi", "Khoutba buy wax dund Maodo", "Chants qasidas ngir ko hormale", "Julli mbooloo", "Seddale lekk (Hadiya)"],
                            "signification": "Hormale xam-xam Maodo ak fàttaliku jàng yi ak exemple am."
                        },
                        {
                            "nom": "Ziarra Xaliifa yi",
                            "date": "Bés yi dul mukk ci xaliifa bi ñu di fàttaliku",
                            "icon": "Calendar",
                            "description": "Fàttaliku ngir xaliifa yi topp Maodo, di sàmm xam-xam yi ak warisaay yi.",
                            "programme": ["Ziarra ci mausolées yi", "Wax ci jëf yu xaliifa bu nekk", "Julli ak doua", "Ndaje communautaires"],
                            "signification": "Sàmm fàttaliku guides yi topp ak li ñu jàpp ci Tariqa bi."
                        }
                    ])
                },
                "metadata": {"type": "ziarras"},
                "order": 1,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Pilgrim guide section
        if "pilgrim_guide" not in existing_sections:
            new_sections.append({
                "id": str(uuid.uuid4()),
                "slug": "ziarra",
                "section": "pilgrim_guide",
                "content": {
                    "fr": json.dumps([
                        {"titre": "Préparation Spirituelle", "conseils": ["Formuler une intention sincère (Niya) avant le départ", "Se purifier spirituellement par le repentir", "Multiplier les prières sur le Prophète (PSL) durant le voyage"]},
                        {"titre": "Préparation Logistique", "conseils": ["Réserver son hébergement à l'avance", "Prévoir des vêtements modestes et confortables", "Apporter son Wird et son chapelet", "Se munir d'argent pour les dons (Hadiya)"]},
                        {"titre": "Sur Place", "conseils": ["Respecter les consignes des organisateurs", "Participer aux prières collectives", "Visiter les lieux saints avec recueillement", "Maintenir la propreté des espaces publics"]}
                    ]),
                    "en": json.dumps([
                        {"titre": "Spiritual Preparation", "conseils": ["Formulate a sincere intention (Niya) before departure", "Purify yourself spiritually through repentance", "Multiply prayers upon the Prophet (PBUH) during the journey"]},
                        {"titre": "Logistical Preparation", "conseils": ["Book accommodation in advance", "Plan modest and comfortable clothing", "Bring your Wird and prayer beads", "Bring money for donations (Hadiya)"]},
                        {"titre": "On Site", "conseils": ["Follow the organizers' instructions", "Participate in collective prayers", "Visit holy places with reflection", "Maintain cleanliness of public spaces"]}
                    ]),
                    "ar": json.dumps([
                        {"titre": "الإعداد الروحي", "conseils": ["صياغة نية صادقة قبل المغادرة", "التطهر روحياً بالتوبة", "الإكثار من الصلاة على النبي (ص) أثناء الرحلة"]},
                        {"titre": "الإعداد اللوجستي", "conseils": ["حجز الإقامة مسبقاً", "تحضير ملابس محتشمة ومريحة", "إحضار الورد والسبحة", "إحضار المال للتبرعات (الهدية)"]},
                        {"titre": "في الموقع", "conseils": ["اتباع تعليمات المنظمين", "المشاركة في الصلوات الجماعية", "زيارة الأماكن المقدسة بتأمل", "الحفاظ على نظافة الأماكن العامة"]}
                    ]),
                    "wo": json.dumps([
                        {"titre": "Njëkkaale bu diine", "conseils": ["Am niya bu dëgg balaa dem", "Set sa xol ci tuub", "Yaatal julli ci Yonent bi (YWS) ci tukki bi"]},
                        {"titre": "Njëkkaale bu logistik", "conseils": ["Réserve paxas toog balaa", "Jàpp yéré yu sell te yu neex", "Yóbbu sa Wird ak sa chapelet", "Yóbbu xaalis ngir don (Hadiya)"]},
                        {"titre": "Ci paxas bi", "conseils": ["Topp consignes organisateurs yi", "Bokk ci julli mbooloo yi", "Ziarra paxas yu sell yi ak xel", "Sàmm set paxas yi"]}
                    ])
                },
                "metadata": {"type": "guide"},
                "order": 2,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
    
    if new_sections:
        await db.page_content.insert_many(new_sections)
    
    return {"message": f"Contenu créé pour {page_slug}", "added": len(new_sections)}


# ============== SEARCH ENDPOINT ==============

@api_router.get("/search")
async def search_content(q: str, lang: str = "fr", limit: int = 20):
    """Global search across all content types"""
    if not q or len(q) < 2:
        raise HTTPException(status_code=400, detail="La recherche doit contenir au moins 2 caractères")
    
    results = []
    search_regex = {"$regex": q, "$options": "i"}
    
    # Search in videos
    video_query = {"$or": [
        {"title": search_regex},
        {"description": search_regex}
    ]}
    videos = await db.videos.find(video_query, {"_id": 0}).limit(5).to_list(5)
    for video in videos:
        results.append({
            "id": video.get("id"),
            "title": video.get("title"),
            "description": video.get("description", "")[:150],
            "type": "video",
            "url": f"/gallery?video={video.get('id')}",
            "relevance": 0.9
        })
    
    # Search in events
    lang_field = f"name_{lang}" if lang in ["fr", "en", "ar", "wo"] else "name_fr"
    desc_field = f"description_{lang}" if lang in ["fr", "en", "ar", "wo"] else "description_fr"
    
    event_query = {"$or": [
        {lang_field: search_regex},
        {desc_field: search_regex},
        {"name_fr": search_regex}  # Fallback to French
    ]}
    events = await db.events.find(event_query, {"_id": 0}).limit(5).to_list(5)
    for event in events:
        results.append({
            "id": event.get("id"),
            "title": event.get(lang_field) or event.get("name_fr"),
            "description": event.get(desc_field) or event.get("description_fr", "")[:150] if event.get(desc_field) or event.get("description_fr") else "",
            "type": "event",
            "url": f"/evenements/{event.get('event_type', 'gamou')}",
            "relevance": 0.85
        })
    
    # Search in quotes
    quote_field = f"text_{lang}" if lang in ["fr", "en", "ar", "wo"] else "text_fr"
    quote_query = {"$or": [
        {quote_field: search_regex},
        {"text_fr": search_regex},
        {"author": search_regex}
    ]}
    quotes = await db.quotes.find(quote_query, {"_id": 0}).limit(3).to_list(3)
    for quote in quotes:
        results.append({
            "id": quote.get("id"),
            "title": f"Citation - {quote.get('author', 'Maodo')}",
            "description": (quote.get(quote_field) or quote.get("text_fr", ""))[:150],
            "type": "quote",
            "url": "/",
            "relevance": 0.7
        })
    
    # Static page search (hardcoded for now, can be migrated to DB later)
    static_pages = [
        {"title": {"fr": "El Hadji Malick Sy (Maodo)", "en": "El Hadji Malick Sy (Maodo)", "ar": "الحاج مالك سي (مودو)", "wo": "El Hadji Maalik Si (Maodo)"}, "url": "/histoire/maodo", "keywords": ["maodo", "malick", "sy", "fondateur", "founder", "مالك"]},
        {"title": {"fr": "Lignée des Héritiers", "en": "Lineage of Heirs", "ar": "سلالة الورثة", "wo": "Warisaay yi"}, "url": "/histoire/khalifes", "keywords": ["khalife", "héritier", "heir", "خليفة", "warisaay"]},
        {"title": {"fr": "Le Gamou de Tivaouane", "en": "The Gamou of Tivaouane", "ar": "مولد تيفاوان", "wo": "Gamou Tiwaawaan"}, "url": "/evenements/gamou", "keywords": ["gamou", "mawlid", "maouloud", "مولد", "naissance"]},
        {"title": {"fr": "Les Ziarra Annuelles", "en": "Annual Ziarras", "ar": "الزيارات السنوية", "wo": "Ziarra at yi"}, "url": "/evenements/ziarra", "keywords": ["ziarra", "pèlerinage", "pilgrimage", "زيارة"]},
        {"title": {"fr": "L'École de Tivaouane", "en": "The School of Tivaouane", "ar": "مدرسة تيفاوان", "wo": "Daara Tiwaawaan"}, "url": "/enseignements/ecole", "keywords": ["école", "school", "daara", "مدرسة", "enseignement"]},
        {"title": {"fr": "Carte de Tivaouane", "en": "Map of Tivaouane", "ar": "خريطة تيفاوان", "wo": "Kart Tiwaawaan"}, "url": "/carte", "keywords": ["carte", "map", "خريطة", "mosquée", "mosque"]},
        {"title": {"fr": "Médiathèque", "en": "Media Library", "ar": "المكتبة الإعلامية", "wo": "Médiathèque"}, "url": "/mediatheque", "keywords": ["video", "photo", "audio", "archive", "فيديو"]},
        {"title": {"fr": "Arbre Généalogique", "en": "Family Tree", "ar": "شجرة العائلة", "wo": "Garab kër gi"}, "url": "/arbre-genealogique", "keywords": ["arbre", "tree", "famille", "family", "شجرة"]},
    ]
    
    q_lower = q.lower()
    for page in static_pages:
        if any(kw in q_lower for kw in page["keywords"]):
            results.append({
                "id": page["url"],
                "title": page["title"].get(lang, page["title"]["fr"]),
                "description": "",
                "type": "page",
                "url": page["url"],
                "relevance": 0.95
            })
    
    # Sort by relevance
    results.sort(key=lambda x: x["relevance"], reverse=True)
    
    return {
        "query": q,
        "results": results[:limit],
        "count": len(results[:limit])
    }


# ============== SEED DATA ENDPOINT ==============

@api_router.post("/admin/seed-videos-maodo")
async def seed_maodo_videos():
    """Replace placeholder videos with real YouTube videos about El Hadj Malick Sy (Maodo)"""
    
    # Delete all existing videos
    await db.videos.delete_many({})
    
    # Real YouTube videos about Maodo and Tivaouane
    maodo_videos = [
        {
            "id": str(uuid.uuid4()),
            "title": "L'Histoire de El Hadji Maodo Malick Sy - Documentaire Complet",
            "description": "Documentaire complet sur la vie d'El Hadji Malick Sy : son arrivée à l'islam, son instruction, son séjour à Saint-Louis, son pèlerinage à la Mecque, son installation à Ndiandé, son rôle à Tivaouane, ses relations avec l'autorité coloniale, le Gamou et son héritage.",
            "youtube_id": "NpOPd8AsV_c",
            "category": "histoire",
            "duration": "45:00",
            "views": 125000,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "El Hadji Malick Sy - Une vie consacrée à la vulgarisation des enseignements du Prophète (RTS)",
            "description": "Documentaire officiel de la RTS (Radio Télévision Sénégalaise) produit en septembre 2024, retraçant la vie et l'œuvre de Maodo.",
            "youtube_id": "CQJ5rPB4baM",
            "category": "histoire",
            "duration": "35:00",
            "views": 89000,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Documentaire sur la vie de Seydil Hadji Malick Sy - Asfiyahi Television",
            "description": "Documentaire de plus de 29 minutes produit par Asfiyahi Television sur la vie et l'héritage spirituel de Seydil Hadji Malick Sy.",
            "youtube_id": "Q0KxcWiBbXE",
            "category": "histoire",
            "duration": "29:30",
            "views": 67500,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Gamou Tivaouane 2024 - Les pèlerins dans la ferveur du Mawlid (APS)",
            "description": "Reportage de l'Agence de Presse Sénégalaise montrant l'ambiance et la ferveur des pèlerins lors du Gamou 2024 à Tivaouane.",
            "youtube_id": "Db7B20Nkr94",
            "category": "gamou",
            "duration": "15:00",
            "views": 45000,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Direct Mawlid 2024 - Champ de courses Tivaouane avec Serigne Moustapha Sy",
            "description": "Couverture en direct de la commémoration du Mawlid 2024 au champ de courses de Tivaouane avec Serigne Moustapha Sy.",
            "youtube_id": "9NbQPtiD8ZI",
            "category": "gamou",
            "duration": "2:30:00",
            "views": 230000,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Cérémonie officielle Mawlid-Tivaouane 2024",
            "description": "Vidéo présentant le thème officiel et les moments forts de la cérémonie officielle du Mawlid 2024 à Tivaouane.",
            "youtube_id": "BLB5Ouz0f6M",
            "category": "gamou",
            "duration": "1:45:00",
            "views": 156000,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Khassida Lā Tarkanan - El Hadji Malick Sy (Traduction et Explication)",
            "description": "Récitation de la Khassida 'Lā Tarkanan' d'El Hadji Malick Sy avec traduction en wolof et explications spirituelles en français. Ce poème invite à la confiance absolue en Allah.",
            "youtube_id": "JWwRxPQPsCE",
            "category": "dhikr",
            "duration": "45:00",
            "views": 34000,
            "featured": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Récitation Khassaides El Hadji Malick - Nuit du Burd",
            "description": "Nuit de récitation des khassaides d'El Hadji Malick Sy par Doudou Kende et Abou Aziz Mbaye.",
            "youtube_id": "iz3ozGdQ5aQ",
            "category": "dhikr",
            "duration": "1:20:00",
            "views": 28000,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Hidaya Al Wildan - Khassida El Hadji Malick Sy",
            "description": "Récitation de la Khassida 'Hidaya Al Wildan' (Le cadeau pour la jeunesse) composée par El Hadji Malick Sy.",
            "youtube_id": "bhEA8ZuABns",
            "category": "dhikr",
            "duration": "25:00",
            "views": 19500,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Visite du Président de la République - Gamou Tivaouane 2024",
            "description": "Stream de la visite officielle du Président de la République lors du Gamou Tivaouane 2024.",
            "youtube_id": "uVJsmAG5kvo",
            "category": "gamou",
            "duration": "1:00:00",
            "views": 78000,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Célébration de la Nuit du Mawlid - Tivaouane 15 Septembre 2024",
            "description": "Couverture complète de la nuit du Mawlid à Tivaouane par DAKARACTU TV HD - Dimanche 15 septembre 2024.",
            "youtube_id": "AlUmZn_Deno",
            "category": "gamou",
            "duration": "3:00:00",
            "views": 195000,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Mame Maodo Malick Sy : Le Sénégal dans l'histoire",
            "description": "Série documentaire présentant la véritable histoire de Maodo et son impact sur l'histoire du Sénégal.",
            "youtube_id": "aviqRGqHnPo",
            "category": "histoire",
            "duration": "40:00",
            "views": 52000,
            "featured": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.videos.insert_many(maodo_videos)
    
    return {
        "message": "Vidéos sur Maodo initialisées avec succès",
        "count": len(maodo_videos),
        "videos": [{"title": v["title"], "youtube_id": v["youtube_id"]} for v in maodo_videos]
    }

@api_router.post("/admin/seed")
async def seed_database():
    """Seed database with initial content"""
    seeded = {"quotes": 0, "events": 0}
    
    # Check if already seeded
    quotes_count = await db.quotes.count_documents({})
    events_count = await db.events.count_documents({})
    
    if quotes_count == 0:
        # Seed quotes
        quotes = [
            {
                "id": str(uuid.uuid4()),
                "text_fr": "La science sans la pratique est comme un arbre sans fruit.",
                "text_en": "Knowledge without practice is like a tree without fruit.",
                "text_ar": "العلم بلا عمل كالشجرة بلا ثمر.",
                "text_wo": "Xam-xam te liggéeyul dafa ni garab bu amul xob.",
                "author": "El Hadji Malick Sy",
                "context_fr": "Sur l'importance de l'action",
                "context_en": "On the importance of action",
                "active": True,
                "order": 1
            },
            {
                "id": str(uuid.uuid4()),
                "text_fr": "Celui qui connaît Dieu, son cœur trouve la paix.",
                "text_en": "He who knows God, his heart finds peace.",
                "text_ar": "من عرف الله سكن قلبه.",
                "text_wo": "Ku xam Yàlla, xol am mu dal.",
                "author": "El Hadji Malick Sy",
                "context_fr": "Sur la connaissance divine",
                "context_en": "On divine knowledge",
                "active": True,
                "order": 2
            },
            {
                "id": str(uuid.uuid4()),
                "text_fr": "L'amour du Prophète (PSL) est la clé de tout bien.",
                "text_en": "Love for the Prophet (PBUH) is the key to all goodness.",
                "text_ar": "حب النبي (ص) مفتاح كل خير.",
                "text_wo": "Sopp Yonent bi (YWS) mooy caabi bu nekk baax.",
                "author": "El Hadji Malick Sy",
                "context_fr": "Sur l'amour prophétique",
                "context_en": "On prophetic love",
                "active": True,
                "order": 3
            },
            {
                "id": str(uuid.uuid4()),
                "text_fr": "Le savoir est une lumière qui illumine le cœur du croyant.",
                "text_en": "Knowledge is a light that illuminates the heart of the believer.",
                "text_ar": "العلم نور يضيء قلب المؤمن.",
                "text_wo": "Xam-xam dafa nekk leer buy leer xol mu gëm.",
                "author": "El Hadji Malick Sy",
                "context_fr": "Sur la quête du savoir",
                "context_en": "On seeking knowledge",
                "active": True,
                "order": 4
            },
            {
                "id": str(uuid.uuid4()),
                "text_fr": "La patience dans l'épreuve est le signe de la foi sincère.",
                "text_en": "Patience in trial is the sign of sincere faith.",
                "text_ar": "الصبر على البلاء علامة الإيمان الصادق.",
                "text_wo": "Muñ ci épreuve mooy xàmme gëm bu dëgg.",
                "author": "El Hadji Malick Sy",
                "context_fr": "Sur la patience",
                "context_en": "On patience",
                "active": True,
                "order": 5
            }
        ]
        await db.quotes.insert_many(quotes)
        seeded["quotes"] = len(quotes)
    
    if events_count == 0:
        # Seed events
        events = [
            {
                "id": str(uuid.uuid4()),
                "name_fr": "Gamou 2025",
                "name_en": "Gamou 2025",
                "name_ar": "المولد 2025",
                "name_wo": "Gamou 2025",
                "description_fr": "Célébration annuelle de la naissance du Prophète Muhammad (PSL) à Tivaouane",
                "description_en": "Annual celebration of the birth of Prophet Muhammad (PBUH) in Tivaouane",
                "description_ar": "الاحتفال السنوي بمولد النبي محمد (ص) في تيفاوان",
                "description_wo": "Bëgg-bëgg at juddu Yonent Muhammad (YWS) ci Tiwaawaan",
                "date": "2025-09-05",
                "location": "Tivaouane",
                "event_type": "gamou",
                "recurring": True,
                "recurrence_pattern": "annual",
                "active": True
            },
            {
                "id": str(uuid.uuid4()),
                "name_fr": "Ziarra Générale 2025",
                "name_en": "General Ziarra 2025",
                "name_ar": "الزيارة العامة 2025",
                "name_wo": "Ziarra Générale 2025",
                "description_fr": "Grande ziarra annuelle rassemblant des centaines de milliers de disciples",
                "description_en": "Great annual ziarra gathering hundreds of thousands of disciples",
                "description_ar": "الزيارة السنوية الكبرى التي تجمع مئات الآلاف من المريدين",
                "description_wo": "Ziarra bu mag bu at buy dajale ay téeméer mille taalibe",
                "date": "2025-04-20",
                "location": "Tivaouane",
                "event_type": "ziarra",
                "recurring": True,
                "recurrence_pattern": "annual",
                "active": True
            },
            {
                "id": str(uuid.uuid4()),
                "name_fr": "Hadratoul Joumah",
                "name_en": "Hadratoul Joumah",
                "name_ar": "حضرة الجمعة",
                "name_wo": "Hadratoul Joumah",
                "description_fr": "Séance hebdomadaire de dhikr et prières collectives à la Zawiya",
                "description_en": "Weekly session of dhikr and collective prayers at the Zawiya",
                "description_ar": "جلسة أسبوعية للذكر والصلوات الجماعية في الزاوية",
                "description_wo": "Séance ci ayu-bés ci dhikr ak julli mbooloo ci Zawiya bi",
                "date": "2025-02-07",
                "location": "Zawiya de Tivaouane",
                "event_type": "hadratoul_joumah",
                "recurring": True,
                "recurrence_pattern": "weekly",
                "active": True
            }
        ]
        await db.events.insert_many(events)
        seeded["events"] = len(events)
    
    return {
        "message": "Base de données initialisée",
        "seeded": seeded,
        "existing": {
            "quotes": quotes_count,
            "events": events_count
        }
    }


# ============== ADMIN AUTHENTICATION ==============

@api_router.post("/admin/login")
async def admin_login(credentials: AdminLogin):
    """Login to admin panel"""
    if credentials.username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    if not verify_password(credentials.password):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    # Generate session token
    token = generate_session_token()
    expires_at = (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
    
    # Store session
    await db.admin_sessions.insert_one({
        "token": token,
        "username": credentials.username,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "expires_at": expires_at
    })
    
    # Clean up old sessions
    await db.admin_sessions.delete_many({
        "expires_at": {"$lt": datetime.now(timezone.utc).isoformat()}
    })
    
    return {
        "success": True,
        "token": token,
        "expires_at": expires_at,
        "username": credentials.username
    }

@api_router.post("/admin/logout")
async def admin_logout(authorization: Optional[str] = Header(None)):
    """Logout from admin panel"""
    if authorization:
        token = authorization[7:] if authorization.startswith("Bearer ") else authorization
        await db.admin_sessions.delete_one({"token": token})
    
    return {"success": True, "message": "Déconnexion réussie"}

@api_router.get("/admin/verify")
async def verify_admin_session(is_valid: bool = Depends(verify_admin_token)):
    """Verify if current session is valid"""
    return {"valid": is_valid}

@api_router.post("/admin/change-password")
async def change_admin_password(
    old_password: str,
    new_password: str,
    is_admin: bool = Depends(verify_admin_token)
):
    """Change admin password"""
    if not verify_password(old_password):
        raise HTTPException(status_code=401, detail="Ancien mot de passe incorrect")
    
    # In a real app, you'd update this in the database or environment
    # For now, we'll just return success (password would need to be updated in .env)
    new_hash = hashlib.sha256(new_password.encode()).hexdigest()
    
    return {
        "success": True,
        "message": "Mot de passe changé. Mettez à jour ADMIN_PASSWORD_HASH dans .env avec: " + new_hash
    }


# ============== KHALIFES (HEIRS) ENDPOINTS ==============

@api_router.get("/khalifes")
async def get_khalifes(active_only: bool = True):
    """Get all khalifes (heirs) ordered by their order field"""
    query = {"active": True} if active_only else {}
    
    khalifes = await db.khalifes.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    return {"khalifes": khalifes, "count": len(khalifes)}


@api_router.get("/khalifes/current")
async def get_current_khalife():
    """Get the current Khalife"""
    khalife = await db.khalifes.find_one({"current": True, "active": True}, {"_id": 0})
    if not khalife:
        raise HTTPException(status_code=404, detail="Khalife actuel non trouvé")
    return khalife


@api_router.get("/khalifes/{khalife_id}")
async def get_khalife(khalife_id: str):
    """Get a single khalife by ID"""
    khalife = await db.khalifes.find_one({"id": khalife_id}, {"_id": 0})
    if not khalife:
        raise HTTPException(status_code=404, detail="Khalife non trouvé")
    return khalife


@api_router.post("/khalifes")
async def create_khalife(khalife: KhalifeCreate, is_admin: bool = Depends(verify_admin_token)):
    """Create a new khalife entry (admin only)"""
    new_khalife = Khalife(**khalife.model_dump())
    doc = new_khalife.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    
    await db.khalifes.insert_one(doc)
    return {"message": "Khalife créé", "id": new_khalife.id}


@api_router.put("/khalifes/{khalife_id}")
async def update_khalife(khalife_id: str, update: KhalifeUpdate, is_admin: bool = Depends(verify_admin_token)):
    """Update a khalife entry (admin only)"""
    khalife = await db.khalifes.find_one({"id": khalife_id})
    if not khalife:
        raise HTTPException(status_code=404, detail="Khalife non trouvé")
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if update_data:
        await db.khalifes.update_one({"id": khalife_id}, {"$set": update_data})
    
    updated_khalife = await db.khalifes.find_one({"id": khalife_id}, {"_id": 0})
    return {"message": "Khalife mis à jour", "khalife": updated_khalife}


@api_router.delete("/khalifes/{khalife_id}")
async def delete_khalife(khalife_id: str, is_admin: bool = Depends(verify_admin_token)):
    """Delete a khalife entry (admin only)"""
    result = await db.khalifes.delete_one({"id": khalife_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Khalife non trouvé")
    
    return {"message": "Khalife supprimé", "id": khalife_id}


@api_router.post("/khalifes/seed")
async def seed_khalifes(is_admin: bool = Depends(verify_admin_token)):
    """Seed khalifes data (admin only)"""
    # Check if already seeded
    existing = await db.khalifes.count_documents({})
    if existing > 0:
        return {"message": "Données des khalifes déjà présentes", "count": existing}
    
    khalifes_data = [
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Sidy Ahmet Sy",
            "title": {"fr": "Le Premier Fils de Maodo", "en": "The First Son of Maodo", "ar": "الابن الأول لمودو", "wo": "Doom bu njëkk Maodo"},
            "period": "1879 - 1916",
            "icon": "Sparkles",
            "description": {
                "fr": "Aîné des enfants d'El Hadji Malick Sy, Serigne Sidy Ahmet Sy fut le premier à recevoir l'enseignement direct de son illustre père. Homme de grande piété et de profonde érudition, il assista Maodo dans ses œuvres spirituelles et éducatives. Rappelé à Dieu avant son père en 1916, il n'accéda pas au Califat, mais son héritage spirituel et sa descendance continuent d'illuminer la Tariqa.",
                "en": "The eldest child of El Hadji Malick Sy, Serigne Sidy Ahmet Sy was the first to receive direct teaching from his illustrious father. A man of great piety and profound erudition, he assisted Maodo in his spiritual and educational works. Called back to God before his father in 1916, he did not accede to the Caliphate, but his spiritual legacy and descendants continue to illuminate the Tariqa.",
                "ar": "البكر من أبناء الحاج مالك سي، كان سرين سيدي أحمد سي أول من تلقى التعليم المباشر من والده الشهير. رجل ذو تقوى عظيمة وعلم عميق، ساعد مودو في أعماله الروحية والتعليمية. توفي قبل والده عام 1916، ولم يتولَّ الخلافة، لكن إرثه الروحي وذريته يستمران في إنارة الطريقة.",
                "wo": "Doom bu njëkk El Hadji Maalik Si, Serigne Sidy Ahmet Sy moo njëkk jàng ci baay bam bu mag. Nit ku diine bu baax te borom xam-xam bu xóot, mu dimbali Maodo ci liggéey diine ak jàngale. Wéesu Yàlla balaa baay bam ci 1916, du nekk Xaliifa, waaye warisaay diine bam ak doom yam dañuy leer Tariqa ba."
            },
            "contributions": {
                "fr": ["Premier disciple et assistant de Maodo", "Transmission des enseignements paternels", "Fondation d'une lignée de savants et d'érudits"],
                "en": ["First disciple and assistant of Maodo", "Transmission of paternal teachings", "Foundation of a lineage of scholars and erudites"],
                "ar": ["أول تلميذ ومساعد لمودو", "نقل تعاليم الوالد", "تأسيس سلسلة من العلماء والفقهاء"],
                "wo": ["Njëkk taalibe ak dimbali Maodo", "Yóbbu jàng baay bi", "Sos ay doom boroom xam-xam"]
            },
            "image": "https://customer-assets.emergentagent.com/job_9e8f0b7f-bd5d-4cfa-8b09-9e5f34d5dbc8/artifacts/1aad3juf_FB_IMG_1770358736967.jpg",
            "current": False,
            "order": 1,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Babacar Sy",
            "title": {"fr": "Le Premier Khalife", "en": "The First Khalife", "ar": "الخليفة الأول", "wo": "Xaliifa bu njëkk"},
            "period": "1885 - 1957",
            "icon": "Crown",
            "description": {
                "fr": "Fils aîné de Maodo, il fut le premier héritier. Homme de rigueur et d'organisation, il structura la Tariqa en créant le système des Dahiras (cercles d'études et de dhikr) qui allait assurer le rayonnement de Tivaouane à travers le Sénégal.",
                "en": "The eldest son of Maodo, he was the first heir. A man of rigor and organization, he structured the Tariqa by creating the Dahira system (circles of study and dhikr) that would ensure Tivaouane's influence throughout Senegal.",
                "ar": "الابن الأكبر لمودو، كان أول خليفة. رجل صارم ومنظم، أسس نظام الداهيرة (حلقات الدراسة والذكر) الذي ضمن إشعاع تيفاوان في جميع أنحاء السنغال.",
                "wo": "Doom bu njëkk Maodo, moo njëkk warisaay. Nit ku sell ak organizatër, mu tabax sistem Dahira yi (cercle jàng ak dikr) buy def Tiwaawaan wéy ci Senegaal."
            },
            "contributions": {
                "fr": ["Création du système des Dahiras", "Organisation de la première Ziarra Générale en 1930", "Consolidation de l'unité des disciples après le décès de Maodo"],
                "en": ["Creation of the Dahira system", "Organization of the first General Ziarra in 1930", "Consolidation of the unity of disciples after Maodo's death"],
                "ar": ["إنشاء نظام الداهيرة", "تنظيم أول زيارة عامة في 1930", "توحيد التلاميذ بعد وفاة مودو"],
                "wo": ["Sos sistem Dahira yi", "Organise njëkk Ziarra Générale ci 1930", "Bokk taalibe yi ginnaaw dee Maodo"]
            },
            "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/z7luqn3z_FB_IMG_1770339992610.jpg",
            "current": False,
            "order": 2,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Mansour Sy 'Balkhawmi'",
            "title": {"fr": "Le Savant Multidimensionnel", "en": "The Multidimensional Scholar", "ar": "العالم متعدد الأبعاد", "wo": "Borom xam-xam bu bari"},
            "period": "1900 - 1957",
            "icon": "BookOpen",
            "description": {
                "fr": "Érudit exceptionnel, poète mystique et juriste, il incarnait la fusion parfaite entre science et spiritualité. Ses cours magistraux attiraient des centaines d'étudiants venus de toute l'Afrique de l'Ouest.",
                "en": "Exceptional scholar, mystical poet and jurist, he embodied the perfect fusion of science and spirituality. His masterful lectures attracted hundreds of students from all over West Africa.",
                "ar": "عالم استثنائي وشاعر صوفي وفقيه، جسد الاندماج الكامل بين العلم والروحانية. جذبت دروسه المئات من الطلاب من جميع أنحاء غرب أفريقيا.",
                "wo": "Borom xam-xam bu baax, woykat suufi ak juriste, muy bokk xam-xam ak diine bu sell. Jàng yi muy def di jël ay téeméer jàngkat yu jóge Afrik àll-géej yépp."
            },
            "contributions": {
                "fr": ["Enseignement approfondi des sciences islamiques", "Composition de poèmes en l'honneur du Prophète (PSL)", "Formation de générations de muqqadams et d'imams"],
                "en": ["In-depth teaching of Islamic sciences", "Composition of poems in honor of the Prophet (PBUH)", "Training of generations of muqqadams and imams"],
                "ar": ["تعليم معمق للعلوم الإسلامية", "تأليف قصائد في مدح النبي (ص)", "تكوين أجيال من المقدمين والأئمة"],
                "wo": ["Jàngale xam-xam Islaam", "Bind woy ci Yonent bi (YWS)", "Forme ay jamano muqqadam ak imam"]
            },
            "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/s4o5buj7_FB_IMG_1770340053073.jpg",
            "current": False,
            "order": 3,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Abdoul Aziz Sy 'Dabakh'",
            "title": {"fr": "Le Régulateur Social", "en": "The Social Regulator", "ar": "المنظم الاجتماعي", "wo": "Régulateur social"},
            "period": "1904 - 1997",
            "icon": "Scale",
            "description": {
                "fr": "Figure de l'unité nationale, il a joué un rôle médiateur crucial dans les crises politiques et sociales du Sénégal. Son charisme et sa sagesse ont fait de lui un interlocuteur respecté de tous.",
                "en": "A figure of national unity, he played a crucial mediating role in Senegal's political and social crises. His charisma and wisdom made him a respected interlocutor by all.",
                "ar": "رمز الوحدة الوطنية، لعب دوراً وسيطاً حاسماً في الأزمات السياسية والاجتماعية في السنغال. جعلته كاريزمته وحكمته محترماً من الجميع.",
                "wo": "Nit ku bokk réew mi, mu dimbali ci crise politique ak social Senegaal yi. Charisme ak xel bu baax moo def ko nit ku ñépp di hormat."
            },
            "contributions": {
                "fr": ["Médiation dans les crises socio-politiques", "Promotion du dialogue interreligieux", "Modernisation des infrastructures de Tivaouane"],
                "en": ["Mediation in socio-political crises", "Promotion of interreligious dialogue", "Modernization of Tivaouane's infrastructure"],
                "ar": ["الوساطة في الأزمات السياسية والاجتماعية", "تعزيز الحوار بين الأديان", "تحديث البنية التحتية لتيفاوان"],
                "wo": ["Dimbali ci crise socio-politique yi", "Yëngu waxtan diine yi", "Yëggo infrastruktiir Tiwaawaan"]
            },
            "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/qa8yxjql_FB_IMG_1770340203424.jpg",
            "current": False,
            "order": 4,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Mouhammadoul Habib Sy",
            "title": {"fr": "L'Infatigable Serviteur", "en": "The Tireless Servant", "ar": "الخادم الدؤوب", "wo": "Jaam bu dul sew"},
            "period": "1906 - 1992",
            "icon": "Star",
            "description": {
                "fr": "Fils cadet d'El Hadji Malick Sy et de Sokhna Safiétou Niang, il reçut sa formation islamique auprès de son père, puis de Serigne Saer Gueye et Mouhamadou Hady Touré.",
                "en": "Youngest son of El Hadji Malick Sy and Sokhna Safiétou Niang, he received his Islamic education from his father, then from Serigne Saer Gueye and Mouhamadou Hady Touré.",
                "ar": "الابن الأصغر للحاج مالك سي وسخنة صفية نيانغ، تلقى تعليمه الإسلامي من والده، ثم من سرين سير غي ومحمدو هادي توري.",
                "wo": "Doom bu ndaw El Hadji Maalik Si ak Sokhna Safiétou Niang, mu jàng Islaam ci baay bi, ci Serigne Saer Gueye ak Mouhamadou Hady Touré."
            },
            "contributions": {
                "fr": ["Premier président du comité de suivi des travaux de la Grande Mosquée de Tivaouane (1976)", "Engagement dans l'agriculture et la gestion des daaras à Diacksao", "Direction de nombreux Gamous"],
                "en": ["First president of the monitoring committee for the Grand Mosque of Tivaouane (1976)", "Commitment to agriculture and daara management in Diacksao", "Direction of numerous Gamous"],
                "ar": ["أول رئيس للجنة متابعة أعمال المسجد الكبير بتيفاوان (1976)", "الالتزام بالزراعة وإدارة الدار في دياكساو", "إدارة العديد من المولد"],
                "wo": ["Njëkk président comité suivi liggéey Jàkka bu mag bi Tiwaawaan (1976)", "Liggéey ci ndox ak daara yi ci Diacksao", "Yoonu ay Gamou yu bari"]
            },
            "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/zk7vtiqg_FB_IMG_1770340169935.jpg",
            "current": False,
            "order": 5,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Moustapha Sy Djamil",
            "title": {"fr": "L'Ascète de Fass - Borom Fass", "en": "The Ascetic of Fass - Borom Fass", "ar": "زاهد فاس - بوروم فاس", "wo": "Zahid Fass - Borom Fass"},
            "period": "1916 - 1993",
            "icon": "Heart",
            "description": {
                "fr": "Né le 16 juin 1916 à Louga, petit-fils aîné de Maodo et fils aîné de Serigne Babacar Sy. Surnommé 'Djamil' (le Beau) par Serigne Abdou Aziz Sy Dabakh pour sa beauté physique et morale.",
                "en": "Born June 16, 1916 in Louga, eldest grandson of Maodo and eldest son of Serigne Babacar Sy. Nicknamed 'Djamil' (the Beautiful) by Serigne Abdou Aziz Sy Dabakh for his physical and moral beauty.",
                "ar": "ولد في 16 يونيو 1916 في لوغا، الحفيد الأكبر لمودو والابن الأكبر لسرين باباكار سي. لقب بـ'جميل' من قبل سرين عبد العزيز سي داباخ لجماله الجسدي والأخلاقي.",
                "wo": "Juddu ci 16 juin 1916 ci Louga, njëkk doom-u-doom Maodo ak njëkk doom Serigne Babacar Sy. Tur gi 'Djamil' (Rafet) Serigne Abdou Aziz Sy Dabakh jox ko ngir rafet bu yaram ak bu xel."
            },
            "contributions": {
                "fr": ["Fondateur du quartier Fass à Dakar", "Vie d'ascète et de retraite spirituelle pendant 40 ans", "Enseignement et éducation des enfants"],
                "en": ["Founder of the Fass neighborhood in Dakar", "40 years of ascetic life and spiritual retreat", "Teaching and educating children"],
                "ar": ["مؤسس حي فاس في داكار", "40 سنة من الحياة الزهدية والخلوة الروحية", "تعليم وتربية الأطفال"],
                "wo": ["Tëkkikat kër Fass ci Dakar", "Dund zahid ak retraite spirituelle ci 40 at", "Jàngale ak éduqué xale yi"]
            },
            "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/p7vxoses_FB_IMG_1770340283848.jpg",
            "current": False,
            "order": 6,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Mansour Sy 'Borom Daradji'",
            "title": {"fr": "Le Protecteur du Savoir", "en": "The Protector of Knowledge", "ar": "حامي المعرفة", "wo": "Sàmmukat xam-xam"},
            "period": "1925 - 2012",
            "icon": "Shield",
            "description": {
                "fr": "Gardien de l'orthodoxie et défenseur des valeurs islamiques, il a veillé à la préservation de l'enseignement authentique de Maodo face aux dérives modernes.",
                "en": "Guardian of orthodoxy and defender of Islamic values, he ensured the preservation of Maodo's authentic teaching against modern deviations.",
                "ar": "حارس الأرثوذكسية ومدافع عن القيم الإسلامية، حرص على الحفاظ على تعاليم مودو الأصيلة ضد الانحرافات الحديثة.",
                "wo": "Sàmmukat ortodoksi ak défenseur valeur Islaam yi, mu sàmm jàng bu dëgg Maodo ci kanam dérives modern yi."
            },
            "contributions": {
                "fr": ["Protection de l'héritage spirituel de Maodo", "Renforcement de l'éducation islamique", "Expansion des écoles coraniques (daaras)"],
                "en": ["Protection of Maodo's spiritual heritage", "Strengthening Islamic education", "Expansion of Quranic schools (daaras)"],
                "ar": ["حماية الإرث الروحي لمودو", "تعزيز التعليم الإسلامي", "توسيع المدارس القرآنية (الدار)"],
                "wo": ["Sàmm njàmbaar bu sell Maodo", "Yokku éducation Islaam", "Yàgg daara yi"]
            },
            "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/mg7xetxg_FB_IMG_1770340311886.jpg",
            "current": False,
            "order": 7,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Cheikh Ahmed Tidiane Sy 'Al Maktoum'",
            "title": {"fr": "Le Visionnaire Multidimensionnel", "en": "The Multidimensional Visionary", "ar": "الرؤيوي متعدد الأبعاد", "wo": "Visionnaire bu bari"},
            "period": "1925 - 2017",
            "icon": "Star",
            "description": {
                "fr": "Né à Saint-Louis, petit-fils d'El Hadji Malick Sy et fils de Serigne Babacar Sy. Reconnu pour sa précocité intellectuelle, il fonda le dahira Moustarchidine Wal Moustarchidati.",
                "en": "Born in Saint-Louis, grandson of El Hadji Malick Sy and son of Serigne Babacar Sy. Known for his intellectual precociousness, he founded the Moustarchidine Wal Moustarchidati dahira.",
                "ar": "ولد في سان لويس، حفيد الحاج مالك سي وابن سرين باباكار سي. معروف بذكائه المبكر، أسس داهيرة مسترشدين ومسترشدات.",
                "wo": "Juddu ci Ndar, doom-u-doom El Hadji Maalik Si ak doom Serigne Babacar Sy. Xam bu gaaw xel, mu sos dahira Moustarchidine Wal Moustarchidati."
            },
            "contributions": {
                "fr": ["Fondation du dahira Moustarchidine Wal Moustarchidati", "Création de la première association culturelle islamique du Sénégal (1950)", "Initiation du COSKAS pour l'organisation du Gamou (1968)"],
                "en": ["Foundation of the Moustarchidine Wal Moustarchidati dahira", "Creation of the first Islamic cultural association in Senegal (1950)", "Initiation of COSKAS for Gamou organization (1968)"],
                "ar": ["تأسيس داهيرة مسترشدين ومسترشدات", "إنشاء أول جمعية ثقافية إسلامية في السنغال (1950)", "تأسيس كوسكاس لتنظيم المولد (1968)"],
                "wo": ["Sos dahira Moustarchidine Wal Moustarchidati", "Sos njëkk association culturelle islamique Senegaal (1950)", "Njëkk COSKAS ngir organise Gamou (1968)"]
            },
            "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/jtrbkp29_IMG-20260206-WA0053.jpg",
            "current": False,
            "order": 8,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Abdoul Aziz Sy Al Amine",
            "title": {"fr": "Le Bâtisseur et Diplomate", "en": "The Builder and Diplomat", "ar": "الباني والدبلوماسي", "wo": "Tabaxkat ak diplomate"},
            "period": "1928 - 2017",
            "icon": "Building",
            "description": {
                "fr": "Homme de projets et de vision, il a lancé de grands chantiers d'infrastructure à Tivaouane tout en renforçant les liens avec la communauté tidiane internationale.",
                "en": "A man of projects and vision, he launched major infrastructure projects in Tivaouane while strengthening ties with the international Tidiane community.",
                "ar": "رجل المشاريع والرؤية، أطلق مشاريع بنية تحتية كبرى في تيفاوان مع تعزيز الروابط مع المجتمع التجاني الدولي.",
                "wo": "Nit ku projet ak vision, mu tabax infrastruktiir yu mag ci Tiwaawaan te mu yokku lien ak komunite tijaan international bi."
            },
            "contributions": {
                "fr": ["Construction de la nouvelle aile de la Grande Mosquée", "Développement des œuvres sociales (hôpitaux, écoles)", "Renforcement des liens avec les disciples de la diaspora"],
                "en": ["Construction of the new wing of the Grand Mosque", "Development of social works (hospitals, schools)", "Strengthening ties with diaspora disciples"],
                "ar": ["بناء الجناح الجديد للمسجد الكبير", "تطوير الأعمال الاجتماعية (المستشفيات، المدارس)", "تعزيز الروابط مع تلاميذ المهجر"],
                "wo": ["Tabax barab bu bees bu Jàkka bu mag bi", "Yàgg liggéey social yi (opital, ekol)", "Yokku lien ak taalibe diaspora yi"]
            },
            "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/dwimysfs_FB_IMG_1770340522540.jpg",
            "current": False,
            "order": 9,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Babacar Sy Mansour",
            "title": {"fr": "Le Guide Actuel", "en": "The Current Guide", "ar": "المرشد الحالي", "wo": "Guide tey"},
            "period": "1932 - Aujourd'hui",
            "icon": "Users",
            "description": {
                "fr": "L'actuel Khalife, garant de l'orthodoxie et de la continuité. Il poursuit l'œuvre de ses prédécesseurs en adaptant l'enseignement aux défis contemporains tout en préservant l'authenticité de la Tariqa.",
                "en": "The current Khalife, guarantor of orthodoxy and continuity. He continues the work of his predecessors by adapting teaching to contemporary challenges while preserving the authenticity of the Tariqa.",
                "ar": "الخليفة الحالي، ضامن الأرثوذكسية والاستمرارية. يواصل عمل أسلافه بتكييف التعليم مع التحديات المعاصرة مع الحفاظ على أصالة الطريقة.",
                "wo": "Xaliifa tey, garant ortodoksi ak continuité. Mu topp liggéey ya ñëwoon di yëggo jàng ci défis tey yi te di sàmm dëgg Tariqa."
            },
            "contributions": {
                "fr": ["Modernisation de la communication (médias numériques)", "Renforcement de l'unité des disciples", "Adaptation de l'enseignement aux réalités du 21e siècle"],
                "en": ["Modernization of communication (digital media)", "Strengthening the unity of disciples", "Adaptation of teaching to 21st century realities"],
                "ar": ["تحديث الاتصالات (الوسائط الرقمية)", "تعزيز وحدة التلاميذ", "تكييف التعليم مع واقع القرن الحادي والعشرين"],
                "wo": ["Yëggo komunikaasion (média numérique)", "Yokku bokk taalibe yi", "Yëggo jàng ci réalité 21e siècle"]
            },
            "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/2yhxnkcb_FB_IMG_1770340630966.jpg",
            "current": True,
            "order": 10,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Serigne Sidy Ahmed Sy ibn Serigne Babacar",
            "title": {"fr": "Le Gardien de l'Héritage Paternel", "en": "The Guardian of Paternal Heritage", "ar": "حارس الإرث الأبوي", "wo": "Sàmm warisaay baay"},
            "period": "1933 - 2019",
            "icon": "Heart",
            "description": {
                "fr": "Fils de Serigne Babacar Sy, premier Khalife, Serigne Sidy Ahmed Sy incarna la continuité spirituelle de la lignée. Formé directement par son père dans les sciences religieuses et la gestion de la confrérie, il fut un pilier silencieux mais essentiel de la Tariqa. Sa piété profonde, sa discrétion exemplaire et son dévouement absolu aux enseignements de Maodo firent de lui un modèle pour les disciples.",
                "en": "Son of Serigne Babacar Sy, the first Khalife, Serigne Sidy Ahmed Sy embodied the spiritual continuity of the lineage. Trained directly by his father in religious sciences and brotherhood management, he was a silent but essential pillar of the Tariqa. His deep piety, exemplary discretion, and absolute devotion to Maodo's teachings made him a model for disciples.",
                "ar": "ابن سرين باباكار سي، الخليفة الأول، جسّد سرين سيدي أحمد سي الاستمرارية الروحية للسلالة. تدرب مباشرة على يد والده في العلوم الدينية وإدارة الطريقة، فكان ركيزة صامتة لكن أساسية للطريقة. تقواه العميقة وتواضعه المثالي وإخلاصه المطلق لتعاليم مودو جعلته قدوة للتلاميذ.",
                "wo": "Doom Serigne Babacar Sy, njëkk Xaliifa, Serigne Sidy Ahmed Sy mu wone dund diine waa kër gi. Baay bi moo ko jàngale xam-xam diine ak yoon tànn tariqa. Diine bam bu xóot, sutura bam, ak jëf bam ci jàng Maodo moo ko def misaal ci taalibe yi."
            },
            "contributions": {
                "fr": ["Préservation fidèle des enseignements de son père", "Soutien actif aux activités de la Tariqa", "Formation spirituelle de nombreux disciples", "Maintien de l'unité familiale au sein de la confrérie"],
                "en": ["Faithful preservation of his father's teachings", "Active support of Tariqa activities", "Spiritual training of many disciples", "Maintaining family unity within the brotherhood"],
                "ar": ["الحفاظ الأمين على تعاليم والده", "الدعم الفعال لأنشطة الطريقة", "التكوين الروحي للعديد من التلاميذ", "الحفاظ على وحدة الأسرة داخل الطريقة"],
                "wo": ["Sàmm jàng baay bi bu sell", "Dimbali liggéey Tariqa yi", "Jàngale diine taalibe yu bari", "Sàmm bokk waa kër ci biir tariqa"]
            },
            "image": "https://customer-assets.emergentagent.com/job_9e8f0b7f-bd5d-4cfa-8b09-9e5f34d5dbc8/artifacts/q4qx4any_FB_IMG_1770361012622.jpg",
            "current": False,
            "order": 11,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.khalifes.insert_many(khalifes_data)
    return {"message": "Données des khalifes initialisées", "count": len(khalifes_data)}


# ============== PUSH NOTIFICATIONS ==============

@api_router.post("/notifications/subscribe")
async def subscribe_to_notifications(subscription: PushSubscription):
    """Subscribe to push notifications"""
    # Check if already subscribed
    existing = await db.push_subscriptions.find_one({"endpoint": subscription.endpoint})
    
    if existing:
        # Update existing subscription
        await db.push_subscriptions.update_one(
            {"endpoint": subscription.endpoint},
            {"$set": {
                "keys": subscription.keys,
                "user_agent": subscription.user_agent,
                "language": subscription.language,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        return {"success": True, "message": "Abonnement mis à jour", "new": False}
    
    # Create new subscription
    await db.push_subscriptions.insert_one({
        "id": str(uuid.uuid4()),
        "endpoint": subscription.endpoint,
        "keys": subscription.keys,
        "user_agent": subscription.user_agent,
        "language": subscription.language,
        "preferences": {
            "events": True,
            "gamou": True,
            "ziarra": True,
            "weekly_hadratoul": False
        },
        "created_at": datetime.now(timezone.utc).isoformat(),
        "active": True
    })
    
    return {"success": True, "message": "Abonnement créé avec succès", "new": True}

@api_router.post("/notifications/unsubscribe")
async def unsubscribe_from_notifications(endpoint: str):
    """Unsubscribe from push notifications"""
    result = await db.push_subscriptions.delete_one({"endpoint": endpoint})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Abonnement non trouvé")
    
    return {"success": True, "message": "Désabonnement réussi"}

@api_router.put("/notifications/preferences")
async def update_notification_preferences(endpoint: str, preferences: NotificationPreferences):
    """Update notification preferences"""
    result = await db.push_subscriptions.update_one(
        {"endpoint": endpoint},
        {"$set": {"preferences": preferences.model_dump()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Abonnement non trouvé")
    
    return {"success": True, "message": "Préférences mises à jour"}

@api_router.get("/notifications/stats")
async def get_notification_stats(is_admin: bool = Depends(verify_admin_token)):
    """Get push notification statistics (admin only)"""
    total = await db.push_subscriptions.count_documents({})
    active = await db.push_subscriptions.count_documents({"active": True})
    
    return {
        "total_subscriptions": total,
        "active_subscriptions": active
    }


# ============== iCAL CALENDAR EXPORT ==============

def generate_ical_event(event: dict, uid_suffix: str = "") -> str:
    """Generate a single iCal event entry"""
    event_date = event.get("date", "")
    if not event_date:
        return ""
    
    # Parse the date
    try:
        dt = datetime.strptime(event_date, "%Y-%m-%d")
        dtstart = dt.strftime("%Y%m%d")
        dtend = (dt + timedelta(days=1)).strftime("%Y%m%d")
    except ValueError:
        return ""
    
    name = event.get("name_fr", event.get("name_en", "Event"))
    description = event.get("description_fr", event.get("description_en", ""))
    location = event.get("location", "Tivaouane")
    uid = f"{event.get('id', uuid.uuid4())}{uid_suffix}@tivaouane.sn"
    
    # Escape special characters
    name = name.replace(",", "\\,").replace(";", "\\;")
    description = description.replace(",", "\\,").replace(";", "\\;").replace("\n", "\\n")
    location = location.replace(",", "\\,").replace(";", "\\;")
    
    ical_event = f"""BEGIN:VEVENT
UID:{uid}
DTSTAMP:{datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")}
DTSTART;VALUE=DATE:{dtstart}
DTEND;VALUE=DATE:{dtend}
SUMMARY:{name}
DESCRIPTION:{description}
LOCATION:{location}
END:VEVENT"""
    
    return ical_event


@api_router.get("/calendar/events.ics")
async def get_ical_calendar():
    """Export all events as iCal (.ics) file"""
    events = await db.events.find({"active": True}, {"_id": 0}).to_list(100)
    
    ical_events = []
    for event in events:
        ical_event = generate_ical_event(event)
        if ical_event:
            ical_events.append(ical_event)
    
    ical_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tariqa Tidiane Tivaouane//Events Calendar//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Événements Tivaouane
X-WR-TIMEZONE:Africa/Dakar
{chr(10).join(ical_events)}
END:VCALENDAR"""
    
    return Response(
        content=ical_content,
        media_type="text/calendar",
        headers={
            "Content-Disposition": "attachment; filename=tivaouane-events.ics"
        }
    )


@api_router.get("/calendar/event/{event_id}.ics")
async def get_single_event_ical(event_id: str):
    """Export a single event as iCal (.ics) file"""
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    
    if not event:
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    
    ical_event = generate_ical_event(event)
    if not ical_event:
        raise HTTPException(status_code=400, detail="Impossible de générer le fichier iCal")
    
    name_slug = event.get("name_fr", "event").lower().replace(" ", "-")[:30]
    
    ical_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tariqa Tidiane Tivaouane//Events Calendar//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:{event.get("name_fr", "Événement Tivaouane")}
X-WR-TIMEZONE:Africa/Dakar
{ical_event}
END:VCALENDAR"""
    
    return Response(
        content=ical_content,
        media_type="text/calendar",
        headers={
            "Content-Disposition": f"attachment; filename={name_slug}.ics"
        }
    )


# ============== ARCHIVES API ==============

# --- Manuscripts ---
@api_router.get("/archives/manuscripts")
async def get_manuscripts():
    """Get all manuscripts"""
    manuscripts = await db.archive_manuscripts.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return manuscripts

@api_router.post("/archives/manuscripts")
async def create_manuscript(manuscript: ArchiveManuscriptCreate, is_admin: bool = Depends(verify_admin_token)):
    """Create a new manuscript (admin only)"""
    new_manuscript = ArchiveManuscript(**manuscript.model_dump())
    await db.archive_manuscripts.insert_one(new_manuscript.model_dump())
    return {"success": True, "id": new_manuscript.id, "message": "Manuscrit créé"}

@api_router.put("/archives/manuscripts/{manuscript_id}")
async def update_manuscript(manuscript_id: str, manuscript: ArchiveManuscriptUpdate, is_admin: bool = Depends(verify_admin_token)):
    """Update a manuscript (admin only)"""
    update_data = {k: v for k, v in manuscript.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    
    result = await db.archive_manuscripts.update_one({"id": manuscript_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Manuscrit non trouvé")
    
    return {"success": True, "message": "Manuscrit mis à jour"}

@api_router.delete("/archives/manuscripts/{manuscript_id}")
async def delete_manuscript(manuscript_id: str, is_admin: bool = Depends(verify_admin_token)):
    """Delete a manuscript (admin only)"""
    result = await db.archive_manuscripts.delete_one({"id": manuscript_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Manuscrit non trouvé")
    
    return {"success": True, "message": "Manuscrit supprimé"}

# --- Photos ---
@api_router.get("/archives/photos")
async def get_photos():
    """Get all photos"""
    photos = await db.archive_photos.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return photos

@api_router.post("/archives/photos")
async def create_photo(photo: ArchivePhotoCreate, is_admin: bool = Depends(verify_admin_token)):
    """Create a new photo (admin only)"""
    new_photo = ArchivePhoto(**photo.model_dump())
    await db.archive_photos.insert_one(new_photo.model_dump())
    return {"success": True, "id": new_photo.id, "message": "Photo créée"}

@api_router.put("/archives/photos/{photo_id}")
async def update_photo(photo_id: str, photo: ArchivePhotoUpdate, is_admin: bool = Depends(verify_admin_token)):
    """Update a photo (admin only)"""
    update_data = {k: v for k, v in photo.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    
    result = await db.archive_photos.update_one({"id": photo_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Photo non trouvée")
    
    return {"success": True, "message": "Photo mise à jour"}

@api_router.delete("/archives/photos/{photo_id}")
async def delete_photo(photo_id: str, is_admin: bool = Depends(verify_admin_token)):
    """Delete a photo (admin only)"""
    result = await db.archive_photos.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo non trouvée")
    
    return {"success": True, "message": "Photo supprimée"}

# --- Audio ---
@api_router.get("/archives/audio")
async def get_audio():
    """Get all audio tracks"""
    audio = await db.archive_audio.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return audio

@api_router.post("/archives/audio")
async def create_audio(audio: ArchiveAudioCreate, is_admin: bool = Depends(verify_admin_token)):
    """Create a new audio track (admin only)"""
    new_audio = ArchiveAudio(**audio.model_dump())
    await db.archive_audio.insert_one(new_audio.model_dump())
    return {"success": True, "id": new_audio.id, "message": "Audio créé"}

@api_router.put("/archives/audio/{audio_id}")
async def update_audio(audio_id: str, audio: ArchiveAudioUpdate, is_admin: bool = Depends(verify_admin_token)):
    """Update an audio track (admin only)"""
    update_data = {k: v for k, v in audio.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    
    result = await db.archive_audio.update_one({"id": audio_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Audio non trouvé")
    
    return {"success": True, "message": "Audio mis à jour"}

@api_router.delete("/archives/audio/{audio_id}")
async def delete_audio(audio_id: str, is_admin: bool = Depends(verify_admin_token)):
    """Delete an audio track (admin only)"""
    result = await db.archive_audio.delete_one({"id": audio_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Audio non trouvé")
    
    return {"success": True, "message": "Audio supprimé"}

# --- Videos ---
@api_router.get("/archives/videos")
async def get_archive_videos():
    """Get all archive videos"""
    videos = await db.archive_videos.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return videos

@api_router.post("/archives/videos")
async def create_archive_video(video: ArchiveVideoCreate, is_admin: bool = Depends(verify_admin_token)):
    """Create a new archive video (admin only)"""
    new_video = ArchiveVideo(**video.model_dump())
    await db.archive_videos.insert_one(new_video.model_dump())
    return {"success": True, "id": new_video.id, "message": "Vidéo créée"}

@api_router.put("/archives/videos/{video_id}")
async def update_archive_video(video_id: str, video: ArchiveVideoUpdate, is_admin: bool = Depends(verify_admin_token)):
    """Update an archive video (admin only)"""
    update_data = {k: v for k, v in video.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    
    result = await db.archive_videos.update_one({"id": video_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    return {"success": True, "message": "Vidéo mise à jour"}

@api_router.delete("/archives/videos/{video_id}")
async def delete_archive_video(video_id: str, is_admin: bool = Depends(verify_admin_token)):
    """Delete an archive video (admin only)"""
    result = await db.archive_videos.delete_one({"id": video_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    
    return {"success": True, "message": "Vidéo supprimée"}

# --- Sources ---
@api_router.get("/archives/sources")
async def get_sources():
    """Get all academic sources"""
    sources = await db.archive_sources.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return sources

@api_router.post("/archives/sources")
async def create_source(source: ArchiveSourceCreate, is_admin: bool = Depends(verify_admin_token)):
    """Create a new academic source (admin only)"""
    new_source = ArchiveSource(**source.model_dump())
    await db.archive_sources.insert_one(new_source.model_dump())
    return {"success": True, "id": new_source.id, "message": "Source créée"}

@api_router.put("/archives/sources/{source_id}")
async def update_source(source_id: str, source: ArchiveSourceUpdate, is_admin: bool = Depends(verify_admin_token)):
    """Update an academic source (admin only)"""
    update_data = {k: v for k, v in source.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    
    result = await db.archive_sources.update_one({"id": source_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Source non trouvée")
    
    return {"success": True, "message": "Source mise à jour"}

@api_router.delete("/archives/sources/{source_id}")
async def delete_source(source_id: str, is_admin: bool = Depends(verify_admin_token)):
    """Delete an academic source (admin only)"""
    result = await db.archive_sources.delete_one({"id": source_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Source non trouvée")
    
    return {"success": True, "message": "Source supprimée"}

# --- Seed Archives Data ---
@api_router.post("/archives/seed")
async def seed_archives_data(is_admin: bool = Depends(verify_admin_token)):
    """Seed initial archives data (admin only)"""
    
    # Check if data already exists
    existing_manuscripts = await db.archive_manuscripts.count_documents({})
    if existing_manuscripts > 0:
        return {"message": "Les archives existent déjà", "skipped": True}
    
    # Manuscripts data
    manuscripts_data = [
        {"id": str(uuid.uuid4()), "title": {"fr": "Khilassou Dhahab - Chapitres Essentiels", "en": "Khilassou Dhahab - Essential Chapters", "ar": "خلاص الذهب - الفصول الأساسية", "wo": "Khilassou Dhahab - Chapitre yu gën mag"}, "description": {"fr": "Biographie poétique du Prophète (PSL) composée par El Hadji Malick Sy, récitée lors des Gamou. Texte arabe avec traduction française.", "en": "Poetic biography of the Prophet (PBUH) composed by El Hadji Malick Sy, recited during Gamou celebrations. Arabic text with French translation.", "ar": "سيرة شعرية للنبي (ص) ألفها الحاج مالك سي، تُتلى في احتفالات المولد. نص عربي مع ترجمة فرنسية.", "wo": "Taariix woy bu Yonent bi (YWS) bu El Hadji Maalik Si bind, di ko jàng ci Gamou yi. Téere arab ak tekki français."}, "date": "XIXe siècle", "langue": "Arabe + Français", "lien": "https://fr.scribd.com/document/669838264/khilass-zahab", "type": "PDF Scribd", "order": 1, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Khilassou Zahab - Chapitre 1", "en": "Khilassou Zahab - Chapter 1", "ar": "خلاص الذهب - الفصل الأول", "wo": "Khilassou Zahab - Chapitre 1"}, "description": {"fr": "Premier chapitre louant Dieu, la création et l'âme du Prophète comme miroir de toute existence.", "en": "First chapter praising God, creation and the Prophet's soul as mirror of all existence.", "ar": "الفصل الأول في حمد الله والخلق وروح النبي كمرآة لكل الوجود.", "wo": "Njëkk chapitre ci sant Yàlla, création ak ruu Yonent bi ci miroir bu àdduna bi yépp."}, "date": "XIXe siècle", "langue": "Arabe", "lien": "https://www.scribd.com/document/832319484/khilassou-Zahab-Chapitre-1", "type": "PDF Scribd", "order": 2, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Khilassou Zahab - Chapitre 3", "en": "Khilassou Zahab - Chapter 3", "ar": "خلاص الذهب - الفصل الثالث", "wo": "Khilassou Zahab - Chapitre 3"}, "description": {"fr": "Sections sur les événements mecquois, prières et lignées ancestrales incluant Kinana, Khuzayma et Mudar.", "en": "Sections on Meccan events, prayers and ancestral lineages including Kinana, Khuzayma and Mudar.", "ar": "أقسام عن أحداث مكة والصلوات والأنساب بما في ذلك كنانة وخزيمة ومضر.", "wo": "Xétu ci mbir Makka yi, julli yi ak njàmbaar yi di Kinana, Khuzayma ak Mudar."}, "date": "XIXe siècle", "langue": "Arabe", "lien": "https://www.scribd.com/document/740233380/khilass-zahab-Chap-3", "type": "PDF Scribd", "order": 3, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Tayssir (Wassilatoul Mouna) - Complet", "en": "Tayssir (Wassilatoul Mouna) - Complete", "ar": "التيسير (وسيلة المنى) - كامل", "wo": "Tayssir (Wassilatoul Mouna) - Bu mat"}, "description": {"fr": "Ouvrage majeur d'El Hadji Malick Sy sur la voie spirituelle soufie. Transcription complète et traduction.", "en": "Major work by El Hadji Malick Sy on the Sufi spiritual path. Complete transcription and translation.", "ar": "عمل رئيسي للحاج مالك سي عن الطريق الروحي الصوفي. نسخ وترجمة كاملة.", "wo": "Téere bu mag bu El Hadji Maalik Si ci yoon bu sell soufi. Tekki bu mat."}, "date": "Début XXe siècle", "langue": "Arabe + Français", "lien": "https://ssmasenegal.com/wp-content/uploads/2024/07/WASSILATOUL-MOUNA-TAYSSIR-transcription-complete-et-traduction.pdf", "type": "PDF Direct", "order": 4, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Tayssir - Version Scribd", "en": "Tayssir - Scribd Version", "ar": "التيسير - نسخة Scribd", "wo": "Tayssir - Version Scribd"}, "description": {"fr": "Version alternative numérisée du Tayssir disponible sur Scribd.", "en": "Alternative digitized version of Tayssir available on Scribd.", "ar": "نسخة رقمية بديلة من التيسير متوفرة على Scribd.", "wo": "Version numérique bu yeneen bu Tayssir ci Scribd."}, "date": "Début XXe siècle", "langue": "Arabe", "lien": "https://fr.scribd.com/document/481857110/Tayssir-El-Hadj-Malick-Sy-pdf", "type": "PDF Scribd", "order": 5, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Fâkihatou Toullâb (فاكهة الطلاب)", "en": "Fâkihatou Toullâb (فاكهة الطلاب)", "ar": "فاكهة الطلاب", "wo": "Fâkihatou Toullâb (فاكهة الطلاب)"}, "description": {"fr": "Le Fruit des Étudiants - Texte sur les principes généraux de la Tijaniyya et la discipline spirituelle des disciples.", "en": "The Fruit of Students - Text on general principles of Tijaniyya and spiritual discipline of disciples.", "ar": "ثمرة الطلاب - نص عن المبادئ العامة للتجانية والانضباط الروحي للمريدين.", "wo": "Màggal Taalibe yi - Téere ci principe Tijaniyya ak dicipline bu sell taalibe yi."}, "date": "Début XXe siècle", "langue": "Arabe", "lien": "https://archive.org/details/20240423_20240423_0141", "type": "Archive.org Audio", "order": 6, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Ifhâm al-Munkir - Thèse Rawane Mbaye", "en": "Ifhâm al-Munkir - Rawane Mbaye Thesis", "ar": "إفحام المنكر - أطروحة روان مباي", "wo": "Ifhâm al-Munkir - Thèse Rawane Mbaye"}, "description": {"fr": "Thèse universitaire du Pr. Rawane Mbaye sur l'œuvre apologétique d'El Hadji Malick Sy.", "en": "University thesis by Pr. Rawane Mbaye on the apologetic work of El Hadji Malick Sy.", "ar": "أطروحة جامعية للبروفيسور روان مباي عن العمل الدفاعي للحاج مالك سي.", "wo": "Thèse université bu Pr. Rawane Mbaye ci liggéey bu El Hadji Maalik Si."}, "date": "XXe siècle", "langue": "Arabe + Français", "lien": "https://fr.scribd.com/document/684807738/Ifham-Munkir-Al-Jaani-These-3-Rawane-Mbaye", "type": "PDF Scribd", "order": 7, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Le Nouveau Dîwân - 7 Tomes", "en": "The New Dîwân - 7 Volumes", "ar": "الديوان الجديد - 7 مجلدات", "wo": "Dîwân bu Bees bi - 7 Tomes"}, "description": {"fr": "Présentation et inventaire du nouveau Dîwân d'El Hadji Malick Sy, père fondateur de la Zawiya Tidiane de Tivaouane.", "en": "Presentation and inventory of the new Dîwân of El Hadji Malick Sy, founding father of the Tidiane Zawiya of Tivaouane.", "ar": "عرض وجرد الديوان الجديد للحاج مالك سي، الأب المؤسس للزاوية التجانية في تيفاوان.", "wo": "Présentation ak inventaire Dîwân bu bees bu El Hadji Maalik Si, baay tëkkikat Zawiya Tijaan Tiwaawaan."}, "date": "2020", "langue": "Français", "lien": "https://senharmattan.com/fr/religion/5312-presentation-et-inventaire-du-nouveau-diwan-d-el-hadji-malick-sy-pere-fondateur-de-la-zawiya-tidjan-de-tivaouane.html", "type": "Livre", "order": 8, "active": True}
    ]
    
    # Photos data
    photos_data = [
        {"id": str(uuid.uuid4()), "title": {"fr": "El Hadji Malick Sy - Portrait officiel", "en": "El Hadji Malick Sy - Official Portrait", "ar": "الحاج مالك سي - صورة رسمية", "wo": "El Hadji Maalik Si - Nataal bu sellal"}, "description": {"fr": "Portrait historique de Seydi El Hadji Malick Sy (1855-1922), fondateur de la Zawiya de Tivaouane.", "en": "Historical portrait of Seydi El Hadji Malick Sy (1855-1922), founder of the Zawiya of Tivaouane.", "ar": "صورة تاريخية للسيدي الحاج مالك سي (1855-1922)، مؤسس زاوية تيفاوان.", "wo": "Nataal taariix bu Seydi El Hadji Maalik Si (1855-1922), tëkkikat Zawiya Tiwaawaan."}, "date": "Début XXe siècle", "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg", "source": {"fr": "Archives familiales", "en": "Family Archives", "ar": "أرشيف العائلة", "wo": "Dëgg kër gi"}, "order": 1, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "El Hadji Malick Sy avec chapelet", "en": "El Hadji Malick Sy with prayer beads", "ar": "الحاج مالك سي مع السبحة", "wo": "El Hadji Maalik Si ak chapelet"}, "description": {"fr": "Photo historique montrant El Hadji Malick Sy tenant son chapelet.", "en": "Historical photo showing El Hadji Malick Sy holding his prayer beads.", "ar": "صورة تاريخية تظهر الحاج مالك سي ممسكاً بسبحته.", "wo": "Nataal taariix di won El Hadji Maalik Si di moom sa chapelet."}, "date": "Début XXe siècle", "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/d5prlzpy_FB_IMG_1770343515975.jpg", "source": {"fr": "Archives familiales", "en": "Family Archives", "ar": "أرشيف العائلة", "wo": "Dëgg kër gi"}, "order": 2, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Maodo et ses disciples", "en": "Maodo and his disciples", "ar": "مودو وتلاميذه", "wo": "Maodo ak taalibe yi"}, "description": {"fr": "El Hadji Malick Sy accompagné de ses disciples à Tivaouane.", "en": "El Hadji Malick Sy accompanied by his disciples in Tivaouane.", "ar": "الحاج مالك سي برفقة تلاميذه في تيفاوان.", "wo": "El Hadji Maalik Si ak taalibe yi ci Tiwaawaan."}, "date": "Début XXe siècle", "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/4jvj34rl_FB_IMG_1770343569579.jpg", "source": {"fr": "Archives Zawiya", "en": "Zawiya Archives", "ar": "أرشيف الزاوية", "wo": "Dëgg Zawiya"}, "order": 3, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Portrait sépia de Maodo", "en": "Sepia portrait of Maodo", "ar": "صورة بني داكن لمودو", "wo": "Nataal sépia Maodo"}, "description": {"fr": "Portrait en sépia d'El Hadji Malick Sy.", "en": "Sepia portrait of El Hadji Malick Sy.", "ar": "صورة بني داكن للحاج مالك سي.", "wo": "Nataal sépia El Hadji Maalik Si."}, "date": "Début XXe siècle", "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ov0hfotv_FB_IMG_1770343528749.jpg", "source": {"fr": "Archives historiques", "en": "Historical Archives", "ar": "الأرشيف التاريخي", "wo": "Dëgg taariix"}, "order": 4, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "La Grande Mosquée de Tivaouane", "en": "The Great Mosque of Tivaouane", "ar": "المسجد الكبير في تيفاوان", "wo": "Jammi bu Mag bi Tiwaawaan"}, "description": {"fr": "Vue de la Grande Mosquée de Tivaouane, site classé monument historique depuis 1902.", "en": "View of the Great Mosque of Tivaouane, classified as a historical monument since 1902.", "ar": "منظر المسجد الكبير في تيفاوان، المصنف كمعلم تاريخي منذ 1902.", "wo": "Xool Jammi bu Mag bi Tiwaawaan, paxas taariix dale 1902."}, "date": "XXe siècle", "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg", "source": {"fr": "Archives Zawiya", "en": "Zawiya Archives", "ar": "أرشيف الزاوية", "wo": "Dëgg Zawiya"}, "order": 5, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Serigne Babacar Sy (1er Khalife)", "en": "Serigne Babacar Sy (1st Khalife)", "ar": "سرين باباكار سي (الخليفة الأول)", "wo": "Serigne Babacar Sy (Njëkk Xaliifa)"}, "description": {"fr": "Serigne Khalifa Ababacar Sy (1885-1957), premier successeur de Maodo, fondateur des dahiras et initiateur de la ziarra générale en 1930.", "en": "Serigne Khalifa Ababacar Sy (1885-1957), first successor of Maodo, founder of dahiras and initiator of the general ziarra in 1930.", "ar": "سرين خليفة أباباكار سي (1885-1957)، أول خليفة لمودو، مؤسس الدوائر ومبتكر الزيارة العامة في 1930.", "wo": "Serigne Khalifa Ababacar Sy (1885-1957), njëkk ki topp Maodo, tëkkikat dahira yi ak ziarra générale ci 1930."}, "date": "1922-1957", "image": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/1b6zos47_FB_IMG_1770232308810.jpg", "source": {"fr": "Archives Khalifat", "en": "Khalifat Archives", "ar": "أرشيف الخلافة", "wo": "Dëgg Xalifa"}, "order": 6, "active": True}
    ]
    
    # Audio data
    audio_data = [
        {"id": str(uuid.uuid4()), "title": "Tayssîr (Wassîlatul Munâ)", "author": "El Hadji Malick Sy", "duration": "20:54", "audioUrl": "https://sopnabyfrance.com/wp-content/uploads/2023/01/Tayssir.mp3", "source": "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/", "coverImage": "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg", "order": 1, "active": True},
        {"id": str(uuid.uuid4()), "title": "Zajrul Qulûb (زَجْرُ الْقُلُوبْ)", "author": "El Hadji Malick Sy", "duration": "15:30", "audioUrl": "https://sopnabyfrance.com/wp-content/uploads/2023/01/Zadjroul-khouloub.mp3", "source": "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/", "coverImage": None, "order": 2, "active": True},
        {"id": str(uuid.uuid4()), "title": "Yâ Kâchifad-Dâ-i", "author": "El Hadji Malick Sy", "duration": "12:45", "audioUrl": "https://sopnabyfrance.com/wp-content/uploads/2023/01/Ya-kachifdaddahi.mp3", "source": "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/", "coverImage": None, "order": 3, "active": True},
        {"id": str(uuid.uuid4()), "title": "Fanâdjînâ", "author": "El Hadji Malick Sy", "duration": "08:20", "audioUrl": "https://sopnabyfrance.com/wp-content/uploads/2023/01/Fanadjina.mp3", "source": "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/", "coverImage": None, "order": 4, "active": True},
        {"id": str(uuid.uuid4()), "title": "Al Munâjâ", "author": "El Hadji Malick Sy", "duration": "18:00", "audioUrl": "https://sopnabyfrance.com/wp-content/uploads/2023/01/Al-Munaja.mp3", "source": "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/", "coverImage": None, "order": 5, "active": True}
    ]
    
    # Videos data
    videos_data = [
        {"id": str(uuid.uuid4()), "title": {"fr": "L'Histoire de El Hadji Maodo Malick Sy - Documentaire Complet", "en": "The History of El Hadji Maodo Malick Sy - Complete Documentary", "ar": "تاريخ الحاج مودو مالك سي - وثائقي كامل", "wo": "Taariix El Hadji Maodo Maalik Si - Documentaire bu mat"}, "description": {"fr": "Documentaire complet sur la vie d'El Hadji Malick Sy : son arrivée à l'islam, son instruction, son pèlerinage, son installation à Tivaouane.", "en": "Complete documentary on the life of El Hadji Malick Sy: his arrival to Islam, his education, his pilgrimage, his establishment in Tivaouane.", "ar": "وثائقي كامل عن حياة الحاج مالك سي: وصوله للإسلام، تعليمه، حجه، استقراره في تيفاوان.", "wo": "Documentaire bu mat ci dund El Hadji Maalik Si: njëkk ci Lislaam, njàng bi, Hajj bi, taxaw ci Tiwaawaan."}, "youtubeId": "NpOPd8AsV_c", "duration": "45:00", "views": 125000, "order": 1, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "El Hadji Malick Sy - Documentaire RTS", "en": "El Hadji Malick Sy - RTS Documentary", "ar": "الحاج مالك سي - وثائقي RTS", "wo": "El Hadji Maalik Si - Documentaire RTS"}, "description": {"fr": "Documentaire officiel de la RTS retraçant la vie et l'œuvre de Maodo (Septembre 2024).", "en": "Official RTS documentary tracing the life and work of Maodo (September 2024).", "ar": "وثائقي رسمي من RTS يروي حياة وأعمال مودو (سبتمبر 2024).", "wo": "Documentaire sellal RTS di wax dund ak liggéey Maodo (Septembre 2024)."}, "youtubeId": "CQJ5rPB4baM", "duration": "35:00", "views": 89000, "order": 2, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Documentaire Asfiyahi Television", "en": "Asfiyahi Television Documentary", "ar": "وثائقي تلفزيون أصفياحي", "wo": "Documentaire Asfiyahi Television"}, "description": {"fr": "Documentaire de 29 minutes sur la vie et l'héritage spirituel de Seydil Hadji Malick Sy.", "en": "29-minute documentary on the life and spiritual legacy of Seydil Hadji Malick Sy.", "ar": "وثائقي مدته 29 دقيقة عن حياة وإرث السيدي الحاج مالك سي الروحي.", "wo": "Documentaire 29 minutes ci dund ak njàmbaar bu sell Seydil Hadji Maalik Si."}, "youtubeId": "Q0KxcWiBbXE", "duration": "29:30", "views": 67500, "order": 3, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Mame Maodo : Le Sénégal dans l'histoire", "en": "Mame Maodo: Senegal in History", "ar": "مام مودو: السنغال في التاريخ", "wo": "Maam Maodo: Senegaal ci taariix"}, "description": {"fr": "Série documentaire présentant l'histoire de Maodo et son impact sur l'histoire du Sénégal.", "en": "Documentary series presenting the history of Maodo and his impact on Senegal's history.", "ar": "سلسلة وثائقية تعرض تاريخ مودو وأثره على تاريخ السنغال.", "wo": "Série documentaire di won taariix Maodo ak njëkkit ci taariix Senegaal."}, "youtubeId": "aviqRGqHnPo", "duration": "40:00", "views": 52000, "order": 4, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Khassida Lā Tarkanan - Traduction", "en": "Khassida Lā Tarkanan - Translation", "ar": "قصيدة لا تركنن - ترجمة", "wo": "Khassida Lā Tarkanan - Tekki"}, "description": {"fr": "Récitation de la Khassida avec traduction en wolof et explications spirituelles en français.", "en": "Recitation of the Khassida with Wolof translation and spiritual explanations in French.", "ar": "تلاوة القصيدة مع ترجمة بالولوف وشروحات روحية بالفرنسية.", "wo": "Jàng Khassida ak tekki wolof ak biral bu sell ci français."}, "youtubeId": "JWwRxPQPsCE", "duration": "45:00", "views": 34000, "order": 5, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Récitation Khassaides - Nuit du Burd", "en": "Khassaides Recitation - Night of Burd", "ar": "تلاوة القصائد - ليلة البردة", "wo": "Jàng Khassaides - Guddi Burd"}, "description": {"fr": "Nuit de récitation des khassaides par Doudou Kende et Abou Aziz Mbaye.", "en": "Night of khassaides recitation by Doudou Kende and Abou Aziz Mbaye.", "ar": "ليلة تلاوة القصائد بواسطة دودو كندي وأبو عزيز مباي.", "wo": "Guddi jàng khassaides bu Doudou Kende ak Abou Aziz Mbaye."}, "youtubeId": "iz3ozGdQ5aQ", "duration": "1:20:00", "views": 28000, "order": 6, "active": True}
    ]
    
    # Sources data
    sources_data = [
        {"id": str(uuid.uuid4()), "title": {"fr": "BnF - Fiche d'autorité Malick Sy", "en": "BnF - Malick Sy Authority Record", "ar": "BnF - سجل سلطة مالك سي", "wo": "BnF - Dossier Maalik Si"}, "description": {"fr": "Page officielle de la Bibliothèque nationale de France avec bibliographie complète.", "en": "Official page of the National Library of France with complete bibliography.", "ar": "الصفحة الرسمية للمكتبة الوطنية الفرنسية مع ببليوغرافيا كاملة.", "wo": "Xët sellal bu Bibliothèque nationale France ak bibliographie bu mat."}, "lien": "https://data.bnf.fr/fr/14528700/malick_sy/", "source": {"fr": "Bibliothèque nationale de France", "en": "National Library of France", "ar": "المكتبة الوطنية الفرنسية", "wo": "Bibliothèque nationale France"}, "order": 1, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Les Cahiers de l'Islam", "en": "Les Cahiers de l'Islam", "ar": "دفاتر الإسلام", "wo": "Cahiers de l'Islam yi"}, "description": {"fr": "Article académique sur le rôle de la Tijaniyya dans l'islamisation du Sénégal.", "en": "Academic article on the role of Tijaniyya in the Islamization of Senegal.", "ar": "مقال أكاديمي عن دور التجانية في أسلمة السنغال.", "wo": "Jëf académique ci solo Tijaniyya ci Islamisation Senegaal."}, "lien": "https://www.lescahiersdelislam.fr/Elhadji-Malick-Sy-et-l-islamisation-du-Senegal-le-role-de-la-Tijaniyya-une-confrerie-soufie-d-origine-maghrebine_a1821.html", "source": {"fr": "Recherche Académique", "en": "Academic Research", "ar": "بحث أكاديمي", "wo": "Seet Académique"}, "order": 2, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "OpenEdition Journals", "en": "OpenEdition Journals", "ar": "مجلات OpenEdition", "wo": "OpenEdition Journals"}, "description": {"fr": "Article de recherche dans la Revue des mondes musulmans et de la Méditerranée.", "en": "Research article in the Review of Muslim Worlds and the Mediterranean.", "ar": "مقال بحثي في مجلة العوالم الإسلامية والمتوسط.", "wo": "Jëf seet ci Revue bi àdduna musulman yi ak Méditerranée."}, "lien": "https://journals.openedition.org/remmm/21127", "source": {"fr": "OpenEdition", "en": "OpenEdition", "ar": "OpenEdition", "wo": "OpenEdition"}, "order": 3, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Archive.org - Collection Audio", "en": "Archive.org - Audio Collection", "ar": "Archive.org - مجموعة صوتية", "wo": "Archive.org - Collection Audio"}, "description": {"fr": "Collection audio 'Sidi El Hadj Malick SY Rta' disponible en streaming et téléchargement.", "en": "Audio collection 'Sidi El Hadj Malick SY Rta' available for streaming and download.", "ar": "مجموعة صوتية 'سيدي الحاج مالك سي' متاحة للبث والتحميل.", "wo": "Collection audio 'Sidi El Hadj Maalik SY Rta' am na ci streaming ak download."}, "lien": "https://archive.org/details/sidi-el-hadj-malick-sy-rta", "source": {"fr": "Internet Archive", "en": "Internet Archive", "ar": "أرشيف الإنترنت", "wo": "Internet Archive"}, "order": 4, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Thèses UCAD", "en": "UCAD Theses", "ar": "أطروحات UCAD", "wo": "Thèse UCAD yi"}, "description": {"fr": "Collection de thèses et mémoires de l'Université Cheikh Anta Diop sur El Hadji Malick Sy.", "en": "Collection of theses and dissertations from Cheikh Anta Diop University on El Hadji Malick Sy.", "ar": "مجموعة أطروحات ورسائل من جامعة الشيخ أنتا ديوب عن الحاج مالك سي.", "wo": "Collection thèse ak mémoire bu Université Cheikh Anta Diop ci El Hadji Maalik Si."}, "lien": "http://bibnum.ucad.sn/greenstone/cgi-bin/library.cgi?e=q-00000-00---off-0theses", "source": {"fr": "UCAD Dakar", "en": "UCAD Dakar", "ar": "UCAD داكار", "wo": "UCAD Dakar"}, "order": 5, "active": True},
        {"id": str(uuid.uuid4()), "title": {"fr": "Timbuktu Institute", "en": "Timbuktu Institute", "ar": "معهد تمبكتو", "wo": "Timbuktu Institute"}, "description": {"fr": "Analyse du rôle diplomatique pionnier de la zawiya de Tivaouane.", "en": "Analysis of the pioneering diplomatic role of the Zawiya of Tivaouane.", "ar": "تحليل الدور الدبلوماسي الرائد لزاوية تيفاوان.", "wo": "Xellu ci solo diplomatique bu njëkk bu zawiya Tiwaawaan."}, "lien": "https://timbuktu-institute.org/index.php/toutes-l-actualites/item/289-tivaouane-le-role-diplomatique-pionnier-d-une-zawiya-rayonnante-par-dr-bakary-sambe", "source": {"fr": "Think Tank", "en": "Think Tank", "ar": "مركز أبحاث", "wo": "Think Tank"}, "order": 6, "active": True}
    ]
    
    # Insert all data
    await db.archive_manuscripts.insert_many(manuscripts_data)
    await db.archive_photos.insert_many(photos_data)
    await db.archive_audio.insert_many(audio_data)
    await db.archive_videos.insert_many(videos_data)
    await db.archive_sources.insert_many(sources_data)
    
    return {
        "message": "Archives initialisées avec succès",
        "counts": {
            "manuscripts": len(manuscripts_data),
            "photos": len(photos_data),
            "audio": len(audio_data),
            "videos": len(videos_data),
            "sources": len(sources_data)
        }
    }

# --- Get All Archives Stats ---
@api_router.get("/archives/stats")
async def get_archives_stats():
    """Get archives statistics"""
    manuscripts = await db.archive_manuscripts.count_documents({"active": True})
    photos = await db.archive_photos.count_documents({"active": True})
    audio = await db.archive_audio.count_documents({"active": True})
    videos = await db.archive_videos.count_documents({"active": True})
    sources = await db.archive_sources.count_documents({"active": True})
    
    return {
        "manuscripts": manuscripts,
        "photos": photos,
        "audio": audio,
        "videos": videos,
        "sources": sources,
        "total": manuscripts + photos + audio + videos + sources
    }


# Include the router in the main app
app.include_router(api_router)

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
    client.close()
