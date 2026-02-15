"""
Events routes
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone

from database import db
from models import Event, EventUpdate
from auth import verify_admin_token

router = APIRouter(prefix="/events", tags=["events"])


@router.get("")
async def get_events():
    events = await db.events.find({"active": True}, {"_id": 0}).sort("date", 1).limit(50).to_list(50)
    return {"events": events}


@router.get("/upcoming")
async def get_upcoming_events():
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    events = await db.events.find(
        {"active": True, "date": {"$gte": today}},
        {"_id": 0}
    ).sort("date", 1).limit(5).to_list(5)
    return events


@router.post("")
async def create_event(event: Event, admin: bool = Depends(verify_admin_token)):
    event_dict = event.model_dump()
    await db.events.insert_one(event_dict)
    event_dict.pop("_id", None)
    return event_dict


@router.get("/{event_id}")
async def get_event(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    return event


@router.put("/{event_id}")
async def update_event(event_id: str, event: EventUpdate, admin: bool = Depends(verify_admin_token)):
    update_data = {k: v for k, v in event.model_dump().items() if v is not None}
    if update_data:
        result = await db.events.update_one({"id": event_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Événement non trouvé")
    
    updated = await db.events.find_one({"id": event_id}, {"_id": 0})
    return updated


@router.delete("/{event_id}")
async def delete_event(event_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    return {"message": "Événement supprimé"}
