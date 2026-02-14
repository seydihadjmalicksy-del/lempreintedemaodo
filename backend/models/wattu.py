"""
Wattu (Opinions) models
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime, timezone
import uuid


class WattuArticle(BaseModel):
    """Opinion article model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titre: Dict[str, str] = Field(default_factory=dict)  # Multilingual title
    contenu: Dict[str, str] = Field(default_factory=dict)  # Multilingual content
    auteur: str = ""
    image: Optional[str] = None
    categorie: str = "general"  # general, spirituel, actualite, reflexion
    date_publication: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    active: bool = True
    featured: bool = False
    order: int = 0
    tags: list = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WattuArticleCreate(BaseModel):
    """Create model for Wattu article"""
    titre: Dict[str, str] = Field(default_factory=dict)
    contenu: Dict[str, str] = Field(default_factory=dict)
    auteur: str = ""
    image: Optional[str] = None
    categorie: str = "general"
    active: bool = True
    featured: bool = False
    order: int = 0
    tags: list = Field(default_factory=list)


class WattuArticleUpdate(BaseModel):
    """Update model for Wattu article"""
    titre: Optional[Dict[str, str]] = None
    contenu: Optional[Dict[str, str]] = None
    auteur: Optional[str] = None
    image: Optional[str] = None
    categorie: Optional[str] = None
    date_publication: Optional[str] = None
    active: Optional[bool] = None
    featured: Optional[bool] = None
    order: Optional[int] = None
    tags: Optional[list] = None
