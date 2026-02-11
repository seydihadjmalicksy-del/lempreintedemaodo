"""
Newsletter models
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    language: str = "fr"
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True


class NewsletterSubscribe(BaseModel):
    email: str
    language: str = "fr"
