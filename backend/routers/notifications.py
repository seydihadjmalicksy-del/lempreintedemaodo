"""
Notifications routes (Push notifications)
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone

from database import db
from models import PushSubscription, NotificationPreferences
from auth import verify_admin_token

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.post("/subscribe")
async def subscribe_notifications(subscription: PushSubscription):
    """Subscribe to push notifications"""
    # Check if already subscribed
    existing = await db.push_subscriptions.find_one({"endpoint": subscription.endpoint})
    
    if existing:
        # Update existing subscription
        await db.push_subscriptions.update_one(
            {"endpoint": subscription.endpoint},
            {"$set": {
                "keys": subscription.keys,
                "user_agent": subscription.user_agent,
                "active": True,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        return {"message": "Subscription updated", "status": "updated"}
    
    # Create new subscription
    sub_data = subscription.model_dump()
    sub_data["active"] = True
    sub_data["created_at"] = datetime.now(timezone.utc).isoformat()
    sub_data["preferences"] = {
        "events": True,
        "quotes": True,
        "news": True,
        "language": "fr"
    }
    
    await db.push_subscriptions.insert_one(sub_data)
    
    return {"message": "Subscription created", "status": "subscribed"}


@router.post("/unsubscribe")
async def unsubscribe_notifications(endpoint: str):
    """Unsubscribe from push notifications"""
    result = await db.push_subscriptions.update_one(
        {"endpoint": endpoint},
        {"$set": {"active": False}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subscription non trouvée")
    
    return {"message": "Unsubscribed successfully"}


@router.put("/preferences")
async def update_preferences(endpoint: str, preferences: NotificationPreferences):
    """Update notification preferences"""
    result = await db.push_subscriptions.update_one(
        {"endpoint": endpoint},
        {"$set": {"preferences": preferences.model_dump()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subscription non trouvée")
    
    return {"message": "Preferences updated"}


@router.get("/stats")
async def get_notification_stats(admin: bool = Depends(verify_admin_token)):
    """Get notification statistics"""
    total = await db.push_subscriptions.count_documents({"active": True})
    
    # Count by language
    by_language = {}
    pipeline = [
        {"$match": {"active": True}},
        {"$group": {"_id": "$preferences.language", "count": {"$sum": 1}}}
    ]
    
    async for item in db.push_subscriptions.aggregate(pipeline):
        lang = item["_id"] or "fr"
        by_language[lang] = item["count"]
    
    return {
        "total_subscribers": total,
        "by_language": by_language
    }
