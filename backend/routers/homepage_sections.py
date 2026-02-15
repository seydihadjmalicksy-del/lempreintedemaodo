"""
Homepage Sections Router - Dynamic sections for the homepage (Wattu, Dons, etc.)
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime, timezone
from database import db
from routers.admin import verify_admin_token
import uuid

router = APIRouter(prefix="/homepage-sections", tags=["Homepage Sections"])

# Pydantic Models
class HomepageSectionBase(BaseModel):
    section_type: str  # "wattu_promo", "donations", "custom"
    title: Dict[str, str]  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: Optional[Dict[str, str]] = None
    content: Optional[Dict] = None  # Flexible content (phone numbers, links, etc.)
    is_active: bool = True
    display_order: int = 0
    background_style: Optional[str] = "green"  # "green", "gold", "white", "gradient"

class HomepageSectionCreate(HomepageSectionBase):
    pass

class HomepageSectionUpdate(BaseModel):
    title: Optional[Dict[str, str]] = None
    description: Optional[Dict[str, str]] = None
    content: Optional[Dict] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None
    background_style: Optional[str] = None

class HomepageSectionResponse(HomepageSectionBase):
    id: str
    created_at: str
    updated_at: str

# Default sections data
DEFAULT_SECTIONS = [
    {
        "id": "wattu_promo",
        "section_type": "wattu_promo",
        "title": {
            "fr": "Wattu - Opinions & Réflexions",
            "en": "Wattu - Opinions & Reflections",
            "ar": "واتو - آراء وتأملات",
            "wo": "Wattu - Xalaat ak Xibaar"
        },
        "description": {
            "fr": "Découvrez des articles, des analyses et des réflexions sur la tradition tidiane et la spiritualité.",
            "en": "Discover articles, analyses, and reflections on the Tidiane tradition and spirituality.",
            "ar": "اكتشف المقالات والتحليلات والتأملات حول التقليد التجاني والروحانية.",
            "wo": "Gis bindu yi, nataal yi ak xalaat yi ci tariqa Tijaan ak ruu."
        },
        "content": {
            "button_text": {
                "fr": "Accéder à Wattu",
                "en": "Access Wattu",
                "ar": "الوصول إلى واتو",
                "wo": "Jël Wattu"
            },
            "link": "/wattu"
        },
        "is_active": True,
        "display_order": 1,
        "background_style": "gradient"
    },
    {
        "id": "donations",
        "section_type": "donations",
        "title": {
            "fr": "Dons (Hadiya)",
            "en": "Donations (Hadiya)",
            "ar": "التبرعات (الهدية)",
            "wo": "Ndimbal (Hadiya)"
        },
        "description": {
            "fr": "Vos généreuses contributions nous aident à préserver et partager l'héritage spirituel de Maodo. Chaque don est une bénédiction.",
            "en": "Your generous contributions help us preserve and share the spiritual heritage of Maodo. Every donation is a blessing.",
            "ar": "تساعدنا مساهماتكم السخية في الحفاظ على التراث الروحي لمودو ونشره. كل تبرع هو بركة.",
            "wo": "Sa ndimbal yi dañu nu dimbali ngir wattu ak yóbbu njàng bu Maodo. Bépp hadiya barke la."
        },
        "content": {
            "how_to_donate_title": {
                "fr": "Comment faire un don",
                "en": "How to Donate",
                "ar": "كيفية التبرع",
                "wo": "Nan ngay jox"
            },
            "payment_methods": [
                {
                    "type": "mobile_money",
                    "label": "Wave / Orange Money",
                    "value": "77 338 90 95"
                }
            ],
            "quote": {
                "fr": "\"Les meilleurs des gens sont ceux qui sont les plus bénéfiques pour les autres.\" - Hadith",
                "en": "\"The best of people are those who are most beneficial to others.\" - Hadith",
                "ar": "\"خير الناس أنفعهم للناس\" - حديث",
                "wo": "\"Ñi gën ci nit ñi, mooy ñi gën a am njariñ ci ñeneen ñi.\" - Hadiis"
            }
        },
        "is_active": True,
        "display_order": 2,
        "background_style": "green"
    }
]

# Initialize default sections
async def init_homepage_sections():
    """Initialize default homepage sections if they don't exist"""
    collection = db.homepage_sections
    
    for section_data in DEFAULT_SECTIONS:
        existing = await collection.find_one({"id": section_data["id"]})
        if not existing:
            section_data["created_at"] = datetime.now(timezone.utc).isoformat()
            section_data["updated_at"] = datetime.now(timezone.utc).isoformat()
            await collection.insert_one(section_data)
    
    return True

# Public endpoints
@router.get("/", response_model=List[HomepageSectionResponse])
async def get_all_sections():
    """Get all active homepage sections (public)"""
    await init_homepage_sections()
    
    sections = await db.homepage_sections.find(
        {"is_active": True},
        {"_id": 0}
    ).sort("display_order", 1).to_list(100)
    
    return sections

@router.get("/{section_id}")
async def get_section(section_id: str):
    """Get a specific section by ID"""
    await init_homepage_sections()
    
    section = await db.homepage_sections.find_one(
        {"id": section_id},
        {"_id": 0}
    )
    
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    return section

# Admin endpoints
@router.get("/admin/all")
async def admin_get_all_sections(admin: dict = Depends(verify_admin_token)):
    """Get all sections including inactive ones (admin only)"""
    await init_homepage_sections()
    
    sections = await db.homepage_sections.find(
        {},
        {"_id": 0}
    ).sort("display_order", 1).to_list(100)
    
    return sections

@router.post("/admin")
async def admin_create_section(
    section: HomepageSectionCreate,
    admin: dict = Depends(verify_admin_token)
):
    """Create a new homepage section (admin only)"""
    section_data = section.dict()
    section_data["id"] = str(uuid.uuid4())[:8]
    section_data["created_at"] = datetime.now(timezone.utc).isoformat()
    section_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.homepage_sections.insert_one(section_data)
    
    return {"message": "Section created successfully", "id": section_data["id"]}

@router.put("/admin/{section_id}")
async def admin_update_section(
    section_id: str,
    updates: HomepageSectionUpdate,
    admin: dict = Depends(verify_admin_token)
):
    """Update a homepage section (admin only)"""
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.homepage_sections.update_one(
        {"id": section_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Section not found")
    
    return {"message": "Section updated successfully"}

@router.delete("/admin/{section_id}")
async def admin_delete_section(
    section_id: str,
    admin: dict = Depends(verify_admin_token)
):
    """Delete a homepage section (admin only)"""
    result = await db.homepage_sections.delete_one({"id": section_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Section not found")
    
    return {"message": "Section deleted successfully"}

@router.post("/admin/reset-defaults")
async def admin_reset_defaults(admin: dict = Depends(verify_admin_token)):
    """Reset homepage sections to defaults (admin only)"""
    # Delete all existing sections
    await db.homepage_sections.delete_many({})
    
    # Reinitialize with defaults
    await init_homepage_sections()
    
    return {"message": "Homepage sections reset to defaults"}
