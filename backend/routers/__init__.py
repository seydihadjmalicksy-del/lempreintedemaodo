"""
Routers package - API route handlers
"""
from .videos import router as videos_router
from .newsletter import router as newsletter_router
from .contact import router as contact_router
from .quotes import router as quotes_router
from .events import router as events_router
from .content import router as content_router
from .admin import router as admin_router
from .khalifes import router as khalifes_router
from .archives import router as archives_router
from .family_tree import router as family_tree_router
from .ouvrages import router as ouvrages_router
from .search import router as search_router
from .calendar import router as calendar_router
from .notifications import router as notifications_router
from .wattu import router as wattu_router
from .dynamic_pages import router as dynamic_pages_router

__all__ = [
    "videos_router",
    "newsletter_router",
    "contact_router",
    "quotes_router",
    "events_router",
    "content_router",
    "admin_router",
    "khalifes_router",
    "archives_router",
    "family_tree_router",
    "ouvrages_router",
    "search_router",
    "calendar_router",
    "notifications_router",
    "wattu_router",
    "dynamic_pages_router"
]
