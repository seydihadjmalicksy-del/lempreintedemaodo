"""
Newsletter routes
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import re

from database import db
from models import NewsletterSubscription, NewsletterSubscribe
from auth import verify_admin_token

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


def is_valid_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


@router.post("/subscribe")
async def subscribe_newsletter(subscription: NewsletterSubscribe):
    if not is_valid_email(subscription.email):
        raise HTTPException(status_code=400, detail="Email invalide")
    
    # Check if already subscribed
    existing = await db.newsletter_subscriptions.find_one({"email": subscription.email})
    
    if existing:
        if existing.get('active', True):
            return {"message": "Email déjà inscrit", "status": "already_subscribed"}
        else:
            # Reactivate subscription
            await db.newsletter_subscriptions.update_one(
                {"email": subscription.email},
                {"$set": {"active": True, "language": subscription.language}}
            )
            return {"message": "Inscription réactivée", "status": "reactivated"}
    
    # Create new subscription
    new_sub = NewsletterSubscription(
        email=subscription.email,
        language=subscription.language,
        subscribed_at=datetime.now(timezone.utc)
    )
    
    sub_dict = new_sub.model_dump()
    sub_dict['subscribed_at'] = sub_dict['subscribed_at'].isoformat()
    
    await db.newsletter_subscriptions.insert_one(sub_dict)
    
    return {"message": "Inscription réussie", "status": "subscribed"}


@router.delete("/unsubscribe/{email}")
async def unsubscribe_newsletter(email: str):
    result = await db.newsletter_subscriptions.update_one(
        {"email": email},
        {"$set": {"active": False}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Email non trouvé")
    
    return {"message": "Désinscription réussie"}


@router.get("/subscribers")
async def get_subscribers():
    total = await db.newsletter_subscriptions.count_documents({"active": True})
    
    # Count by language
    by_language = {}
    pipeline = [
        {"$match": {"active": True}},
        {"$group": {"_id": "$language", "count": {"$sum": 1}}}
    ]
    
    async for item in db.newsletter_subscriptions.aggregate(pipeline):
        by_language[item['_id']] = item['count']
    
    return {
        "total_subscribers": total,
        "total": total,
        "by_language": by_language
    }


@router.get("/subscribers/list")
async def get_subscribers_list(admin: bool = Depends(verify_admin_token)):
    """Get detailed list of all subscribers (admin only)"""
    subscribers = await db.newsletter_subscriptions.find(
        {"active": True}, 
        {"_id": 0}
    ).sort("subscribed_at", -1).to_list(500)
    
    total = await db.newsletter_subscriptions.count_documents({"active": True})
    inactive = await db.newsletter_subscriptions.count_documents({"active": False})
    
    return {
        "subscribers": subscribers,
        "total": total,
        "inactive": inactive
    }


@router.delete("/subscribers/{subscriber_id}")
async def delete_subscriber(subscriber_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete a subscriber (admin only)"""
    result = await db.newsletter_subscriptions.delete_one({"id": subscriber_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Abonné non trouvé")
    return {"message": "Abonné supprimé"}
