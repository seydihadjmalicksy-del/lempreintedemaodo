"""
Content models for CMS
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid


class PageContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    section: str
    content_fr: str
    content_en: str
    content_ar: str
    content_wo: str
    order: int = 0
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PageContentCreate(BaseModel):
    slug: str
    section: str
    content_fr: str
    content_en: str = ""
    content_ar: str = ""
    content_wo: str = ""
    order: int = 0
    active: bool = True


class PageContentUpdate(BaseModel):
    content_fr: Optional[str] = None
    content_en: Optional[str] = None
    content_ar: Optional[str] = None
    content_wo: Optional[str] = None
    order: Optional[int] = None
    active: Optional[bool] = None


class SearchResult(BaseModel):
    type: str
    title: str
    description: str
    url: str
    score: float = 1.0
    image: Optional[str] = None
