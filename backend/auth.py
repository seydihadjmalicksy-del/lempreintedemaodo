"""
Authentication utilities for admin access
"""
import hashlib
import secrets
import os
from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException, Header

from database import db

# Admin credentials (default password: "tivaouane2025")
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH', hashlib.sha256('tivaouane2025'.encode()).hexdigest())


def verify_password(password: str) -> bool:
    """Verify password against stored hash"""
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    return secrets.compare_digest(password_hash, ADMIN_PASSWORD_HASH)


def generate_session_token() -> str:
    """Generate a secure session token"""
    return secrets.token_urlsafe(32)


async def verify_admin_token(authorization: Optional[str] = Header(None)) -> bool:
    """Verify admin session token from Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Token d'authentification requis")
    
    # Extract token from "Bearer <token>"
    if authorization.startswith("Bearer "):
        token = authorization[7:]
    else:
        token = authorization
    
    # Check token in database
    session = await db.admin_sessions.find_one({
        "token": token,
        "expires_at": {"$gt": datetime.now(timezone.utc).isoformat()}
    })
    
    if not session:
        raise HTTPException(status_code=401, detail="Session invalide ou expirée")
    
    return True
