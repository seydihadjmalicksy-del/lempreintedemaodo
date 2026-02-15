"""
Quotes routes
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
import random

from database import db
from models import Quote, QuoteUpdate
from auth import verify_admin_token

router = APIRouter(prefix="/quotes", tags=["quotes"])


@router.get("")
async def get_quotes():
    quotes = await db.quotes.find({"active": True}, {"_id": 0}).sort("order", 1).limit(100).to_list(100)
    return {"quotes": quotes}


@router.get("/daily")
async def get_daily_quote():
    quotes = await db.quotes.find({"active": True}, {"_id": 0}).limit(365).to_list(365)
    if not quotes:
        return {
            "text_fr": "La science est une lumière que Dieu place dans le cœur de qui Il veut.",
            "text_en": "Knowledge is a light that God places in the heart of whom He wills.",
            "text_ar": "العلم نور يقذفه الله في قلب من يشاء",
            "text_wo": "Xam-xam dafa mel ni leer, Yàlla mooy ko def ci xolu kou ko soob.",
            "author": "El Hadji Malick Sy"
        }
    
    # Use day of year to get consistent quote for the day
    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    index = day_of_year % len(quotes)
    return quotes[index]


@router.post("")
async def create_quote(quote: Quote, admin: bool = Depends(verify_admin_token)):
    quote_dict = quote.model_dump()
    await db.quotes.insert_one(quote_dict)
    quote_dict.pop("_id", None)
    return quote_dict


@router.get("/{quote_id}")
async def get_quote(quote_id: str):
    quote = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    if not quote:
        raise HTTPException(status_code=404, detail="Citation non trouvée")
    return quote


@router.put("/{quote_id}")
async def update_quote(quote_id: str, quote: QuoteUpdate, admin: bool = Depends(verify_admin_token)):
    update_data = {k: v for k, v in quote.model_dump().items() if v is not None}
    if update_data:
        result = await db.quotes.update_one({"id": quote_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Citation non trouvée")
    
    updated = await db.quotes.find_one({"id": quote_id}, {"_id": 0})
    return updated


@router.delete("/{quote_id}")
async def delete_quote(quote_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.quotes.delete_one({"id": quote_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Citation non trouvée")
    return {"message": "Citation supprimée"}
