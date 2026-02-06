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

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

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
