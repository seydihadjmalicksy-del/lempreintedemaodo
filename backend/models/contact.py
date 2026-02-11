"""
Contact models
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nom: str
    email: str
    sujet: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False


class ContactCreate(BaseModel):
    nom: str
    email: str
    sujet: str
    message: str
