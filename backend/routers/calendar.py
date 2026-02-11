"""
Calendar routes (iCal export)
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from datetime import datetime, timezone
from ics import Calendar, Event as ICSEvent

from database import db

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("/events.ics")
async def export_calendar():
    """Export all events as iCal file"""
    cal = Calendar()
    
    events = await db.events.find({"active": True}, {"_id": 0}).to_list(1000)
    
    for event in events:
        ics_event = ICSEvent()
        ics_event.name = event.get("name_fr", "Événement")
        ics_event.description = event.get("description_fr", "")
        ics_event.location = event.get("location", "Tivaouane")
        
        # Parse date
        try:
            event_date = datetime.strptime(event.get("date", "2025-01-01"), "%Y-%m-%d")
            ics_event.begin = event_date
        except:
            continue
        
        cal.events.add(ics_event)
    
    return Response(
        content=str(cal),
        media_type="text/calendar",
        headers={
            "Content-Disposition": "attachment; filename=tariqa-tidiane-events.ics"
        }
    )


@router.get("/event/{event_id}.ics")
async def export_single_event(event_id: str):
    """Export single event as iCal file"""
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    
    if not event:
        raise HTTPException(status_code=404, detail="Événement non trouvé")
    
    cal = Calendar()
    ics_event = ICSEvent()
    ics_event.name = event.get("name_fr", "Événement")
    ics_event.description = event.get("description_fr", "")
    ics_event.location = event.get("location", "Tivaouane")
    
    try:
        event_date = datetime.strptime(event.get("date", "2025-01-01"), "%Y-%m-%d")
        ics_event.begin = event_date
    except:
        pass
    
    cal.events.add(ics_event)
    
    return Response(
        content=str(cal),
        media_type="text/calendar",
        headers={
            "Content-Disposition": f"attachment; filename=event-{event_id}.ics"
        }
    )
