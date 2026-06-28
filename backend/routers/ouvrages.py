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
    items = await db.ouvrages_majeurs.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(200)
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
    items = await db.autres_ouvrages.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(200)
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
    items = await db.bibliotheque.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(200)
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
    items = await db.archives_academiques.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(200)
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
            # Local file - try to read from frontend/public directory
            local_path = f"/app/frontend/public{pdf_url}"
            if os.path.exists(local_path):
                with open(local_path, 'rb') as f:
                    pdf_content = f.read()
            else:
                # In production, local files may not exist - return a helpful error
                raise HTTPException(
                    status_code=404, 
                    detail="Ce document n'est pas disponible en téléchargement direct. Veuillez contacter l'administrateur."
                )
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


# ============== BIBLIOTHÈQUE DYNAMIQUE EXTERNE ==============
# Configuration de la source externe
EXTERNAL_LIBRARY_BASE_URL = "https://static-assets-fix-2.preview.emergentagent.com"
EXTERNAL_LIBRARY_PATH = "/enseignements/ouvrages"

# Cache simple en mémoire avec TTL
import time
_library_cache = {"data": None, "timestamp": 0}
CACHE_TTL = 300  # 5 minutes en secondes

def get_file_info(filename: str) -> dict:
    """Extract file information from filename"""
    import os
    name, ext = os.path.splitext(filename)
    ext = ext.lower().lstrip('.')
    
    # Map extensions to formats
    format_map = {
        'pdf': 'PDF',
        'doc': 'Word',
        'docx': 'Word',
        'txt': 'Texte',
        'jpg': 'Image',
        'jpeg': 'Image',
        'png': 'Image',
        'gif': 'Image',
        'mp3': 'Audio',
        'mp4': 'Vidéo',
        'zip': 'Archive'
    }
    
    return {
        "filename": filename,
        "title": name.replace('_', ' ').replace('-', ' ').title(),
        "format": format_map.get(ext, ext.upper()),
        "extension": ext,
        "is_previewable": ext in ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt']
    }


@router.get("/external-library")
async def get_external_library():
    """
    Récupère dynamiquement la liste des fichiers depuis une source externe.
    Utilise un cache pour limiter les appels.
    """
    global _library_cache
    
    current_time = time.time()
    
    # Vérifier le cache
    if _library_cache["data"] and (current_time - _library_cache["timestamp"]) < CACHE_TTL:
        return _library_cache["data"]
    
    try:
        # Récupérer la liste des fichiers depuis la base de données
        # (configurée via admin ou stockée en DB)
        files_from_db = await db.external_library_files.find(
            {"active": True}, 
            {"_id": 0}
        ).sort("order", 1).to_list(500)
        
        if files_from_db:
            result = {
                "source": "database",
                "base_url": EXTERNAL_LIBRARY_BASE_URL,
                "files": files_from_db,
                "total": len(files_from_db),
                "cache_ttl": CACHE_TTL
            }
        else:
            # Si pas de fichiers en DB, retourner un résultat vide avec instructions
            result = {
                "source": "database",
                "base_url": EXTERNAL_LIBRARY_BASE_URL,
                "files": [],
                "total": 0,
                "message": "Aucun fichier configuré. Utilisez l'admin pour ajouter des fichiers.",
                "cache_ttl": CACHE_TTL
            }
        
        # Mettre en cache
        _library_cache = {"data": result, "timestamp": current_time}
        
        return result
        
    except Exception as e:
        # En cas d'erreur, retourner les données en cache si disponibles
        if _library_cache["data"]:
            return _library_cache["data"]
        
        raise HTTPException(
            status_code=503, 
            detail=f"Service temporairement indisponible: {str(e)}"
        )


@router.post("/external-library/files")
async def add_external_library_file(
    file_data: dict,
    admin: bool = Depends(verify_admin_token)
):
    """Ajouter un fichier à la bibliothèque externe (admin)"""
    file_id = str(uuid.uuid4())
    
    file_doc = {
        "id": file_id,
        "filename": file_data.get("filename"),
        "title": file_data.get("title", file_data.get("filename", "").replace('_', ' ').replace('-', ' ').title()),
        "description": file_data.get("description", ""),
        "url": file_data.get("url"),
        "format": file_data.get("format", "PDF"),
        "extension": file_data.get("extension", "pdf"),
        "size": file_data.get("size", ""),
        "language": file_data.get("language", "Arabe"),
        "is_previewable": file_data.get("is_previewable", True),
        "order": file_data.get("order", 0),
        "active": True
    }
    
    await db.external_library_files.insert_one(file_doc)
    
    # Invalider le cache
    global _library_cache
    _library_cache = {"data": None, "timestamp": 0}
    
    file_doc.pop("_id", None)
    return file_doc


@router.put("/external-library/files/{file_id}")
async def update_external_library_file(
    file_id: str,
    file_data: dict,
    admin: bool = Depends(verify_admin_token)
):
    """Mettre à jour un fichier de la bibliothèque externe (admin)"""
    update_data = {k: v for k, v in file_data.items() if v is not None}
    
    if update_data:
        result = await db.external_library_files.update_one(
            {"id": file_id}, 
            {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    # Invalider le cache
    global _library_cache
    _library_cache = {"data": None, "timestamp": 0}
    
    updated = await db.external_library_files.find_one({"id": file_id}, {"_id": 0})
    return updated


@router.delete("/external-library/files/{file_id}")
async def delete_external_library_file(
    file_id: str,
    admin: bool = Depends(verify_admin_token)
):
    """Supprimer un fichier de la bibliothèque externe (admin)"""
    # Find the file first
    file_doc = await db.external_library_files.find_one({"id": file_id}, {"_id": 0})
    
    if not file_doc:
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    # Delete physical file if it exists
    stored_filename = file_doc.get("stored_filename")
    if stored_filename:
        file_path = LIBRARY_UPLOAD_DIR / stored_filename
        if file_path.exists():
            file_path.unlink()
    
    # Delete from database
    result = await db.external_library_files.delete_one({"id": file_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    # Invalidate cache
    global _library_cache
    _library_cache = {"data": None, "timestamp": 0}
    
    return {"message": "Fichier supprimé"}


@router.get("/external-library/proxy/{file_id}")
async def proxy_external_file(file_id: str):
    """
    Proxy pour télécharger un fichier depuis la source externe.
    Permet de sécuriser les URLs et d'ajouter des headers appropriés.
    """
    # Récupérer les infos du fichier depuis la DB
    file_doc = await db.external_library_files.find_one({"id": file_id}, {"_id": 0})
    
    if not file_doc:
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    file_url = file_doc.get("url")
    if not file_url:
        raise HTTPException(status_code=404, detail="URL du fichier non configurée")
    
    try:
        async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as client:
            response = await client.get(file_url)
            response.raise_for_status()
            
            content = response.content
            
            # Déterminer le content-type
            extension = file_doc.get("extension", "pdf").lower()
            content_type_map = {
                'pdf': 'application/pdf',
                'doc': 'application/msword',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'txt': 'text/plain',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'mp3': 'audio/mpeg',
                'mp4': 'video/mp4'
            }
            content_type = content_type_map.get(extension, 'application/octet-stream')
            
            filename = file_doc.get("filename", f"document.{extension}")
            
            return StreamingResponse(
                io.BytesIO(content),
                media_type=content_type,
                headers={
                    "Content-Disposition": f'inline; filename="{filename}"',
                    "Content-Type": content_type,
                    "Content-Length": str(len(content))
                }
            )
            
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Fichier non accessible")
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Erreur de connexion: {str(e)}")


@router.post("/external-library/clear-cache")
async def clear_external_library_cache(admin: bool = Depends(verify_admin_token)):
    """Vider le cache de la bibliothèque externe (admin)"""
    global _library_cache
    _library_cache = {"data": None, "timestamp": 0}
    return {"message": "Cache vidé"}


# ============== PDF UPLOAD FOR EXTERNAL LIBRARY ==============
from fastapi import UploadFile, File, Form
from pathlib import Path

LIBRARY_UPLOAD_DIR = Path("/tmp/library_uploads")
LIBRARY_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/external-library/upload")
async def upload_library_pdf(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    language: str = Form("Arabe"),
    order: int = Form(0),
    admin: bool = Depends(verify_admin_token)
):
    """Upload a PDF file to the digital library"""
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Seuls les fichiers PDF sont acceptés")
    
    if file.content_type and file.content_type != 'application/pdf':
        raise HTTPException(status_code=400, detail="Type de fichier invalide")
    
    # Read and validate content
    content = await file.read()
    file_size = len(content)
    
    # Max 50MB
    if file_size > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Fichier trop volumineux (max 50 MB)")
    
    # Validate PDF magic bytes
    if not content[:5].startswith(b'%PDF-'):
        raise HTTPException(status_code=400, detail="Le fichier n'est pas un PDF valide")
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    stored_filename = f"{file_id}.pdf"
    file_path = LIBRARY_UPLOAD_DIR / stored_filename
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Calculate size string
    size_mb = file_size / (1024 * 1024)
    size_str = f"{size_mb:.1f} MB" if size_mb >= 1 else f"{file_size / 1024:.0f} KB"
    
    # Create database record
    file_doc = {
        "id": file_id,
        "filename": file.filename,
        "stored_filename": stored_filename,
        "title": title,
        "description": description,
        "url": f"/api/ouvrages/external-library/serve/{file_id}",  # Internal URL
        "format": "PDF",
        "extension": "pdf",
        "size": size_str,
        "file_size_bytes": file_size,
        "language": language,
        "is_previewable": True,
        "order": order,
        "active": True,
        "uploaded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
    
    await db.external_library_files.insert_one(file_doc)
    
    # Invalidate cache
    global _library_cache
    _library_cache = {"data": None, "timestamp": 0}
    
    file_doc.pop("_id", None)
    return file_doc


@router.get("/external-library/serve/{file_id}")
async def serve_library_file(file_id: str):
    """Serve a PDF file from the library (for viewing)"""
    file_doc = await db.external_library_files.find_one({"id": file_id}, {"_id": 0})
    
    if not file_doc:
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    stored_filename = file_doc.get("stored_filename")
    if not stored_filename:
        # Fallback to proxy for old external URLs
        return await proxy_external_file(file_id)
    
    file_path = LIBRARY_UPLOAD_DIR / stored_filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Fichier non trouvé sur le serveur")
    
    # Read file content
    with open(file_path, "rb") as f:
        content = f.read()
    
    filename = file_doc.get("filename", "document.pdf")
    
    return StreamingResponse(
        io.BytesIO(content),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="{filename}"',
            "Content-Type": "application/pdf",
            "Content-Length": str(len(content))
        }
    )


@router.get("/external-library/download/{file_id}")
async def download_library_file(file_id: str):
    """Download a PDF file from the library (forces download)"""
    file_doc = await db.external_library_files.find_one({"id": file_id}, {"_id": 0})
    
    if not file_doc:
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    
    stored_filename = file_doc.get("stored_filename")
    if not stored_filename:
        # Fallback to proxy for old external URLs
        return await proxy_external_file(file_id)
    
    file_path = LIBRARY_UPLOAD_DIR / stored_filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Fichier non trouvé sur le serveur")
    
    # Read file content
    with open(file_path, "rb") as f:
        content = f.read()
    
    filename = file_doc.get("filename", "document.pdf")
    
    return StreamingResponse(
        io.BytesIO(content),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "application/pdf",
            "Content-Length": str(len(content))
        }
    )
