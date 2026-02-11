"""
Archives routes
"""
from fastapi import APIRouter, HTTPException, Depends
import uuid

from database import db
from models import (
    ArchiveManuscript, ArchiveManuscriptCreate, ArchiveManuscriptUpdate,
    ArchivePhoto, ArchivePhotoCreate, ArchivePhotoUpdate,
    ArchiveAudio, ArchiveAudioCreate, ArchiveAudioUpdate,
    ArchiveVideo, ArchiveVideoCreate, ArchiveVideoUpdate,
    ArchiveSource, ArchiveSourceCreate, ArchiveSourceUpdate
)
from auth import verify_admin_token

router = APIRouter(prefix="/archives", tags=["archives"])


# ============== MANUSCRIPTS ==============
@router.get("/manuscripts")
async def get_manuscripts():
    items = await db.archive_manuscripts.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@router.post("/manuscripts")
async def create_manuscript(item: ArchiveManuscriptCreate, admin: bool = Depends(verify_admin_token)):
    new_item = ArchiveManuscript(**item.model_dump())
    item_dict = new_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.archive_manuscripts.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/manuscripts/{item_id}")
async def update_manuscript(item_id: str, item: ArchiveManuscriptUpdate, admin: bool = Depends(verify_admin_token)):
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.archive_manuscripts.update_one({"id": item_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Manuscrit non trouvé")
    updated = await db.archive_manuscripts.find_one({"id": item_id}, {"_id": 0})
    return updated


@router.delete("/manuscripts/{item_id}")
async def delete_manuscript(item_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.archive_manuscripts.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Manuscrit non trouvé")
    return {"message": "Manuscrit supprimé"}


# ============== PHOTOS ==============
@router.get("/photos")
async def get_photos():
    items = await db.archive_photos.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@router.post("/photos")
async def create_photo(item: ArchivePhotoCreate, admin: bool = Depends(verify_admin_token)):
    new_item = ArchivePhoto(**item.model_dump())
    item_dict = new_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.archive_photos.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/photos/{item_id}")
async def update_photo(item_id: str, item: ArchivePhotoUpdate, admin: bool = Depends(verify_admin_token)):
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.archive_photos.update_one({"id": item_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Photo non trouvée")
    updated = await db.archive_photos.find_one({"id": item_id}, {"_id": 0})
    return updated


@router.delete("/photos/{item_id}")
async def delete_photo(item_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.archive_photos.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo non trouvée")
    return {"message": "Photo supprimée"}


# ============== AUDIO ==============
@router.get("/audio")
async def get_audio():
    items = await db.archive_audio.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@router.post("/audio")
async def create_audio(item: ArchiveAudioCreate, admin: bool = Depends(verify_admin_token)):
    new_item = ArchiveAudio(**item.model_dump())
    item_dict = new_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.archive_audio.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/audio/{item_id}")
async def update_audio(item_id: str, item: ArchiveAudioUpdate, admin: bool = Depends(verify_admin_token)):
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.archive_audio.update_one({"id": item_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Audio non trouvé")
    updated = await db.archive_audio.find_one({"id": item_id}, {"_id": 0})
    return updated


@router.delete("/audio/{item_id}")
async def delete_audio(item_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.archive_audio.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Audio non trouvé")
    return {"message": "Audio supprimé"}


# ============== VIDEOS ==============
@router.get("/videos")
async def get_videos():
    items = await db.archive_videos.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@router.post("/videos")
async def create_video(item: ArchiveVideoCreate, admin: bool = Depends(verify_admin_token)):
    new_item = ArchiveVideo(**item.model_dump())
    item_dict = new_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.archive_videos.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/videos/{item_id}")
async def update_video(item_id: str, item: ArchiveVideoUpdate, admin: bool = Depends(verify_admin_token)):
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.archive_videos.update_one({"id": item_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    updated = await db.archive_videos.find_one({"id": item_id}, {"_id": 0})
    return updated


@router.delete("/videos/{item_id}")
async def delete_video(item_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.archive_videos.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Vidéo non trouvée")
    return {"message": "Vidéo supprimée"}


# ============== SOURCES ==============
@router.get("/sources")
async def get_sources():
    items = await db.archive_sources.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@router.post("/sources")
async def create_source(item: ArchiveSourceCreate, admin: bool = Depends(verify_admin_token)):
    new_item = ArchiveSource(**item.model_dump())
    item_dict = new_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.archive_sources.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/sources/{item_id}")
async def update_source(item_id: str, item: ArchiveSourceUpdate, admin: bool = Depends(verify_admin_token)):
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.archive_sources.update_one({"id": item_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Source non trouvée")
    updated = await db.archive_sources.find_one({"id": item_id}, {"_id": 0})
    return updated


@router.delete("/sources/{item_id}")
async def delete_source(item_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.archive_sources.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Source non trouvée")
    return {"message": "Source supprimée"}


# ============== STATS ==============
@router.get("/stats")
async def get_archives_stats():
    """Get statistics for all archive collections"""
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
