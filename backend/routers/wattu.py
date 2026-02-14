"""
Wattu (Opinions) routes
"""
from fastapi import APIRouter, HTTPException, Depends
import uuid
from datetime import datetime, timezone

from database import db
from models.wattu import WattuArticle, WattuArticleCreate, WattuArticleUpdate
from auth import verify_admin_token

router = APIRouter(prefix="/wattu", tags=["wattu"])


# ============== PUBLIC ENDPOINTS ==============
@router.get("/articles")
async def get_wattu_articles():
    """Get all active opinion articles"""
    items = await db.wattu_articles.find({"active": True}, {"_id": 0}).sort("date_publication", -1).to_list(1000)
    return items


@router.get("/articles/featured")
async def get_featured_articles():
    """Get featured articles for homepage"""
    items = await db.wattu_articles.find(
        {"active": True, "featured": True}, 
        {"_id": 0}
    ).sort("date_publication", -1).to_list(5)
    return items


@router.get("/articles/category/{category}")
async def get_articles_by_category(category: str):
    """Get articles by category"""
    items = await db.wattu_articles.find(
        {"active": True, "categorie": category}, 
        {"_id": 0}
    ).sort("date_publication", -1).to_list(1000)
    return items


@router.get("/articles/{article_id}")
async def get_article(article_id: str):
    """Get a single article by ID"""
    item = await db.wattu_articles.find_one({"id": article_id, "active": True}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return item


@router.get("/categories")
async def get_categories():
    """Get all available categories"""
    return [
        {"id": "general", "label": {"fr": "Général", "en": "General", "ar": "عام", "wo": "Wànte"}},
        {"id": "spirituel", "label": {"fr": "Spiritualité", "en": "Spirituality", "ar": "روحانية", "wo": "Yàlla"}},
        {"id": "actualite", "label": {"fr": "Actualités", "en": "News", "ar": "أخبار", "wo": "Xibaar"}},
        {"id": "reflexion", "label": {"fr": "Réflexions", "en": "Reflections", "ar": "تأملات", "wo": "Xalaat"}}
    ]


# ============== ADMIN ENDPOINTS ==============
@router.get("/admin/articles")
async def get_all_articles_admin(admin: bool = Depends(verify_admin_token)):
    """Get all articles (admin - includes inactive)"""
    items = await db.wattu_articles.find({}, {"_id": 0}).sort("date_publication", -1).to_list(1000)
    return items


@router.post("/admin/articles")
async def create_article(item: WattuArticleCreate, admin: bool = Depends(verify_admin_token)):
    """Create a new opinion article"""
    item_dict = item.model_dump()
    item_dict['id'] = str(uuid.uuid4())
    item_dict['date_publication'] = datetime.now(timezone.utc).isoformat()
    item_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.wattu_articles.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/admin/articles/{article_id}")
async def update_article(article_id: str, item: WattuArticleUpdate, admin: bool = Depends(verify_admin_token)):
    """Update an opinion article"""
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.wattu_articles.update_one({"id": article_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Article non trouvé")
    updated = await db.wattu_articles.find_one({"id": article_id}, {"_id": 0})
    return updated


@router.delete("/admin/articles/{article_id}")
async def delete_article(article_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete an opinion article"""
    result = await db.wattu_articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return {"message": "Article supprimé avec succès"}


# ============== STATS ==============
@router.get("/stats")
async def get_wattu_stats():
    """Get statistics for Wattu articles"""
    total = await db.wattu_articles.count_documents({"active": True})
    featured = await db.wattu_articles.count_documents({"active": True, "featured": True})
    
    # Count by category
    categories = {}
    for cat in ["general", "spirituel", "actualite", "reflexion"]:
        count = await db.wattu_articles.count_documents({"active": True, "categorie": cat})
        categories[cat] = count
    
    return {
        "total": total,
        "featured": featured,
        "by_category": categories
    }
