"""
Models package - Pydantic models for the API
"""
from .video import Video, VideoCreate, VideoUpdate, Category
from .newsletter import NewsletterSubscription, NewsletterSubscribe
from .contact import ContactMessage, ContactCreate
from .quote import Quote, QuoteUpdate
from .event import Event, EventUpdate
from .content import PageContent, PageContentCreate, PageContentUpdate, SearchResult
from .admin import AdminLogin, AdminSession, PushSubscription, NotificationPreferences
from .khalife import Khalife, KhalifeCreate, KhalifeUpdate
from .archive import (
    ArchiveManuscript, ArchiveManuscriptCreate, ArchiveManuscriptUpdate,
    ArchivePhoto, ArchivePhotoCreate, ArchivePhotoUpdate,
    ArchiveAudio, ArchiveAudioCreate, ArchiveAudioUpdate,
    ArchiveVideo, ArchiveVideoCreate, ArchiveVideoUpdate,
    ArchiveSource, ArchiveSourceCreate, ArchiveSourceUpdate
)
from .family_tree import FamilyMember, FamilyMemberCreate, FamilyMemberUpdate
from .ouvrage import (
    OuvrageMajeur, OuvrageMajeurCreate, OuvrageMajeurUpdate,
    AutreOuvrage, AutreOuvrageCreate, AutreOuvrageUpdate,
    BibliothequeItem, BibliothequeItemCreate, BibliothequeItemUpdate,
    ArchiveAcademique, ArchiveAcademiqueCreate, ArchiveAcademiqueUpdate
)

__all__ = [
    # Video
    "Video", "VideoCreate", "VideoUpdate", "Category",
    # Newsletter
    "NewsletterSubscription", "NewsletterSubscribe",
    # Contact
    "ContactMessage", "ContactCreate",
    # Quote
    "Quote", "QuoteUpdate",
    # Event
    "Event", "EventUpdate",
    # Content
    "PageContent", "PageContentCreate", "PageContentUpdate", "SearchResult",
    # Admin
    "AdminLogin", "AdminSession", "PushSubscription", "NotificationPreferences",
    # Khalife
    "Khalife", "KhalifeCreate", "KhalifeUpdate",
    # Archive
    "ArchiveManuscript", "ArchiveManuscriptCreate", "ArchiveManuscriptUpdate",
    "ArchivePhoto", "ArchivePhotoCreate", "ArchivePhotoUpdate",
    "ArchiveAudio", "ArchiveAudioCreate", "ArchiveAudioUpdate",
    "ArchiveVideo", "ArchiveVideoCreate", "ArchiveVideoUpdate",
    "ArchiveSource", "ArchiveSourceCreate", "ArchiveSourceUpdate",
    # Family Tree
    "FamilyMember", "FamilyMemberCreate", "FamilyMemberUpdate",
    # Ouvrage
    "OuvrageMajeur", "OuvrageMajeurCreate", "OuvrageMajeurUpdate",
    "AutreOuvrage", "AutreOuvrageCreate", "AutreOuvrageUpdate",
    "BibliothequeItem", "BibliothequeItemCreate", "BibliothequeItemUpdate",
    "ArchiveAcademique", "ArchiveAcademiqueCreate", "ArchiveAcademiqueUpdate"
]
