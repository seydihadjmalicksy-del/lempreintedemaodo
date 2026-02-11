"""
Content routes (CMS pages)
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from database import db
from models import PageContent, PageContentCreate, PageContentUpdate
from auth import verify_admin_token

router = APIRouter(prefix="/content", tags=["content"])


@router.get("")
async def get_all_content():
    """Get all page content"""
    content = await db.page_content.find({"active": True}, {"_id": 0}).sort([("slug", 1), ("order", 1)]).to_list(1000)
    return content


@router.get("/{slug}")
async def get_page_content(slug: str):
    """Get all content sections for a page"""
    content = await db.page_content.find(
        {"slug": slug, "active": True}, 
        {"_id": 0}
    ).sort("order", 1).to_list(100)
    
    if not content:
        raise HTTPException(status_code=404, detail="Page non trouvée")
    
    return content


@router.get("/{slug}/{section}")
async def get_section_content(slug: str, section: str):
    """Get specific section content"""
    content = await db.page_content.find_one(
        {"slug": slug, "section": section, "active": True},
        {"_id": 0}
    )
    
    if not content:
        raise HTTPException(status_code=404, detail="Section non trouvée")
    
    return content


@router.post("")
async def create_content(content: PageContentCreate, admin: bool = Depends(verify_admin_token)):
    """Create new content section"""
    new_content = PageContent(**content.model_dump())
    content_dict = new_content.model_dump()
    content_dict['created_at'] = content_dict['created_at'].isoformat()
    
    await db.page_content.insert_one(content_dict)
    content_dict.pop("_id", None)
    return content_dict


@router.put("/{content_id}")
async def update_content(content_id: str, content: PageContentUpdate, admin: bool = Depends(verify_admin_token)):
    """Update content section"""
    update_data = {k: v for k, v in content.model_dump().items() if v is not None}
    
    if update_data:
        result = await db.page_content.update_one({"id": content_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Contenu non trouvé")
    
    updated = await db.page_content.find_one({"id": content_id}, {"_id": 0})
    return updated


@router.delete("/{content_id}")
async def delete_content(content_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete content section"""
    result = await db.page_content.delete_one({"id": content_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contenu non trouvé")
    return {"message": "Contenu supprimé"}


# Pages list endpoint
@router.get("/pages/list")
async def get_pages():
    """Get list of all pages with their sections"""
    pipeline = [
        {"$match": {"active": True}},
        {"$group": {
            "_id": "$slug",
            "sections": {"$push": "$section"},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    
    pages = []
    async for page in db.page_content.aggregate(pipeline):
        pages.append({
            "slug": page["_id"],
            "sections": page["sections"],
            "section_count": page["count"]
        })
    
    return pages
