"""
Dynamic Pages Content models
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime, timezone
import uuid


class PageSection(BaseModel):
    """A section within a page"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str = "text"  # text, image, quote, video, cards, timeline
    titre: Dict[str, str] = Field(default_factory=dict)
    contenu: Dict[str, str] = Field(default_factory=dict)
    image: Optional[str] = None
    order: int = 0
    visible: bool = True
    metadata: Dict = Field(default_factory=dict)  # Additional data for specific section types


class DynamicPage(BaseModel):
    """Dynamic page content model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str  # URL slug like "histoire/origines"
    titre: Dict[str, str] = Field(default_factory=dict)
    description: Dict[str, str] = Field(default_factory=dict)
    hero_image: Optional[str] = None
    hero_icon: Optional[str] = None  # Lucide icon name
    sections: List[PageSection] = Field(default_factory=list)
    active: bool = True
    show_in_menu: bool = True
    parent_menu: Optional[str] = None  # histoire, enseignements, evenements
    menu_order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PageSectionCreate(BaseModel):
    """Create/Update model for page section"""
    type: str = "text"
    titre: Dict[str, str] = Field(default_factory=dict)
    contenu: Dict[str, str] = Field(default_factory=dict)
    image: Optional[str] = None
    order: int = 0
    visible: bool = True
    metadata: Dict = Field(default_factory=dict)


class DynamicPageCreate(BaseModel):
    """Create model for dynamic page"""
    slug: str
    titre: Dict[str, str] = Field(default_factory=dict)
    description: Dict[str, str] = Field(default_factory=dict)
    hero_image: Optional[str] = None
    hero_icon: Optional[str] = None
    sections: List[PageSectionCreate] = Field(default_factory=list)
    active: bool = True
    show_in_menu: bool = True
    parent_menu: Optional[str] = None
    menu_order: int = 0


class DynamicPageUpdate(BaseModel):
    """Update model for dynamic page"""
    titre: Optional[Dict[str, str]] = None
    description: Optional[Dict[str, str]] = None
    hero_image: Optional[str] = None
    hero_icon: Optional[str] = None
    sections: Optional[List[PageSectionCreate]] = None
    active: Optional[bool] = None
    show_in_menu: Optional[bool] = None
    parent_menu: Optional[str] = None
    menu_order: Optional[int] = None
