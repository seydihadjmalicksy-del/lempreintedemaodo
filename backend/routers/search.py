"""
Search routes - Global search across all content
"""
from fastapi import APIRouter, Query
from typing import List, Optional
from database import db
from models import SearchResult

router = APIRouter(prefix="/search", tags=["search"])


def normalize_text(text: str) -> str:
    """Normalize text for search (lowercase, remove accents)"""
    if not text:
        return ""
    text = text.lower()
    replacements = {
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'à': 'a', 'â': 'a', 'ä': 'a',
        'ù': 'u', 'û': 'u', 'ü': 'u',
        'ô': 'o', 'ö': 'o',
        'î': 'i', 'ï': 'i',
        'ç': 'c', 'œ': 'oe', 'æ': 'ae'
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text


def get_localized_text(obj, lang='fr'):
    """Extract localized text from multilingual object"""
    if not obj:
        return ""
    if isinstance(obj, str):
        return obj
    if isinstance(obj, dict):
        return obj.get(lang) or obj.get('fr') or next(iter(obj.values()), "")
    return str(obj)


@router.get("")
async def search(q: str, lang: str = "fr"):
    """Global search across all content"""
    if not q or len(q) < 2:
        return {"results": [], "total": 0, "query": q}
    
    results = []
    search_pattern = {"$regex": q, "$options": "i"}
    
    # Search in Bibliotheque (Ouvrages/PDFs)
    try:
        ouvrages = await db.bibliotheque.find({
            "$or": [
                {"titre.fr": search_pattern},
                {"titre.ar": search_pattern},
                {"titre.en": search_pattern},
                {"auteur": search_pattern},
                {"langue": search_pattern}
            ],
            "active": True
        }, {"_id": 0}).limit(15).to_list(15)
        
        for ouvrage in ouvrages:
            titre = get_localized_text(ouvrage.get("titre"), lang)
            auteur = ouvrage.get("auteur", "")
            results.append(SearchResult(
                type="ouvrage",
                title=titre,
                description=f"Auteur: {auteur} • {ouvrage.get('langue', '')} • {ouvrage.get('taille', '')}",
                url=ouvrage.get("lien", "/enseignements/ouvrages"),
                score=1.0
            ))
    except Exception as e:
        print(f"Search ouvrages error: {e}")
    
    # Search in Family Members
    try:
        family_members = await db.family_members.find({
            "$or": [
                {"nom": search_pattern},
                {"surnom": search_pattern},
                {"titre.fr": search_pattern},
                {"titre.ar": search_pattern}
            ],
            "active": True
        }, {"_id": 0}).limit(10).to_list(10)
        
        for member in family_members:
            titre = get_localized_text(member.get("titre"), lang)
            nom = member.get("nom", "")
            surnom = member.get("surnom", "")
            display_name = f"{nom}" + (f' "{surnom}"' if surnom else "")
            results.append(SearchResult(
                type="personnalite",
                title=display_name,
                description=f"{titre} • {member.get('dates', '')}",
                url="/histoire/arbre-genealogique",
                image=member.get("image"),
                score=0.95
            ))
    except Exception as e:
        print(f"Search family members error: {e}")
    
    # Search in quotes
    try:
        quotes = await db.quotes.find({
            "$or": [
                {f"text_{lang}": search_pattern},
                {"text_fr": search_pattern},
                {"author": search_pattern}
            ],
            "active": True
        }, {"_id": 0}).limit(5).to_list(5)
        
        for quote in quotes:
            results.append(SearchResult(
                type="citation",
                title=quote.get("author", "Citation"),
                description=quote.get(f"text_{lang}", quote.get("text_fr", ""))[:200],
                url="/",
                score=0.85
            ))
    except Exception as e:
        print(f"Search quotes error: {e}")
    
    # Search in events
    try:
        events = await db.events.find({
            "$or": [
                {f"name_{lang}": search_pattern},
                {"name_fr": search_pattern},
                {f"description_{lang}": search_pattern},
                {"location": search_pattern}
            ],
            "active": True
        }, {"_id": 0}).limit(5).to_list(5)
        
        for event in events:
            event_name = event.get(f"name_{lang}", event.get("name_fr", ""))
            results.append(SearchResult(
                type="evenement",
                title=event_name,
                description=event.get(f"description_{lang}", event.get("description_fr", ""))[:200],
                url=f"/evenements/{event.get('event_type', 'ceremonies')}",
                score=0.8
            ))
    except Exception as e:
        print(f"Search events error: {e}")
    
    # Search in khalifes
    try:
        khalifes = await db.khalifes.find({
            "$or": [
                {"name": search_pattern},
                {"nom.fr": search_pattern},
                {f"title.{lang}": search_pattern},
                {f"description.{lang}": search_pattern}
            ],
            "active": True
        }, {"_id": 0}).limit(5).to_list(5)
        
        for khalife in khalifes:
            nom = khalife.get("name", get_localized_text(khalife.get("nom"), lang))
            results.append(SearchResult(
                type="khalife",
                title=nom,
                description=get_localized_text(khalife.get("description"), lang)[:200] if khalife.get("description") else "",
                url="/histoire/khalifes",
                image=khalife.get("image"),
                score=0.9
            ))
    except Exception as e:
        print(f"Search khalifes error: {e}")
    
    # Search in videos
    try:
        videos = await db.videos.find({
            "$or": [
                {"title": search_pattern},
                {"description": search_pattern}
            ]
        }, {"_id": 0}).limit(5).to_list(5)
        
        for video in videos:
            results.append(SearchResult(
                type="video",
                title=video.get("title", ""),
                description=video.get("description", "")[:200],
                url=f"/video/{video.get('id', '')}",
                image=video.get("thumbnail_url"),
                score=0.7
            ))
    except Exception as e:
        print(f"Search videos error: {e}")
    
    # Search in audio archives
    try:
        audios = await db.audio_archives.find({
            "$or": [
                {"titre.fr": search_pattern},
                {"titre.ar": search_pattern},
                {"description.fr": search_pattern}
            ],
            "active": True
        }, {"_id": 0}).limit(5).to_list(5)
        
        for audio in audios:
            titre = get_localized_text(audio.get("titre"), lang)
            results.append(SearchResult(
                type="audio",
                title=titre,
                description=get_localized_text(audio.get("description"), lang)[:200] if audio.get("description") else "Archive audio",
                url="/archives",
                score=0.75
            ))
    except Exception as e:
        print(f"Search audio error: {e}")
    
    # Search in page content
    try:
        content = await db.page_content.find({
            "$or": [
                {f"content_{lang}": search_pattern},
                {"content_fr": search_pattern},
                {"slug": search_pattern}
            ],
            "active": True
        }, {"_id": 0}).limit(5).to_list(5)
        
        url_map = {
            "maodo": "/histoire/maodo",
            "gamou": "/evenements/gamou",
            "ecole": "/enseignements/ecole",
            "origines": "/histoire/origines",
            "ziarra": "/evenements/ziarra",
            "geographie": "/histoire/geographie",
            "piliers": "/enseignements/piliers"
        }
        
        for item in content:
            slug = item.get("slug", "")
            results.append(SearchResult(
                type="page",
                title=item.get("section", slug.replace("-", " ").title()),
                description=item.get(f"content_{lang}", item.get("content_fr", ""))[:200],
                url=url_map.get(slug, f"/{slug}"),
                score=0.6
            ))
    except Exception as e:
        print(f"Search content error: {e}")
    
    # Sort by score
    results.sort(key=lambda x: x.score, reverse=True)
    
    return {
        "results": [r.model_dump() for r in results[:30]],
        "total": len(results),
        "query": q
    }


@router.get("/suggestions")
async def search_suggestions(
    q: str = Query(..., min_length=2),
    lang: str = Query("fr"),
    limit: int = Query(8, le=15)
):
    """Get search suggestions based on partial query"""
    if not q or len(q) < 2:
        return {"suggestions": []}
    
    suggestions = []
    search_pattern = {"$regex": f"^{q}", "$options": "i"}
    
    # Suggestions from ouvrages
    try:
        ouvrages = await db.bibliotheque.find({
            "$or": [
                {"titre.fr": search_pattern},
                {"auteur": search_pattern}
            ],
            "active": True
        }, {"_id": 0, "titre": 1, "auteur": 1}).limit(5).to_list(5)
        
        for ouvrage in ouvrages:
            titre = get_localized_text(ouvrage.get("titre"), lang)
            if titre:
                suggestions.append({"text": titre[:50], "type": "ouvrage"})
    except Exception:
        pass
    
    # Suggestions from family members
    try:
        members = await db.family_members.find({
            "nom": search_pattern,
            "active": True
        }, {"_id": 0, "nom": 1}).limit(5).to_list(5)
        
        for member in members:
            nom = member.get("nom", "")
            if nom:
                suggestions.append({"text": nom, "type": "personnalité"})
    except Exception:
        pass
    
    # Remove duplicates
    seen = set()
    unique = []
    for s in suggestions:
        if s["text"] not in seen:
            seen.add(s["text"])
            unique.append(s)
            if len(unique) >= limit:
                break
    
    return {"suggestions": unique}
