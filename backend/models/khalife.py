"""
Khalife models
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid


class Khalife(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    period: str  # e.g., "1922-1957"
    icon: str = "Crown"  # Icon name for frontend
    description: dict  # {"fr": "...", "en": "...", "ar": "...", "wo": "..."}
    contributions: Optional[dict] = None  # List of contributions in each language
    image: Optional[str] = None  # Image URL
    current: bool = False  # Is current khalife
    order: int = 0
    active: bool = True


class KhalifeCreate(BaseModel):
    name: str
    title: dict
    period: str
    icon: str = "Crown"
    description: dict
    contributions: Optional[dict] = None
    image: Optional[str] = None
    current: bool = False
    order: int = 0
    active: bool = True


class KhalifeUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[dict] = None
    period: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[dict] = None
    contributions: Optional[dict] = None
    image: Optional[str] = None
    current: Optional[bool] = None
    order: Optional[int] = None
    active: Optional[bool] = None
