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
