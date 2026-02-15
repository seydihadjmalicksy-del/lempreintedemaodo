"""
Contact routes
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import re

from database import db
from models import ContactMessage, ContactCreate
from auth import verify_admin_token

router = APIRouter(prefix="/contact", tags=["contact"])


def is_valid_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


@router.post("")
async def send_contact_message(contact: ContactCreate):
    if not is_valid_email(contact.email):
        raise HTTPException(status_code=400, detail="Email invalide")
    
    if len(contact.message) < 10:
        raise HTTPException(status_code=400, detail="Message trop court (minimum 10 caractères)")
    
    new_message = ContactMessage(
        nom=contact.nom,
        email=contact.email,
        sujet=contact.sujet,
        message=contact.message,
        created_at=datetime.now(timezone.utc)
    )
    
    msg_dict = new_message.model_dump()
    msg_dict['created_at'] = msg_dict['created_at'].isoformat()
    
    await db.contact_messages.insert_one(msg_dict)
    
    return {"message": "Message envoyé avec succès", "id": new_message.id}


@router.get("/messages")
async def get_contact_messages(admin: bool = Depends(verify_admin_token)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    unread = await db.contact_messages.count_documents({"read": False})
    
    return {
        "messages": messages,
        "total": len(messages),
        "unread": unread,
        "count": len(messages)
    }


@router.get("/messages/count")
async def get_contact_messages_count():
    """Public endpoint to get just the count of messages (for admin dashboard stats)"""
    count = await db.contact_messages.count_documents({})
    return {"count": count}


@router.put("/messages/{message_id}/read")
async def mark_message_read(message_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.contact_messages.update_one(
        {"id": message_id},
        {"$set": {"read": True}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message non trouvé")
    
    return {"message": "Message marqué comme lu"}
