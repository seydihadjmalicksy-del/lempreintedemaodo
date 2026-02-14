"""
Ouvrages (Reference Works) routes
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import uuid
import os
import io
import httpx

from database import db
from models import (
    OuvrageMajeur, OuvrageMajeurCreate, OuvrageMajeurUpdate,
    AutreOuvrage, AutreOuvrageCreate, AutreOuvrageUpdate,
    BibliothequeItem, BibliothequeItemCreate, BibliothequeItemUpdate,
    ArchiveAcademique, ArchiveAcademiqueCreate, ArchiveAcademiqueUpdate
)
from auth import verify_admin_token

router = APIRouter(prefix="/ouvrages", tags=["ouvrages"])


# ============== OUVRAGES MAJEURS ==============
@router.get("/majeurs")
async def get_ouvrages_majeurs():
    """Get all major works"""
    items = await db.ouvrages_majeurs.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@router.post("/majeurs")
async def create_ouvrage_majeur(item: OuvrageMajeurCreate, admin: bool = Depends(verify_admin_token)):
    """Create a new major work"""
    new_item = OuvrageMajeur(**item.model_dump())
    item_dict = new_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.ouvrages_majeurs.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/majeurs/{item_id}")
async def update_ouvrage_majeur(item_id: str, item: OuvrageMajeurUpdate, admin: bool = Depends(verify_admin_token)):
    """Update a major work"""
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.ouvrages_majeurs.update_one({"id": item_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Ouvrage non trouvé")
    updated = await db.ouvrages_majeurs.find_one({"id": item_id}, {"_id": 0})
    return updated


@router.delete("/majeurs/{item_id}")
async def delete_ouvrage_majeur(item_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete a major work"""
    result = await db.ouvrages_majeurs.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ouvrage non trouvé")
    return {"message": "Ouvrage supprimé avec succès"}


# ============== AUTRES OUVRAGES ==============
@router.get("/autres")
async def get_autres_ouvrages():
    """Get all other works"""
    items = await db.autres_ouvrages.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@router.post("/autres")
async def create_autre_ouvrage(item: AutreOuvrageCreate, admin: bool = Depends(verify_admin_token)):
    """Create a new other work"""
    new_item = AutreOuvrage(**item.model_dump())
    item_dict = new_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.autres_ouvrages.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/autres/{item_id}")
async def update_autre_ouvrage(item_id: str, item: AutreOuvrageUpdate, admin: bool = Depends(verify_admin_token)):
    """Update an other work"""
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.autres_ouvrages.update_one({"id": item_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Ouvrage non trouvé")
    updated = await db.autres_ouvrages.find_one({"id": item_id}, {"_id": 0})
    return updated


@router.delete("/autres/{item_id}")
async def delete_autre_ouvrage(item_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete an other work"""
    result = await db.autres_ouvrages.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ouvrage non trouvé")
    return {"message": "Ouvrage supprimé avec succès"}


# ============== BIBLIOTHEQUE NUMERIQUE ==============
@router.get("/bibliotheque")
async def get_bibliotheque():
    """Get all digital library items"""
    items = await db.bibliotheque.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@router.post("/bibliotheque")
async def create_bibliotheque_item(item: BibliothequeItemCreate, admin: bool = Depends(verify_admin_token)):
    """Create a new digital library item"""
    new_item = BibliothequeItem(**item.model_dump())
    item_dict = new_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.bibliotheque.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/bibliotheque/{item_id}")
async def update_bibliotheque_item(item_id: str, item: BibliothequeItemUpdate, admin: bool = Depends(verify_admin_token)):
    """Update a digital library item"""
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.bibliotheque.update_one({"id": item_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Document non trouvé")
    updated = await db.bibliotheque.find_one({"id": item_id}, {"_id": 0})
    return updated


@router.delete("/bibliotheque/{item_id}")
async def delete_bibliotheque_item(item_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete a digital library item"""
    result = await db.bibliotheque.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    return {"message": "Document supprimé avec succès"}


@router.post("/bibliotheque/import-batch")
async def import_bibliotheque_batch(items: list, admin: bool = Depends(verify_admin_token)):
    """Import multiple digital library items at once (skip existing)"""
    imported_count = 0
    skipped_count = 0
    
    for item_data in items:
        # Check if already exists by lien
        existing = await db.bibliotheque.find_one({"lien": item_data.get("lien")})
        if existing:
            skipped_count += 1
            continue
        
        # Ensure required fields
        if "id" not in item_data:
            item_data["id"] = str(uuid.uuid4())
        if "active" not in item_data:
            item_data["active"] = True
        
        await db.bibliotheque.insert_one(item_data)
        imported_count += 1
    
    return {
        "message": f"Import terminé: {imported_count} ajoutés, {skipped_count} ignorés (déjà existants)",
        "imported": imported_count,
        "skipped": skipped_count
    }


# ============== ARCHIVES ACADEMIQUES ==============
@router.get("/archives-academiques")
async def get_archives_academiques():
    """Get all academic archives"""
    items = await db.archives_academiques.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items


@router.post("/archives-academiques")
async def create_archive_academique(item: ArchiveAcademiqueCreate, admin: bool = Depends(verify_admin_token)):
    """Create a new academic archive"""
    new_item = ArchiveAcademique(**item.model_dump())
    item_dict = new_item.model_dump()
    item_dict['created_at'] = item_dict['created_at'].isoformat()
    await db.archives_academiques.insert_one(item_dict)
    item_dict.pop("_id", None)
    return item_dict


@router.put("/archives-academiques/{item_id}")
async def update_archive_academique(item_id: str, item: ArchiveAcademiqueUpdate, admin: bool = Depends(verify_admin_token)):
    """Update an academic archive"""
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if update_data:
        result = await db.archives_academiques.update_one({"id": item_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Archive non trouvée")
    updated = await db.archives_academiques.find_one({"id": item_id}, {"_id": 0})
    return updated


@router.delete("/archives-academiques/{item_id}")
async def delete_archive_academique(item_id: str, admin: bool = Depends(verify_admin_token)):
    """Delete an academic archive"""
    result = await db.archives_academiques.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Archive non trouvée")
    return {"message": "Archive supprimée avec succès"}


# ============== STATS ==============
@router.get("/stats")
async def get_ouvrages_stats():
    """Get statistics for all ouvrages collections"""
    majeurs_count = await db.ouvrages_majeurs.count_documents({"active": True})
    autres_count = await db.autres_ouvrages.count_documents({"active": True})
    bibliotheque_count = await db.bibliotheque.count_documents({"active": True})
    archives_count = await db.archives_academiques.count_documents({"active": True})
    
    return {
        "ouvrages_majeurs": majeurs_count,
        "autres_ouvrages": autres_count,
        "bibliotheque": bibliotheque_count,
        "archives_academiques": archives_count,
        "total": majeurs_count + autres_count + bibliotheque_count + archives_count
    }


# ============== PDF DOWNLOAD ==============
@router.get("/download/{item_id}")
async def download_pdf(item_id: str):
    """Download a PDF directly without watermark"""
    # Find the item in bibliotheque
    item = await db.bibliotheque.find_one({"id": item_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    
    pdf_url = item.get("lien")
    if not pdf_url:
        raise HTTPException(status_code=404, detail="Lien du document non disponible")
    
    # Get the title for filename
    title = item.get("titre", {})
    filename = title.get("fr", title.get("ar", "document")) if isinstance(title, dict) else str(title)
    filename = "".join(c for c in filename if c.isalnum() or c in (' ', '-', '_')).strip()
    filename = filename[:50] or "document"  # Limit filename length
    
    try:
        # Check if this is a local file or external URL
        if pdf_url.startswith('/ouvrages/'):
            # Local file - read from frontend/public directory
            local_path = f"/app/frontend/public{pdf_url}"
            if not os.path.exists(local_path):
                raise HTTPException(status_code=404, detail=f"Fichier local non trouvé: {pdf_url}")
            with open(local_path, 'rb') as f:
                pdf_content = f.read()
        elif pdf_url.startswith('http://') or pdf_url.startswith('https://'):
            # External URL - fetch via HTTP
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.get(pdf_url, follow_redirects=True)
                if response.status_code != 200:
                    raise HTTPException(status_code=404, detail="Impossible de télécharger le PDF original")
                pdf_content = response.content
        else:
            # Unknown format - try as external URL with https
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.get(f"https://{pdf_url}", follow_redirects=True)
                if response.status_code != 200:
                    raise HTTPException(status_code=404, detail="Impossible de télécharger le PDF")
                pdf_content = response.content
        
        # Return PDF directly without watermark
        return StreamingResponse(
            io.BytesIO(pdf_content),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}.pdf"',
                "Content-Type": "application/pdf"
            }
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du téléchargement: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement: {str(e)}")
