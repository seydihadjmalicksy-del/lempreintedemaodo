"""
Event models
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, timezone
import uuid


class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name_fr: str
    name_en: str
    name_ar: str
    name_wo: str
    description_fr: str
    description_en: str
    description_ar: str
    description_wo: str
    date: str
    location: str
    event_type: str
    recurring: bool = False
    recurrence_pattern: Optional[str] = None
    active: bool = True


class EventUpdate(BaseModel):
    name_fr: Optional[str] = None
    name_en: Optional[str] = None
    name_ar: Optional[str] = None
    name_wo: Optional[str] = None
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    description_ar: Optional[str] = None
    description_wo: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    event_type: Optional[str] = None
    recurring: Optional[bool] = None
    recurrence_pattern: Optional[str] = None
    active: Optional[bool] = None
