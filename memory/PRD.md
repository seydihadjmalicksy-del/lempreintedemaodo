# L'empreinte de Maodo - Product Requirements Document

## Original Problem Statement
Création d'un portail web pour la Tariqa Tidiane de Tivaouane, nommé "L'empreinte de Maodo". Le site doit servir de référence pour l'héritage spirituel d'El Hadji Malick Sy et la confrérie Tijaniyya.

## Core Requirements
- Support multilingue (Français, Anglais, Arabe, Wolof)
- PWA avec fonctionnalités hors-ligne
- CMS complet pour gestion du contenu
- Sections: Histoire, Enseignements, Événements, Archives, Médiathèque, Contact

## Tech Stack
- **Frontend**: React, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI (architecture modulaire)
- **Database**: MongoDB
- **PWA**: Service Worker, OfflineManager

## What's Been Implemented

### Phase 1 - Foundation ✅
- Structure multi-pages avec React Router
- Support multilingue complet (4 langues)
- Design système avec couleurs de la Tariqa (#004D33, #D4AF37)
- PWA avec manifest et service worker

### Phase 2 - Content Management ✅
- Panel d'administration complet avec authentification JWT
- Gestion des archives, ouvrages, événements
- Arbre généalogique interactif avec CRUD complet
- Upload de médias et gestion de galerie

### Phase 3 - Backend Refactoring ✅
- Migration de server.py monolithique vers architecture modulaire
- Séparation en `/models` et `/routers`
- Réduction de 99% de la taille du fichier principal

### Phase 4 - Content Integration ✅ (Feb 12, 2026)
- **Nom PWA corrigé**: "L'empreinte de Maodo" partout
- **56 nouveaux ouvrages PDF téléchargés** (244 Mo)
- **66 ouvrages au total** dans la bibliothèque numérique
- Sources: eutoutidjanneyi.wordpress.com
- Fichiers stockés dans `/ouvrages/` avec téléchargement direct

### Phase 5 - Logo & Watermark Integration ✅ (Feb 13, 2026)
- **Logo final intégré**: Utilisateur a fourni logo avec Maodo + couleurs du site (#004D33, #D4AF37)
- **Versions de logo créées**:
  - `/logo.png` - Logo principal haute résolution
  - `/logo-navbar.png` - Logo pour la navbar (150px)
  - `/logo192.png` et `/logo512.png` - Logos PWA
  - `/favicon.ico` - Favicon multi-tailles
  - `/watermark.png` - Filigrane 25% opacité
  - `/watermark-pdf.png` - Filigrane PDF 15% opacité (400px)
- **Logo intégré dans**: Navbar, Page d'accueil (section bienvenue)
- **Filigrane dynamique PDF**: Endpoint `/api/ouvrages/download/{id}` ajoute le filigrane à la volée lors du téléchargement

## Current Status
- **App Name**: L'empreinte de Maodo (PWA, Safari, manifest)
- **Logo**: Nouveau logo avec portrait de Maodo et couleurs du site intégré
- **Ouvrages**: 66 documents PDF disponibles avec filigrane dynamique
- **Arbre Généalogique**: Fonctionnel (membre Serigne Sidy Ahmed Sy visible)
- **Affiche levée de fonds**: `/affiche-zawiya.html` créée

## Prioritized Backlog

### P0 - Critical
- Aucun bug critique actuel

### P1 - High Priority
- [x] ~~Logo et filigrane intégrés~~ (Feb 13, 2026)
- [x] ~~Filigrane dynamique sur les PDFs~~ (Feb 13, 2026)

### P2 - Medium Priority
- [ ] Bannière "Bismillah" stylisée sur la page d'accueil
- [ ] Transcriptions des Khassaides

### P3 - Future Enhancements
- [ ] Notifications Push depuis l'Admin
- [ ] Recherche en temps réel avec auto-complétion
- [ ] Intégration contenu xassida.sn (nécessite API)
- [ ] Application mobile native

## API Endpoints
- `GET /api/ouvrages/bibliotheque` - Liste des 66 ouvrages
- `GET /api/ouvrages/download/{id}` - **NOUVEAU** Téléchargement PDF avec filigrane
- `GET /api/family-tree/tree` - Arbre généalogique hiérarchique
- `GET /api/search?q={query}` - Recherche globale
- `POST /api/auth/login` - Authentification admin

## Credentials
- **Admin**: `admin` / `tivaouane2025`

## File Structure
```
/app
├── backend/
│   ├── routers/           # 15 fichiers de routes
│   │   └── ouvrages.py    # Inclut téléchargement avec filigrane
│   ├── models/            # 11 modèles Pydantic
│   └── server.py          # Point d'entrée (allégé)
└── frontend/
    ├── public/
    │   ├── logo.png           # Logo principal
    │   ├── logo-navbar.png    # Logo navbar
    │   ├── watermark*.png     # Filigranes
    │   ├── ouvrages/          # 56 PDFs (244 Mo)
    │   └── affiche-zawiya.html
    └── src/
        ├── components/
        │   └── Navbar.js      # Avec nouveau logo
        └── pages/
            ├── Home.js        # Section bienvenue avec logo
            └── admin/         # Composants refactorisés
```

## Last Updated
February 13, 2026 - Intégration logo final et filigrane dynamique PDF
