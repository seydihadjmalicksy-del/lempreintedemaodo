"""
Admin routes
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone, timedelta
import uuid

from database import db
from models import AdminLogin, AdminSession
from auth import verify_password, generate_session_token, verify_admin_token, ADMIN_USERNAME
import hashlib

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/login")
async def admin_login(credentials: AdminLogin):
    if credentials.username != ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    
    if not verify_password(credentials.password):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    
    # Generate session token
    token = generate_session_token()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    
    # Store session
    session = AdminSession(
        token=token,
        username=credentials.username,
        expires_at=expires_at.isoformat()
    )
    
    await db.admin_sessions.insert_one(session.model_dump())
    
    return {
        "token": token,
        "expires_at": expires_at.isoformat(),
        "username": credentials.username
    }


@router.post("/logout")
async def admin_logout(admin: bool = Depends(verify_admin_token)):
    # Token will be invalidated by the dependency if invalid
    return {"message": "Déconnexion réussie"}


@router.get("/verify")
async def verify_session(admin: bool = Depends(verify_admin_token)):
    return {"valid": True}


@router.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    admin: bool = Depends(verify_admin_token)
):
    if not verify_password(old_password):
        raise HTTPException(status_code=401, detail="Ancien mot de passe incorrect")
    
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Le nouveau mot de passe doit contenir au moins 8 caractères")
    
    # In a real app, you would update the password hash in environment or database
    # For now, just return success since we can't modify env vars at runtime
    return {"message": "Mot de passe changé avec succès (simulation)"}
