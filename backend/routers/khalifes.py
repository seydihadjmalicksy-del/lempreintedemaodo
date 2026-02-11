"""
Khalifes routes
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid

from database import db
from models import Khalife, KhalifeCreate, KhalifeUpdate
from auth import verify_admin_token

router = APIRouter(prefix="/khalifes", tags=["khalifes"])


@router.get("")
async def get_khalifes():
    khalifes = await db.khalifes.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return khalifes


@router.get("/current")
async def get_current_khalife():
    khalife = await db.khalifes.find_one({"current": True, "active": True}, {"_id": 0})
    if not khalife:
        raise HTTPException(status_code=404, detail="Khalife actuel non trouvé")
    return khalife


@router.get("/{khalife_id}")
async def get_khalife(khalife_id: str):
    khalife = await db.khalifes.find_one({"id": khalife_id}, {"_id": 0})
    if not khalife:
        raise HTTPException(status_code=404, detail="Khalife non trouvé")
    return khalife


@router.post("")
async def create_khalife(khalife: KhalifeCreate, admin: bool = Depends(verify_admin_token)):
    new_khalife = Khalife(**khalife.model_dump())
    khalife_dict = new_khalife.model_dump()
    await db.khalifes.insert_one(khalife_dict)
    khalife_dict.pop("_id", None)
    return khalife_dict


@router.put("/{khalife_id}")
async def update_khalife(khalife_id: str, khalife: KhalifeUpdate, admin: bool = Depends(verify_admin_token)):
    update_data = {k: v for k, v in khalife.model_dump().items() if v is not None}
    if update_data:
        result = await db.khalifes.update_one({"id": khalife_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Khalife non trouvé")
    
    updated = await db.khalifes.find_one({"id": khalife_id}, {"_id": 0})
    return updated


@router.delete("/{khalife_id}")
async def delete_khalife(khalife_id: str, admin: bool = Depends(verify_admin_token)):
    result = await db.khalifes.delete_one({"id": khalife_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Khalife non trouvé")
    return {"message": "Khalife supprimé"}
