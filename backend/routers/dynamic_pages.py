"""
Dynamic Pages routes
"""
from fastapi import APIRouter, HTTPException, Depends
import uuid
from datetime import datetime, timezone

from database import db
from models.dynamic_pages import DynamicPage, DynamicPageCreate, DynamicPageUpdate, PageSectionCreate
from auth import verify_admin_token

router = APIRouter(prefix="/dynamic-pages", tags=["dynamic-pages"])


# Default pages data for seeding
DEFAULT_PAGES = [
    {
        "slug": "histoire/origines",
        "titre": {"fr": "Les Origines de la Tijaniyya", "en": "Origins of the Tijaniyya", "ar": "أصول الطريقة التجانية"},
        "description": {"fr": "L'histoire d'une voie soufie qui a traversé les siècles", "en": "The history of a Sufi path that has crossed centuries"},
        "hero_icon": "BookOpen",
        "parent_menu": "histoire",
        "menu_order": 1,
        "sections": []
    },
    {
        "slug": "histoire/maodo",
        "titre": {"fr": "El Hadji Malick Sy (Maodo)", "en": "El Hadji Malick Sy (Maodo)", "ar": "الحاج مالك سي"},
        "description": {"fr": "La vie et l'œuvre du fondateur", "en": "The life and work of the founder"},
        "hero_icon": "Star",
        "parent_menu": "histoire",
        "menu_order": 2,
        "sections": []
    },
    {
        "slug": "histoire/el-hadji-malick-sy",
        "titre": {"fr": "El Hadji Malick Sy - Maodo", "en": "El Hadji Malick Sy - Maodo", "ar": "الحاج مالك سي"},
        "description": {"fr": "Celui qui a fait de Tivaouane le phare de la spiritualité", "en": "The one who made Tivaouane the beacon of spirituality"},
        "hero_icon": "Star",
        "parent_menu": "histoire",
        "menu_order": 2,
        "sections": []
    },
    {
        "slug": "histoire/khalifes",
        "titre": {"fr": "La Lignée des Khalifes", "en": "The Lineage of Khalifs", "ar": "سلالة الخلفاء"},
        "description": {"fr": "Les successeurs spirituels de Maodo", "en": "The spiritual successors of Maodo"},
        "hero_icon": "Users",
        "parent_menu": "histoire",
        "menu_order": 3,
        "sections": []
    },
    {
        "slug": "histoire/geographie",
        "titre": {"fr": "Géographie Sacrée", "en": "Sacred Geography", "ar": "الجغرافيا المقدسة"},
        "description": {"fr": "Les lieux saints de Tivaouane", "en": "The holy places of Tivaouane"},
        "hero_icon": "MapPin",
        "parent_menu": "histoire",
        "menu_order": 4,
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
        "titre": {"fr": "L'École de Tivaouane", "en": "The School of Tivaouane", "ar": "مدرسة تيفاوان"},
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
        "titre": {"fr": "Les Ziarra Annuelles", "en": "Annual Pilgrimages", "ar": "الزيارات السنوية"},
        "description": {"fr": "Les pèlerinages aux lieux saints", "en": "Pilgrimages to the holy places"},
        "hero_icon": "MapPin",
        "parent_menu": "evenements",
        "menu_order": 2,
        "sections": []
    },
    {
        "slug": "evenements/ceremonies",
        "titre": {"fr": "Cérémonies Religieuses", "en": "Religious Ceremonies", "ar": "المراسم الدينية"},
        "description": {"fr": "Les cérémonies de la Tariqa", "en": "Ceremonies of the Tariqa"},
        "hero_icon": "Star",
        "parent_menu": "evenements",
        "menu_order": 3,
        "sections": []
    }
]


async def ensure_default_pages_exist():
    """Ensure default pages exist in database (called internally)"""
    created = 0
    for page_data in DEFAULT_PAGES:
        existing = await db.dynamic_pages.find_one({"slug": page_data["slug"]})
        if not existing:
            page_dict = page_data.copy()
            page_dict['id'] = str(uuid.uuid4())
            page_dict['active'] = True
            page_dict['show_in_menu'] = True
            page_dict['created_at'] = datetime.now(timezone.utc).isoformat()
            page_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
            await db.dynamic_pages.insert_one(page_dict)
            created += 1
    return created


# ============== PUBLIC ENDPOINTS ==============
@router.get("/")
async def get_all_pages():
    """Get all active dynamic pages"""
    items = await db.dynamic_pages.find({"active": True}, {"_id": 0}).sort("menu_order", 1).to_list(1000)
    return {"pages": items}


@router.get("/menu")
async def get_menu_pages():
    """Get pages grouped by menu for navigation"""
    items = await db.dynamic_pages.find(
        {"active": True, "show_in_menu": True}, 
        {"_id": 0, "slug": 1, "titre": 1, "parent_menu": 1, "menu_order": 1}
    ).sort("menu_order", 1).to_list(1000)
    
    # Group by parent menu
    menu = {
        "histoire": [],
        "enseignements": [],
        "evenements": [],
        "standalone": []
    }
    
    for item in items:
        parent = item.get("parent_menu", "standalone")
        if parent in menu:
            menu[parent].append(item)
        else:
            menu["standalone"].append(item)
    
    return menu


@router.get("/by-slug/{slug:path}")
async def get_page_by_slug(slug: str):
    """Get a page by its slug (e.g., histoire/origines)"""
    item = await db.dynamic_pages.find_one({"slug": slug, "active": True}, {"_id": 0})
    
    # If page not found, try to auto-seed default pages
    if not item:
        # Check if this is a known default page slug
        default_slugs = [p["slug"] for p in DEFAULT_PAGES]
        if slug in default_slugs:
            # Auto-seed default pages
            await ensure_default_pages_exist()
            # Try again
            item = await db.dynamic_pages.find_one({"slug": slug, "active": True}, {"_id": 0})
    
    if not item:
        raise HTTPException(status_code=404, detail="Page non trouvée")
    return item


# ============== ADMIN ENDPOINTS ==============
@router.get("/admin/all")
async def get_all_pages_admin(admin: bool = Depends(verify_admin_token)):
    """Get all pages including inactive (admin)"""
    items = await db.dynamic_pages.find({}, {"_id": 0}).sort("slug", 1).to_list(1000)
    return {"pages": items}


@router.post("/admin")
async def create_page(item: DynamicPageCreate, admin: bool = Depends(verify_admin_token)):
    """Create a new dynamic page"""
    # Check if slug already exists
    existing = await db.dynamic_pages.find_one({"slug": item.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Une page avec ce slug existe déjà")
    
    item_dict = item.model_dump()
    item_dict['id'] = str(uuid.uuid4())
    item_dict['created_at'] = datetime.now(timezone.utc).isoformat()
    item_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Add IDs to sections
    for i, section in enumerate(item_dict.get('sections', [])):
        section['id'] = str(uuid.uuid4())
    
    await db.dynamic_pages.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/admin/{page_id}")
async def update_page(page_id: str, item: DynamicPageUpdate, admin: bool = Depends(verify_admin_token)):
    """Update a dynamic page"""
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Add IDs to new sections
    if 'sections' in update_data:
        for section in update_data['sections']:
            if not section.get('id'):
                section['id'] = str(uuid.uuid4())
    
    if update_data:
        result = await db.dynamic_pages.update_one({"id": page_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Page non trouvée")
    
    updated = await db.dynamic_pages.find_one({"id": page_id}, {"_id": 0})
    return updated


@router.delete("/admin/{page_id}")
async def delete_page(page_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete a dynamic page"""
    result = await db.dynamic_pages.delete_one({"id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page non trouvée")
    return {"message": "Page supprimée avec succès"}


# ============== SECTION MANAGEMENT ==============
@router.post("/admin/{page_id}/sections")
async def add_section(page_id: str, section: PageSectionCreate, admin: bool = Depends(verify_admin_token)):
    """Add a section to a page"""
    section_dict = section.model_dump()
    section_dict['id'] = str(uuid.uuid4())
    
    result = await db.dynamic_pages.update_one(
        {"id": page_id},
        {
            "$push": {"sections": section_dict},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Page non trouvée")
    
    return section_dict


@router.put("/admin/{page_id}/sections/{section_id}")
async def update_section(page_id: str, section_id: str, section: PageSectionCreate, admin: bool = Depends(verify_admin_token)):
    """Update a specific section"""
    section_dict = section.model_dump()
    section_dict['id'] = section_id
    
    result = await db.dynamic_pages.update_one(
        {"id": page_id, "sections.id": section_id},
        {
            "$set": {
                "sections.$": section_dict,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Page ou section non trouvée")
    
    return section_dict


@router.delete("/admin/{page_id}/sections/{section_id}")
async def delete_section(page_id: str, section_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete a section from a page"""
    result = await db.dynamic_pages.update_one(
        {"id": page_id},
        {
            "$pull": {"sections": {"id": section_id}},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Page non trouvée")
    
    return {"message": "Section supprimée"}


# ============== STATS ==============
@router.get("/stats")
async def get_pages_stats():
    """Get statistics for dynamic pages"""
    total = await db.dynamic_pages.count_documents({})
    active = await db.dynamic_pages.count_documents({"active": True})
    
    # Count by parent menu
    by_menu = {}
    for menu in ["histoire", "enseignements", "evenements", None]:
        count = await db.dynamic_pages.count_documents({"parent_menu": menu, "active": True})
        by_menu[menu or "standalone"] = count
    
    return {
        "total": total,
        "active": active,
        "by_menu": by_menu
    }


# ============== SEED DEFAULT PAGES ==============
@router.post("/admin/seed-defaults")
async def seed_default_pages(admin: bool = Depends(verify_admin_token)):
    """Seed default page structures for existing static pages"""
    default_pages = [
        {
            "slug": "histoire/origines",
            "titre": {"fr": "Les Origines", "en": "The Origins", "ar": "الأصول"},
            "description": {"fr": "Découvrez les origines de la Tariqa Tijaniyya", "en": "Discover the origins of the Tijaniyya Tariqa"},
            "hero_icon": "BookOpen",
            "parent_menu": "histoire",
            "menu_order": 1,
            "sections": []
        },
        {
            "slug": "histoire/maodo",
            "titre": {"fr": "El Hadji Malick Sy (Maodo)", "en": "El Hadji Malick Sy (Maodo)", "ar": "الحاج مالك سي"},
            "description": {"fr": "La vie et l'œuvre du fondateur de la Khadra de Tivaouane", "en": "The life and work of the founder of the Khadra of Tivaouane"},
            "hero_icon": "Star",
            "parent_menu": "histoire",
            "menu_order": 2,
            "sections": []
        },
        {
            "slug": "histoire/khalifes",
            "titre": {"fr": "La Lignée des Khalifes", "en": "The Lineage of Khalifs", "ar": "سلالة الخلفاء"},
            "description": {"fr": "Les successeurs spirituels de Maodo", "en": "The spiritual successors of Maodo"},
            "hero_icon": "Users",
            "parent_menu": "histoire",
            "menu_order": 3,
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
            "titre": {"fr": "L'École de Tivaouane", "en": "The School of Tivaouane", "ar": "مدرسة تيفاوان"},
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
            "titre": {"fr": "Les Ziarra Annuelles", "en": "Annual Pilgrimages", "ar": "الزيارات السنوية"},
            "description": {"fr": "Les pèlerinages aux lieux saints de Tivaouane", "en": "Pilgrimages to the holy places of Tivaouane"},
            "hero_icon": "MapPin",
            "parent_menu": "evenements",
            "menu_order": 2,
            "sections": []
        }
    ]
    
    created = 0
    for page_data in default_pages:
        existing = await db.dynamic_pages.find_one({"slug": page_data["slug"]})
        if not existing:
            page_data['id'] = str(uuid.uuid4())
            page_data['active'] = True
            page_data['show_in_menu'] = True
            page_data['created_at'] = datetime.now(timezone.utc).isoformat()
            page_data['updated_at'] = datetime.now(timezone.utc).isoformat()
            await db.dynamic_pages.insert_one(page_data)
            created += 1
    
    return {"message": f"{created} pages créées sur {len(default_pages)}"}
