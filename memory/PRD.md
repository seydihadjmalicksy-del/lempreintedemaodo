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

## Current Status
- **App Name**: L'empreinte de Maodo (PWA, Safari, manifest)
- **Ouvrages**: 66 documents PDF disponibles
- **Arbre Généalogique**: Fonctionnel (membre Serigne Sidy Ahmed Sy visible)
- **Affiche levée de fonds**: `/affiche-zawiya.html` créée

## Prioritized Backlog

### P0 - Critical
- Aucun bug critique actuel

### P1 - High Priority
- [x] ~~Bannière "Bismillah" sur la page d'accueil~~ (déjà présente)
- [x] ~~Recherche/filtrage dans la bibliothèque~~ → Système de recherche global implémenté (Feb 12, 2026)

### P2 - Medium Priority
- [x] ~~Finaliser refactoring AdminPanel.js~~ → Refactorisé: 2370 → 452 lignes + 8 composants (Feb 12, 2026)
- [ ] Transcriptions des Khassaides

### P3 - Future Enhancements
- [ ] Notifications Push depuis l'Admin
- [ ] Intégration contenu xassida.sn (nécessite API)
- [ ] Application mobile native

## API Endpoints
- `GET /api/ouvrages/bibliotheque` - Liste des 66 ouvrages
- `GET /api/family-tree/tree` - Arbre généalogique hiérarchique
- `POST /api/auth/login` - Authentification admin

## Credentials
- **Admin**: `admin` / `tivaouane2025`

## File Structure
```
/app
├── backend/
│   ├── routers/           # 15 fichiers de routes
│   ├── models/            # 11 modèles Pydantic
│   └── server.py          # Point d'entrée (allégé)
└── frontend/
    ├── public/
    │   ├── ouvrages/      # 56 PDFs (244 Mo)
    │   └── affiche-zawiya.html
    └── src/
        └── pages/
            └── admin/     # Composants refactorisés
```

## Last Updated
February 12, 2026 - Intégration bibliothèque d'ouvrages
