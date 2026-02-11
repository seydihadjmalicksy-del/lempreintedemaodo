"""
Family Tree routes
"""
from fastapi import APIRouter, HTTPException, Depends
import uuid

from database import db
from models import FamilyMember, FamilyMemberCreate, FamilyMemberUpdate
from auth import verify_admin_token

router = APIRouter(prefix="/family-tree", tags=["family-tree"])


@router.get("")
async def get_family_tree():
    """Get all family members"""
    members = await db.family_tree.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return {"members": members, "count": len(members)}


@router.get("/tree")
async def get_tree_structure():
    """Get family tree as hierarchical structure"""
    members = await db.family_tree.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    
    # Build tree structure
    members_by_node_id = {m["node_id"]: m for m in members}
    root = None
    
    for member in members:
        member["children"] = []
    
    for member in members:
        parent_id = member.get("parent_id")
        if parent_id and parent_id in members_by_node_id:
            members_by_node_id[parent_id]["children"].append(member)
        elif not parent_id:
            root = member
    
    return {"tree": root, "total_members": len(members)}


@router.post("")
async def create_family_member(member: FamilyMemberCreate, admin: bool = Depends(verify_admin_token)):
    """Create new family member"""
    new_member = FamilyMember(**member.model_dump())
    member_dict = new_member.model_dump()
    member_dict['created_at'] = member_dict['created_at'].isoformat()
    await db.family_tree.insert_one(member_dict)
    member_dict.pop("_id", None)
    return member_dict


@router.put("/{node_id}")
async def update_family_member(node_id: str, member: FamilyMemberUpdate, admin: bool = Depends(verify_admin_token)):
    """Update family member"""
    update_data = {k: v for k, v in member.model_dump().items() if v is not None}
    if update_data:
        result = await db.family_tree.update_one({"node_id": node_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Membre non trouvé")
    updated = await db.family_tree.find_one({"node_id": node_id}, {"_id": 0})
    return updated


@router.delete("/{node_id}")
async def delete_family_member(node_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete family member"""
    result = await db.family_tree.delete_one({"node_id": node_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Membre non trouvé")
    return {"message": "Membre supprimé"}
