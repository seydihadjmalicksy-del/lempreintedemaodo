from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


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

class SearchResult(BaseModel):
    id: str
    title: str
    description: str
    type: str  # page, video, event, quote
    url: str
    relevance: float = 1.0


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
    
    videos = await db.videos.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
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
