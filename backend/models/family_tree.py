"""
Family Tree models
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid


class FamilyMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    node_id: str  # Unique identifier for tree structure (e.g., 'maodo', 'babacar')
    nom: str  # Full name
    surnom: Optional[str] = None  # Nickname (e.g., "Maodo", "Dabakh")
    dates: str  # e.g., "1855 - 1922"
    titre: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    image: str  # URL to image
    parent_id: Optional[str] = None  # node_id of parent (None for root)
    epouses: Optional[list] = None  # List of spouses with their children
    is_current_khalife: bool = False
    order: int = 0  # Order among siblings
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FamilyMemberCreate(BaseModel):
    node_id: str
    nom: str
    surnom: Optional[str] = None
    dates: str
    titre: dict
    image: str
    parent_id: Optional[str] = None
    epouses: Optional[list] = None
    is_current_khalife: bool = False
    order: int = 0
    active: bool = True


class FamilyMemberUpdate(BaseModel):
    nom: Optional[str] = None
    surnom: Optional[str] = None
    dates: Optional[str] = None
    titre: Optional[dict] = None
    image: Optional[str] = None
    parent_id: Optional[str] = None
    epouses: Optional[list] = None
    is_current_khalife: Optional[bool] = None
    order: Optional[int] = None
    active: Optional[bool] = None
