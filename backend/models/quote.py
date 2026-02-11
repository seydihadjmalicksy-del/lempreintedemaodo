"""
Quote models
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import uuid


class Quote(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text_fr: str
    text_en: str
    text_ar: str
    text_wo: str
    author: str = "El Hadji Malick Sy"
    context_fr: Optional[str] = None
    context_en: Optional[str] = None
    active: bool = True
    order: int = 0


class QuoteUpdate(BaseModel):
    text_fr: Optional[str] = None
    text_en: Optional[str] = None
    text_ar: Optional[str] = None
    text_wo: Optional[str] = None
    author: Optional[str] = None
    context_fr: Optional[str] = None
    context_en: Optional[str] = None
    active: Optional[bool] = None
    order: Optional[int] = None
