"""
Ouvrage models (Reference Works)
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid


# ============== OUVRAGE MAJEUR ==============
class OuvrageMajeur(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titre: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    sous_titre: Optional[str] = None  # Arabic title
    auteur: str
    date: str
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    themes: list  # List of themes
    importance: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    icon: str = "Book"  # Icon name: Book, Scroll, FileText
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OuvrageMajeurCreate(BaseModel):
    titre: dict
    sous_titre: Optional[str] = None
    auteur: str
    date: str
    description: dict
    themes: list
    importance: dict
    icon: str = "Book"
    order: int = 0
    active: bool = True


class OuvrageMajeurUpdate(BaseModel):
    titre: Optional[dict] = None
    sous_titre: Optional[str] = None
    auteur: Optional[str] = None
    date: Optional[str] = None
    description: Optional[dict] = None
    themes: Optional[list] = None
    importance: Optional[dict] = None
    icon: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== AUTRE OUVRAGE ==============
class AutreOuvrage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titre: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AutreOuvrageCreate(BaseModel):
    titre: dict
    description: dict
    order: int = 0
    active: bool = True


class AutreOuvrageUpdate(BaseModel):
    titre: Optional[dict] = None
    description: Optional[dict] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== BIBLIOTHEQUE ITEM ==============
class BibliothequeItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titre: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    taille: str  # e.g., "PDF", "Livre"
    langue: str  # e.g., "Arabe, Français"
    lien: str  # URL
    disponible: bool = True
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BibliothequeItemCreate(BaseModel):
    titre: dict
    taille: str
    langue: str
    lien: str
    disponible: bool = True
    order: int = 0
    active: bool = True


class BibliothequeItemUpdate(BaseModel):
    titre: Optional[dict] = None
    taille: Optional[str] = None
    langue: Optional[str] = None
    lien: Optional[str] = None
    disponible: Optional[bool] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== ARCHIVE ACADEMIQUE ==============
class ArchiveAcademique(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titre: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    lien: str  # URL
    source: str  # e.g., "Bibliothèque nationale de France"
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchiveAcademiqueCreate(BaseModel):
    titre: dict
    description: dict
    lien: str
    source: str
    order: int = 0
    active: bool = True


class ArchiveAcademiqueUpdate(BaseModel):
    titre: Optional[dict] = None
    description: Optional[dict] = None
    lien: Optional[str] = None
    source: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None
