"""
Search routes
"""
from fastapi import APIRouter
from typing import List, Optional
from database import db
from models import SearchResult

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
async def search(q: str, lang: str = "fr"):
    """Global search across all content"""
    if not q or len(q) < 2:
        return {"results": [], "total": 0}
    
    results = []
    search_pattern = {"$regex": q, "$options": "i"}
    
    # Search in quotes
    quotes = await db.quotes.find({
        "$or": [
            {f"text_{lang}": search_pattern},
            {"author": search_pattern}
        ],
        "active": True
    }, {"_id": 0}).limit(5).to_list(5)
    
    for quote in quotes:
        results.append(SearchResult(
            type="quote",
            title=quote.get("author", "Citation"),
            description=quote.get(f"text_{lang}", quote.get("text_fr", ""))[:200],
            url="/",
            score=1.0
        ))
    
    # Search in events
    events = await db.events.find({
        "$or": [
            {f"name_{lang}": search_pattern},
            {f"description_{lang}": search_pattern},
            {"location": search_pattern}
        ],
        "active": True
    }, {"_id": 0}).limit(5).to_list(5)
    
    for event in events:
        results.append(SearchResult(
            type="event",
            title=event.get(f"name_{lang}", event.get("name_fr", "")),
            description=event.get(f"description_{lang}", event.get("description_fr", ""))[:200],
            url=f"/evenements/{event.get('event_type', 'ceremonies')}",
            score=0.9
        ))
    
    # Search in khalifes
    khalifes = await db.khalifes.find({
        "$or": [
            {"name": search_pattern},
            {f"title.{lang}": search_pattern},
            {f"description.{lang}": search_pattern}
        ],
        "active": True
    }, {"_id": 0}).limit(5).to_list(5)
    
    for khalife in khalifes:
        results.append(SearchResult(
            type="khalife",
            title=khalife.get("name", ""),
            description=khalife.get("description", {}).get(lang, khalife.get("description", {}).get("fr", ""))[:200],
            url="/histoire/khalifes",
            score=0.8
        ))
    
    # Search in videos
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
            url="/gallery",
            score=0.7
        ))
    
    # Search in content
    content = await db.page_content.find({
        "$or": [
            {f"content_{lang}": search_pattern},
            {"slug": search_pattern}
        ],
        "active": True
    }, {"_id": 0}).limit(5).to_list(5)
    
    for item in content:
        slug = item.get("slug", "")
        url_map = {
            "maodo": "/histoire/maodo",
            "gamou": "/evenements/gamou",
            "ecole": "/enseignements/ecole",
            "origines": "/histoire/origines",
            "ziarra": "/evenements/ziarra",
            "geographie": "/histoire/geographie"
        }
        results.append(SearchResult(
            type="page",
            title=item.get("section", slug),
            description=item.get(f"content_{lang}", item.get("content_fr", ""))[:200],
            url=url_map.get(slug, f"/{slug}"),
            score=0.6
        ))
    
    # Sort by score
    results.sort(key=lambda x: x.score, reverse=True)
    
    return {
        "results": [r.model_dump() for r in results[:20]],
        "total": len(results),
        "query": q
    }
