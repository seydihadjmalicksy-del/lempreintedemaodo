"""
Media Management Routes
API pour la gestion des fichiers médias (PDF, images, audio, vidéo)
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query
from fastapi.responses import FileResponse
from typing import List, Optional
import uuid
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path

from database import db
from models.media import (
    MediaFile, MediaFileCreate, MediaFileUpdate,
    PageMediaAssociation, PageMediaAssociationCreate, PageMediaAssociationUpdate,
    MediaTag, MediaTagCreate, MediaTagUpdate,
    AVAILABLE_PAGES, FILE_TYPE_CONFIG
)
from auth import verify_admin_token

router = APIRouter(prefix="/media", tags=["media"])

# Configuration
UPLOAD_DIR = Path("/app/frontend/public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def get_file_type(mime_type: str, filename: str) -> str:
    """Determine file type based on mime type and extension"""
    ext = Path(filename).suffix.lower()
    
    for file_type, config in FILE_TYPE_CONFIG.items():
        if mime_type in config["mime_types"] or ext in config["extensions"]:
            return file_type
    
    return "unknown"


def validate_file(file: UploadFile) -> tuple:
    """Validate uploaded file and return (file_type, error_message)"""
    if not file.filename:
        return None, "Nom de fichier manquant"
    
    ext = Path(file.filename).suffix.lower()
    file_type = get_file_type(file.content_type or "", file.filename)
    
    if file_type == "unknown":
        return None, f"Type de fichier non supporté: {ext}"
    
    config = FILE_TYPE_CONFIG[file_type]
    if ext not in config["extensions"]:
        return None, f"Extension non supportée pour {file_type}: {ext}"
    
    return file_type, None


# ============== FILE UPLOAD ==============
@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    title_fr: str = Form(""),
    title_en: str = Form(""),
    description_fr: str = Form(""),
    description_en: str = Form(""),
    tags: str = Form(""),  # Comma-separated tags
    admin: bool = Depends(verify_admin_token)
):
    """Upload a new media file"""
    # Validate file
    file_type, error = validate_file(file)
    if error:
        raise HTTPException(status_code=400, detail=error)
    
    # Read file content to check size
    content = await file.read()
    file_size = len(content)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"Fichier trop volumineux. Maximum: {MAX_FILE_SIZE // (1024*1024)} MB"
        )
    
    # Generate unique filename
    file_ext = Path(file.filename).suffix.lower()
    stored_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / stored_filename
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Create file URL - Use /api/media prefix to ensure proper routing through ingress
    file_url = f"/api/media/uploads/{stored_filename}"
    
    # Generate thumbnail for images
    thumbnail_url = None
    dimensions = None
    
    if file_type == "image":
        thumbnail_url = file_url  # For now, use same URL (could generate actual thumbnails)
        # Could add PIL to get dimensions if needed
    
    # Parse tags
    tag_list = [t.strip() for t in tags.split(",") if t.strip()] if tags else []
    
    # Create media file record
    media_file = MediaFile(
        filename=file.filename,
        stored_filename=stored_filename,
        file_type=file_type,
        mime_type=file.content_type or "application/octet-stream",
        file_size=file_size,
        file_url=file_url,
        thumbnail_url=thumbnail_url,
        title={"fr": title_fr, "en": title_en} if title_fr or title_en else {},
        description={"fr": description_fr, "en": description_en} if description_fr or description_en else {},
        tags=tag_list,
        dimensions=dimensions
    )
    
    # Save to database
    file_dict = media_file.model_dump()
    file_dict['created_at'] = file_dict['created_at'].isoformat()
    file_dict['updated_at'] = file_dict['updated_at'].isoformat()
    await db.media_files.insert_one(file_dict)
    file_dict.pop("_id", None)
    
    return file_dict


@router.post("/upload-chunk")
async def upload_chunk(
    chunk: UploadFile = File(...),
    chunk_index: int = Form(...),
    total_chunks: int = Form(...),
    file_id: str = Form(...),
    filename: str = Form(...),
    admin: bool = Depends(verify_admin_token)
):
    """Upload a file chunk for large files"""
    # Create temp directory for chunks
    temp_dir = UPLOAD_DIR / "temp" / file_id
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    # Save chunk
    chunk_path = temp_dir / f"chunk_{chunk_index}"
    content = await chunk.read()
    with open(chunk_path, "wb") as f:
        f.write(content)
    
    # Check if all chunks are uploaded
    uploaded_chunks = list(temp_dir.glob("chunk_*"))
    
    if len(uploaded_chunks) == total_chunks:
        # Combine chunks
        file_ext = Path(filename).suffix.lower()
        stored_filename = f"{file_id}{file_ext}"
        final_path = UPLOAD_DIR / stored_filename
        
        with open(final_path, "wb") as outfile:
            for i in range(total_chunks):
                chunk_path = temp_dir / f"chunk_{i}"
                with open(chunk_path, "rb") as infile:
                    outfile.write(infile.read())
        
        # Clean up temp directory
        shutil.rmtree(temp_dir)
        
        return {
            "status": "complete",
            "stored_filename": stored_filename,
            "file_url": f"/uploads/{stored_filename}"
        }
    
    return {
        "status": "partial",
        "uploaded_chunks": len(uploaded_chunks),
        "total_chunks": total_chunks
    }


# ============== FILE CRUD ==============
@router.get("/files")
async def get_files(
    file_type: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    active_only: bool = True,
    limit: int = Query(default=50, le=200),
    skip: int = 0
):
    """Get all media files with optional filters"""
    query = {}
    
    if active_only:
        query["active"] = True
    
    if file_type:
        query["file_type"] = file_type
    
    if tag:
        query["tags"] = tag
    
    if search:
        query["$or"] = [
            {"filename": {"$regex": search, "$options": "i"}},
            {"title.fr": {"$regex": search, "$options": "i"}},
            {"title.en": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}}
        ]
    
    files = await db.media_files.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.media_files.count_documents(query)
    
    return {
        "files": files,
        "total": total,
        "limit": limit,
        "skip": skip
    }


@router.get("/files/{file_id}")
async def get_file(file_id: str):
    """Get a specific media file"""
    file = await db.media_files.find_one({"id": file_id}, {"_id": 0})
    if not file:
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    # Get associations
    associations = await db.media_page_associations.find(
        {"media_id": file_id, "active": True}, 
        {"_id": 0}
    ).to_list(50)
    
    return {
        "file": file,
        "associations": associations,
        "pages": [a["page_slug"] for a in associations]
    }


@router.put("/files/{file_id}")
async def update_file(
    file_id: str,
    update: MediaFileUpdate,
    admin: bool = Depends(verify_admin_token)
):
    """Update a media file's metadata"""
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        result = await db.media_files.update_one({"id": file_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    updated = await db.media_files.find_one({"id": file_id}, {"_id": 0})
    return updated


@router.delete("/files/{file_id}")
async def delete_file(file_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete a media file"""
    file = await db.media_files.find_one({"id": file_id}, {"_id": 0})
    if not file:
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    # Delete physical file
    file_path = UPLOAD_DIR / file["stored_filename"]
    if file_path.exists():
        file_path.unlink()
    
    # Delete associations
    await db.media_page_associations.delete_many({"media_id": file_id})
    
    # Delete from database
    await db.media_files.delete_one({"id": file_id})
    
    return {"message": "Fichier supprimé"}


# ============== PAGE ASSOCIATIONS ==============
@router.get("/pages")
async def get_available_pages():
    """Get list of available pages for media association"""
    return AVAILABLE_PAGES


@router.post("/associations")
async def create_association(
    association: PageMediaAssociationCreate,
    admin: bool = Depends(verify_admin_token)
):
    """Associate a media file with a page"""
    # Verify media exists
    media = await db.media_files.find_one({"id": association.media_id}, {"_id": 0})
    if not media:
        raise HTTPException(status_code=404, detail="Fichier média non trouvé")
    
    # Check if association already exists
    existing = await db.media_page_associations.find_one({
        "media_id": association.media_id,
        "page_slug": association.page_slug
    })
    if existing:
        raise HTTPException(status_code=400, detail="Cette association existe déjà")
    
    new_association = PageMediaAssociation(**association.model_dump())
    assoc_dict = new_association.model_dump()
    assoc_dict['created_at'] = assoc_dict['created_at'].isoformat()
    await db.media_page_associations.insert_one(assoc_dict)
    assoc_dict.pop("_id", None)
    
    return assoc_dict


@router.get("/associations/page/{page_slug:path}")
async def get_page_media(page_slug: str, section: Optional[str] = None):
    """Get all media files associated with a page"""
    query = {"page_slug": page_slug, "active": True}
    if section:
        query["section"] = section
    
    associations = await db.media_page_associations.find(query, {"_id": 0}).sort("display_order", 1).to_list(100)
    
    # Get media files
    media_files = []
    for assoc in associations:
        media = await db.media_files.find_one({"id": assoc["media_id"], "active": True}, {"_id": 0})
        if media:
            media_files.append({
                **media,
                "display_order": assoc["display_order"],
                "display_settings": assoc.get("display_settings", {}),
                "association_id": assoc["id"],
                "section": assoc.get("section")
            })
    
    return {
        "page_slug": page_slug,
        "media_files": media_files
    }


@router.put("/associations/{association_id}")
async def update_association(
    association_id: str,
    update: PageMediaAssociationUpdate,
    admin: bool = Depends(verify_admin_token)
):
    """Update a page-media association"""
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if update_data:
        result = await db.media_page_associations.update_one(
            {"id": association_id}, 
            {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Association non trouvée")
    
    updated = await db.media_page_associations.find_one({"id": association_id}, {"_id": 0})
    return updated


@router.delete("/associations/{association_id}")
async def delete_association(association_id: str, admin: bool = Depends(verify_admin_token)):
    """Remove a page-media association"""
    result = await db.media_page_associations.delete_one({"id": association_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Association non trouvée")
    return {"message": "Association supprimée"}


@router.put("/associations/reorder")
async def reorder_associations(
    page_slug: str,
    order: List[dict],  # [{"id": "...", "display_order": 0}, ...]
    admin: bool = Depends(verify_admin_token)
):
    """Reorder media files for a page"""
    for item in order:
        await db.media_page_associations.update_one(
            {"id": item["id"], "page_slug": page_slug},
            {"$set": {"display_order": item["display_order"]}}
        )
    return {"message": "Ordre mis à jour"}


# ============== TAGS ==============
@router.get("/tags")
async def get_tags():
    """Get all media tags"""
    tags = await db.media_tags.find({}, {"_id": 0}).sort("name", 1).to_list(100)
    return tags


@router.post("/tags")
async def create_tag(tag: MediaTagCreate, admin: bool = Depends(verify_admin_token)):
    """Create a new tag"""
    # Check if tag already exists
    existing = await db.media_tags.find_one({"name": tag.name})
    if existing:
        raise HTTPException(status_code=400, detail="Ce tag existe déjà")
    
    new_tag = MediaTag(**tag.model_dump())
    tag_dict = new_tag.model_dump()
    tag_dict['created_at'] = tag_dict['created_at'].isoformat()
    await db.media_tags.insert_one(tag_dict)
    tag_dict.pop("_id", None)
    
    return tag_dict


@router.put("/tags/{tag_id}")
async def update_tag(
    tag_id: str,
    update: MediaTagUpdate,
    admin: bool = Depends(verify_admin_token)
):
    """Update a tag"""
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if update_data:
        result = await db.media_tags.update_one({"id": tag_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Tag non trouvé")
    
    updated = await db.media_tags.find_one({"id": tag_id}, {"_id": 0})
    return updated


@router.delete("/tags/{tag_id}")
async def delete_tag(tag_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete a tag"""
    tag = await db.media_tags.find_one({"id": tag_id}, {"_id": 0})
    if not tag:
        raise HTTPException(status_code=404, detail="Tag non trouvé")
    
    # Remove tag from all files
    await db.media_files.update_many(
        {"tags": tag["name"]},
        {"$pull": {"tags": tag["name"]}}
    )
    
    await db.media_tags.delete_one({"id": tag_id})
    return {"message": "Tag supprimé"}


# ============== STATS ==============
@router.get("/stats")
async def get_media_stats():
    """Get media library statistics"""
    total = await db.media_files.count_documents({"active": True})
    
    # Count by type
    pdf_count = await db.media_files.count_documents({"file_type": "pdf", "active": True})
    image_count = await db.media_files.count_documents({"file_type": "image", "active": True})
    audio_count = await db.media_files.count_documents({"file_type": "audio", "active": True})
    video_count = await db.media_files.count_documents({"file_type": "video", "active": True})
    
    # Total file size
    pipeline = [
        {"$match": {"active": True}},
        {"$group": {"_id": None, "total_size": {"$sum": "$file_size"}}}
    ]
    size_result = await db.media_files.aggregate(pipeline).to_list(1)
    total_size = size_result[0]["total_size"] if size_result else 0
    
    # Associations count
    associations_count = await db.media_page_associations.count_documents({"active": True})
    
    # Tags count
    tags_count = await db.media_tags.count_documents({})
    
    return {
        "total": total,
        "by_type": {
            "pdf": pdf_count,
            "image": image_count,
            "audio": audio_count,
            "video": video_count
        },
        "total_size_bytes": total_size,
        "total_size_mb": round(total_size / (1024 * 1024), 2),
        "associations": associations_count,
        "tags": tags_count
    }


# ============== SERVE UPLOADED FILES ==============
@router.get("/uploads/{filename}")
async def serve_uploaded_file(filename: str):
    """Serve uploaded media files"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    # Determine content type based on extension
    ext = Path(filename).suffix.lower()
    content_types = {
        ".pdf": "application/pdf",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
        ".ogg": "audio/ogg",
        ".mp4": "video/mp4",
        ".webm": "video/webm",
        ".mov": "video/quicktime"
    }
    
    content_type = content_types.get(ext, "application/octet-stream")
    
    return FileResponse(
        path=str(file_path),
        media_type=content_type,
        filename=filename
    )
