"""
Archive models
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import uuid


# ============== MANUSCRIPT ==============
class ArchiveManuscript(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    date: str  # Period or date
    langue: str  # "Arabe", "Français", etc.
    lien: str  # URL to document
    type: str  # "manuscript", "treatise", etc.
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchiveManuscriptCreate(BaseModel):
    title: dict
    description: dict
    date: str
    langue: str
    lien: str
    type: str
    order: int = 0
    active: bool = True


class ArchiveManuscriptUpdate(BaseModel):
    title: Optional[dict] = None
    description: Optional[dict] = None
    date: Optional[str] = None
    langue: Optional[str] = None
    lien: Optional[str] = None
    type: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== PHOTO ==============
class ArchivePhoto(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    date: str  # Year or period
    image: str  # URL to image
    source: dict  # {"fr": "Archives familiales", "en": "Family archives", ...}
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchivePhotoCreate(BaseModel):
    title: dict
    description: dict
    date: str
    image: str
    source: dict
    order: int = 0
    active: bool = True


class ArchivePhotoUpdate(BaseModel):
    title: Optional[dict] = None
    description: Optional[dict] = None
    date: Optional[str] = None
    image: Optional[str] = None
    source: Optional[dict] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== AUDIO ==============
class ArchiveAudio(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    author: str
    duration: str
    audioUrl: str
    source: str
    coverImage: Optional[str] = None
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchiveAudioCreate(BaseModel):
    title: str
    author: str
    duration: str
    audioUrl: str
    source: str
    coverImage: Optional[str] = None
    order: int = 0
    active: bool = True


class ArchiveAudioUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    duration: Optional[str] = None
    audioUrl: Optional[str] = None
    source: Optional[str] = None
    coverImage: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== VIDEO ==============
class ArchiveVideo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    youtubeId: str
    duration: str
    views: str
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchiveVideoCreate(BaseModel):
    title: dict
    description: dict
    youtubeId: str
    duration: str
    views: str
    order: int = 0
    active: bool = True


class ArchiveVideoUpdate(BaseModel):
    title: Optional[dict] = None
    description: Optional[dict] = None
    youtubeId: Optional[str] = None
    duration: Optional[str] = None
    views: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


# ============== SOURCE ==============
class ArchiveSource(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    lien: str  # URL to the source
    source: dict  # {"fr": "BnF", "en": "National Library of France", ...}
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ArchiveSourceCreate(BaseModel):
    title: dict
    description: dict
    lien: str
    source: dict
    order: int = 0
    active: bool = True


class ArchiveSourceUpdate(BaseModel):
    title: Optional[dict] = None
    description: Optional[dict] = None
    lien: Optional[str] = None
    source: Optional[dict] = None
    order: Optional[int] = None
    active: Optional[bool] = None
