"""
Admin models
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid


class AdminLogin(BaseModel):
    username: str
    password: str


class AdminSession(BaseModel):
    token: str
    username: str
    expires_at: str


class PushSubscription(BaseModel):
    endpoint: str
    keys: dict
    user_agent: Optional[str] = None


class NotificationPreferences(BaseModel):
    events: bool = True
    quotes: bool = True
    news: bool = True
    language: str = "fr"
