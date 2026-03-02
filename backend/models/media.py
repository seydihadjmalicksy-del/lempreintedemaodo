"""
Media Management Models
Modèles pour la gestion des fichiers (PDF, images, audio, vidéo)
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid


# ============== MEDIA FILE ==============
class MediaFile(BaseModel):
    """Représente un fichier média uploadé"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str  # Nom original du fichier
    stored_filename: str  # Nom stocké sur le serveur
    file_type: str  # "pdf", "image", "audio", "video"
    mime_type: str  # "application/pdf", "image/jpeg", etc.
    file_size: int  # Taille en bytes
    file_url: str  # URL pour accéder au fichier
    thumbnail_url: Optional[str] = None  # Miniature pour images/vidéos
    title: dict = Field(default_factory=dict)  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict = Field(default_factory=dict)  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    tags: List[str] = Field(default_factory=list)  # Tags pour catégorisation
    duration: Optional[str] = None  # Pour audio/vidéo
    dimensions: Optional[dict] = None  # {"width": 1920, "height": 1080} pour images/vidéos
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MediaFileCreate(BaseModel):
    """Création d'un fichier média"""
    filename: str
    stored_filename: str
    file_type: str
    mime_type: str
    file_size: int
    file_url: str
    thumbnail_url: Optional[str] = None
    title: dict = Field(default_factory=dict)
    description: dict = Field(default_factory=dict)
    tags: List[str] = Field(default_factory=list)
    duration: Optional[str] = None
    dimensions: Optional[dict] = None
    active: bool = True


class MediaFileUpdate(BaseModel):
    """Mise à jour d'un fichier média"""
    title: Optional[dict] = None
    description: Optional[dict] = None
    tags: Optional[List[str]] = None
    duration: Optional[str] = None
    active: Optional[bool] = None


# ============== PAGE MEDIA ASSOCIATION ==============
class PageMediaAssociation(BaseModel):
    """Association entre un fichier média et une page"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    media_id: str  # ID du fichier média
    page_slug: str  # Slug de la page (ex: "accueil", "heritiers", "archives", etc.)
    section: Optional[str] = None  # Section spécifique dans la page
    display_order: int = 0  # Ordre d'affichage
    display_settings: dict = Field(default_factory=dict)  # {"size": "full", "caption": true, etc.}
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PageMediaAssociationCreate(BaseModel):
    """Création d'une association page-média"""
    media_id: str
    page_slug: str
    section: Optional[str] = None
    display_order: int = 0
    display_settings: dict = Field(default_factory=dict)
    active: bool = True


class PageMediaAssociationUpdate(BaseModel):
    """Mise à jour d'une association"""
    section: Optional[str] = None
    display_order: Optional[int] = None
    display_settings: Optional[dict] = None
    active: Optional[bool] = None


# ============== TAG ==============
class MediaTag(BaseModel):
    """Tag pour organiser les fichiers"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # Nom du tag (unique)
    color: str = "#D4AF37"  # Couleur pour l'affichage
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MediaTagCreate(BaseModel):
    """Création d'un tag"""
    name: str
    color: str = "#D4AF37"
    description: Optional[str] = None


class MediaTagUpdate(BaseModel):
    """Mise à jour d'un tag"""
    name: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None


# ============== RESPONSE MODELS ==============
class MediaFileWithAssociations(BaseModel):
    """Fichier média avec ses associations"""
    file: MediaFile
    associations: List[PageMediaAssociation] = Field(default_factory=list)
    pages: List[str] = Field(default_factory=list)  # Liste des slugs de pages


class PageMediaResponse(BaseModel):
    """Réponse pour les médias d'une page"""
    page_slug: str
    media_files: List[dict] = Field(default_factory=list)  # Fichiers avec display_order


# Available pages for associations
AVAILABLE_PAGES = [
    {"slug": "accueil", "name": {"fr": "Accueil", "en": "Home"}},
    {"slug": "heritiers", "name": {"fr": "Héritiers", "en": "Heirs"}},
    {"slug": "archives", "name": {"fr": "Archives", "en": "Archives"}},
    {"slug": "mediatheque", "name": {"fr": "Médiathèque", "en": "Media Library"}},
    {"slug": "arbre", "name": {"fr": "Arbre Généalogique", "en": "Family Tree"}},
    {"slug": "ouvrages", "name": {"fr": "Ouvrages", "en": "Books"}},
    {"slug": "histoire/origines", "name": {"fr": "Les Origines", "en": "Origins"}},
    {"slug": "histoire/maodo", "name": {"fr": "El Hadji Malick Sy", "en": "El Hadji Malick Sy"}},
    {"slug": "histoire/khalifes", "name": {"fr": "Les Khalifes", "en": "The Khalifs"}},
    {"slug": "histoire/geographie", "name": {"fr": "Géographie Sacrée", "en": "Sacred Geography"}},
    {"slug": "enseignements/piliers", "name": {"fr": "Les Piliers", "en": "The Pillars"}},
    {"slug": "enseignements/ecole", "name": {"fr": "L'École de Tivaouane", "en": "School of Tivaouane"}},
    {"slug": "evenements/gamou", "name": {"fr": "Le Gamou", "en": "The Gamou"}},
    {"slug": "evenements/ziarra", "name": {"fr": "Les Ziarra", "en": "The Ziarra"}},
    {"slug": "evenements/ceremonies", "name": {"fr": "Cérémonies", "en": "Ceremonies"}},
    {"slug": "wattu", "name": {"fr": "Wattu", "en": "Wattu"}},
    {"slug": "contact", "name": {"fr": "Contact", "en": "Contact"}},
]

# File type configurations
FILE_TYPE_CONFIG = {
    "pdf": {
        "extensions": [".pdf"],
        "mime_types": ["application/pdf"],
        "max_size": 10 * 1024 * 1024,  # 10 MB
        "icon": "FileText"
    },
    "image": {
        "extensions": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        "mime_types": ["image/jpeg", "image/png", "image/gif", "image/webp"],
        "max_size": 10 * 1024 * 1024,  # 10 MB
        "icon": "Image"
    },
    "audio": {
        "extensions": [".mp3", ".wav", ".ogg", ".m4a"],
        "mime_types": ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
        "max_size": 10 * 1024 * 1024,  # 10 MB
        "icon": "Music"
    },
    "video": {
        "extensions": [".mp4", ".webm", ".mov"],
        "mime_types": ["video/mp4", "video/webm", "video/quicktime"],
        "max_size": 10 * 1024 * 1024,  # 10 MB
        "icon": "Video"
    }
}
