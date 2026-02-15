"""
Video routes
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import uuid

from database import db
from models import Video, VideoCreate, VideoUpdate, Category
from auth import verify_admin_token

router = APIRouter(prefix="/videos", tags=["videos"])


@router.get("", response_model=List[Video])
async def get_videos(category: Optional[str] = None, search: Optional[str] = None):
    query = {}
    
    if category:
        query['category'] = category
        
    if search:
        query['$or'] = [
            {'title': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}}
        ]
    
    videos = await db.videos.find(query, {"_id": 0}).sort("created_at", -1).limit(100).to_list(100)
    return videos


@router.get("/featured", response_model=List[Video])
async def get_featured_videos():
    videos = await db.videos.find(
        {"featured": True}, 
        {"_id": 0}
    ).sort("created_at", -1).limit(6).to_list(6)
    return videos


@router.get("/{video_id}", response_model=Video)
async def get_video(video_id: str):
    video = await db.videos.find_one({"id": video_id}, {"_id": 0})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Increment views
    await db.videos.update_one(
        {"id": video_id},
        {"$inc": {"views": 1}}
    )
    
    return video


@router.post("", response_model=Video, status_code=201)
async def create_video(video: VideoCreate, admin: bool = Depends(verify_admin_token)):
    new_video = Video(**video.model_dump())
    video_dict = new_video.model_dump()
    video_dict['created_at'] = video_dict['created_at'].isoformat()
    
    await db.videos.insert_one(video_dict)
    video_dict.pop("_id", None)
    return video_dict


@router.put("/{video_id}", response_model=Video)
async def update_video(video_id: str, video: VideoUpdate, admin: bool = Depends(verify_admin_token)):
    update_data = {k: v for k, v in video.model_dump().items() if v is not None}
    
    if update_data:
        await db.videos.update_one(
            {"id": video_id},
            {"$set": update_data}
        )
    
    updated_video = await db.videos.find_one({"id": video_id}, {"_id": 0})
    if not updated_video:
        raise HTTPException(status_code=404, detail="Video not found")
    return updated_video


@router.delete("/{video_id}")
async def delete_video(video_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.videos.delete_one({"id": video_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"message": "Video deleted"}


@router.get("/categories/list", response_model=List[Category])
async def get_categories():
    # Get unique categories with counts
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    
    categories = []
    async for cat in db.videos.aggregate(pipeline):
        categories.append(Category(
            name=cat['_id'],
            name_fr=cat['_id'],
            count=cat['count']
        ))
    
    return categories
