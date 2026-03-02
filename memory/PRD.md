# L'empreinte de Maodo - Product Requirements Document

## Original Problem Statement
Création d'un portail web pour la Tariqa Tidiane de Tivaouane, nommé "L'empreinte de Maodo". Le site doit servir de référence pour l'héritage spirituel d'El Hadji Malick Sy et la confrérie Tijaniyya.

## Core Requirements
- Support multilingue (Français, Anglais, Arabe, Wolof)
- PWA avec fonctionnalités hors-ligne
- CMS complet pour gestion du contenu
- Sections: Histoire, Enseignements, Wattu, Événements, Archives, Médiathèque, Contact

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

### Phase 5 - Logo Integration ✅ (Feb 13, 2026)
- **Logo final intégré**: Utilisateur a fourni logo avec Maodo + couleurs du site (#004D33, #D4AF37)
- **Versions de logo créées**:
  - `/logo.png` - Logo principal haute résolution
  - `/logo-navbar.png` - Logo pour la navbar (150px)
  - `/logo192.png` et `/logo512.png` - Logos PWA
  - `/favicon.ico` - Favicon multi-tailles
- **Logo intégré dans**: Navbar, Page d'accueil (section bienvenue)

### Phase 6 - Bug Fixes & Improvements ✅ (Feb 14, 2026)
- **Bug téléchargement PDF corrigé**: Suppression du `event.preventDefault()` qui bloquait les liens
- **Filigrane supprimé**: Les PDFs sont maintenant téléchargés directement sans traitement
- **Logo en format circulaire**: Logo affiché en rond avec bordure dorée dans la navbar et la page d'accueil

### Phase 7 - Wattu & Logo Update ✅ (Feb 14, 2026)
- **Nouveau logo intégré**: Logo médaillon classique fourni par l'utilisateur
- **Page Wattu créée**: Nouvelle section pour les opinions et réflexions
  - Backend: `/api/wattu/*` avec CRUD complet
  - Frontend: Page de liste avec filtres par catégorie
  - Page de détail pour chaque article
  - 4 catégories: Général, Spiritualité, Actualités, Réflexions
  - **5 articles exemples** ajoutés (Wird, Éducation, Gamou, Salat Fatihi, Jeunesse)
- **Admin Wattu**: Nouvel onglet dans le panel admin pour gérer les articles
  - Création/édition/suppression d'articles
  - Support multilingue (FR, EN, AR, WO)
  - Options: actif/inactif, mis en avant
  - Tags et images
- **Système de Pages Dynamiques**: Infrastructure pour rendre toutes les pages modifiables
  - Backend: `/api/dynamic-pages/*` avec CRUD complet
  - Admin: Nouvel onglet "Pages" pour gérer les pages du site
  - Support pour sections de contenu (texte, image, citation, vidéo, cartes, chronologie)
  - Bouton "Créer pages par défaut" pour initialiser les pages existantes

## Current Status
- **App Name**: L'empreinte de Maodo (PWA, Safari, manifest)
- **Logo**: Nouveau logo médaillon avec portrait de Maodo
- **Ouvrages**: 66 documents PDF disponibles en téléchargement direct
- **Wattu**: Section opinions avec 5 articles exemples et gestion admin
- **Pages Dynamiques**: 10 pages actives, toutes connectées au frontend
- **Arbre Généalogique**: Fonctionnel
- **Affiche levée de fonds**: `/affiche-zawiya.html` créée

### Phase 8 - Full Dynamic Pages Integration ✅ (Feb 15, 2026)
- **Toutes les pages de contenu maintenant dynamiques**:
  - `ElHadjiMalickSy.js` converti pour utiliser `DynamicPageRenderer`
  - 10 pages totales dans le système de gestion de contenu
- **Pages converties**:
  - Histoire: Origines, Maodo, El Hadji Malick Sy, Khalifes, Géographie
  - Enseignements: Piliers, École
  - Événements: Gamou, Ziarra, Cérémonies
- **Test coverage**: Backend 87.5%, Frontend 100%
- **Fusion des onglets Pages** dans l'admin (un seul onglet au lieu de deux)

### Phase 9 - Deployment Fixes ✅ (Feb 15, 2026)
- **Corrections pour déploiement en production**:
  - Ajout endpoint `/api/init-data` pour initialiser les données en production
  - Ajout endpoint `/api/admin/seed` (alias de init-data)
  - Ajout endpoint `/api/contact/messages/count` (public, pour stats admin)
  - Correction du téléchargement PDF pour gérer fichiers locaux absents
  - Amélioration de `DynamicPageRenderer` pour afficher "contenu en préparation" si page non trouvée
  - Frontend utilise maintenant `/api/contact/messages/count` au lieu de `/api/contact/messages`

### Phase 10 - Homepage Enhancements ✅ (Feb 15, 2026)
- **Section "Dons (Hadiya)" ajoutée sur la page d'accueil**:
  - Carte élégante avec en-tête doré et icône cœur
  - Texte explicatif multilingue (FR, EN, AR, WO)
  - Numéro Wave/Orange Money: **77 338 90 95**
  - Citation de Hadith sur l'importance de l'entraide
- **Section "Wattu" ajoutée sur la page d'accueil**:
  - Section dédiée avec fond vert foncé
  - Bouton doré "Accéder à Wattu" avec data-testid
  - Icône BookOpen de lucide-react
  - Texte descriptif multilingue
- **Bouton Wattu dans la navigation** déjà présent

### Phase 11 - Dynamic Homepage Sections & New Logo ✅ (Feb 15, 2026)
- **Nouveau logo intégré**: Logo médaillon "L'empreinte de MAODO" avec portrait de Maodo
  - Fond vert foncé (#004D33) avec bordure dorée
  - Remplace l'ancien logo dans la navbar et la page d'accueil
- **Sections dynamiques sur la page d'accueil**:
  - Backend: `/api/homepage-sections/*` avec CRUD complet
  - Section "Wattu" et "Dons" maintenant modifiables via l'admin
  - Nouvel onglet "Accueil" dans le panneau d'administration
  - Possibilité d'activer/désactiver, modifier le contenu, supprimer les sections
- **Admin Panel**:
  - Nouvel onglet "Accueil" pour gérer les sections de la page d'accueil
  - Interface pour modifier les titres, descriptions, numéros de téléphone

## Prioritized Backlog

### P0 - Critical
- Aucun bug critique actuel

### P1 - High Priority
- [x] ~~Logo et filigrane intégrés~~ (Feb 13, 2026)
- [x] ~~Bug téléchargement PDF corrigé~~ (Feb 14, 2026)
- [x] ~~Logo en format circulaire~~ (Feb 14, 2026)
- [x] ~~Page Wattu créée~~ (Feb 14, 2026)
- [x] ~~Admin Wattu~~ (Feb 14, 2026)
- [x] ~~Articles exemples Wattu~~ (Feb 14, 2026)
- [x] ~~Système de pages dynamiques~~ (Feb 14, 2026)

### P2 - Medium Priority
- [x] ~~Migrer le contenu des pages statiques vers les pages dynamiques~~ (Feb 14, 2026)
- [x] ~~Connecter les pages frontend au contenu dynamique~~ (Feb 14, 2026)
- [ ] Transcriptions des Khassaides
- [ ] Amélioration UX bibliothèque numérique

### P3 - Future Enhancements
- [ ] Notifications Push depuis l'Admin
- [ ] Recherche en temps réel avec auto-complétion
- [ ] Intégration contenu xassida.sn (nécessite API)
- [ ] Application mobile native

## API Endpoints
- `GET /api/ouvrages/bibliotheque` - Liste des 66 ouvrages
- `GET /api/ouvrages/download/{id}` - Téléchargement PDF direct
- `GET /api/wattu/articles` - Liste des articles Wattu
- `GET /api/wattu/articles/{id}` - Détail d'un article
- `GET /api/wattu/categories` - Catégories disponibles
- `POST /api/wattu/admin/articles` - Créer un article (admin)
- `PUT /api/wattu/admin/articles/{id}` - Modifier un article (admin)
- `DELETE /api/wattu/admin/articles/{id}` - Supprimer un article (admin)
- `GET /api/dynamic-pages/` - Liste des pages dynamiques
- `GET /api/dynamic-pages/by-slug/{slug}` - Page par slug
- `POST /api/dynamic-pages/admin` - Créer une page (admin)
- `PUT /api/dynamic-pages/admin/{id}` - Modifier une page (admin)
- `DELETE /api/dynamic-pages/admin/{id}` - Supprimer une page (admin)
- `GET /api/family-tree/tree` - Arbre généalogique hiérarchique
- `GET /api/search?q={query}` - Recherche globale
- `POST /api/auth/login` - Authentification admin

## Credentials
- **Admin**: `admin` / `tivaouane2025`

## Pages Dynamiques Créées (10 pages)
### Histoire (5 pages)
- `/histoire/origines` - Les Origines de la Tijaniyya
- `/histoire/el-hadji-malick-sy` - El Hadji Malick Sy - Maodo ✅ NEW
- `/histoire/maodo` - El Hadji Malick Sy (Maodo)
- `/histoire/khalifes` - La Lignée des Khalifes
- `/histoire/geographie` - Géographie Sacrée

### Enseignements (2 pages)
- `/enseignements/piliers` - Les Piliers de la Tariqa
- `/enseignements/ecole` - L'École de Tivaouane

### Événements (3 pages)
- `/evenements/gamou` - Le Gamou
- `/evenements/ziarra` - Les Ziarra Annuelles
- `/evenements/ceremonies` - Cérémonies Religieuses

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

### Phase 12 - Deployment Bug Fix ✅ (Feb 15, 2026)
- **Bug 307/404 Temporary Redirect résolu**:
  - Ajout handlers POST et GET pour `/api` (sans slash final)
  - Ajout handlers POST et GET pour `/api/` (avec slash final)
  - Ajout handlers POST pour `/api/health` et `/health`
  - Le paramètre `redirect_slashes=False` était déjà configuré
  - Les sondes de santé en production peuvent maintenant utiliser POST ou GET sur `/api` ou `/api/`
- **Optimisations MongoDB**:
  - Toutes les requêtes limitées à 50-200 résultats
  - Variables d'environnement avec valeurs par défaut robustes
  - Suppression des appels POST redondants dans Home.js
- **Dependencies nettoyées**:
  - requirements.txt réduit à 15 dépendances essentielles

## Current Status
- **Deployment**: Bug 404 sur POST /api résolu avec les nouveaux handlers directs
- **Pages dynamiques**: 10 pages actives avec contenu riche
- **Admin Panel**: Gestion complète des sections d'accueil, pages, et contenu Wattu

### Phase 13 - UI/UX Enhancement & Content Update ✅ (Feb 22, 2026)
- **Nouveau logo intégré**: Logo final "L'empreinte de MAODO" avec portrait de Maodo
  - Fichier: `/logo-vf.png` - Logo haute résolution fourni par l'utilisateur
  - Intégré dans Navbar et page d'accueil avec effet glow doré
- **Couleurs vibrantes**: Mise à jour de la palette de couleurs
  - Vert principal: `#006B47` (plus lumineux que l'ancien `#004D33`)
  - Or: `#E6B800` et `#FFD54F` (plus brillant)
  - Ajout d'effets glow (`.glow-gold`, `.glow-emerald`)
  - Ajout d'effet shimmer sur la bordure dorée du hero
- **Lien "Sopna by France" supprimé**: Retiré de la section "À propos des Khassaides" dans Archives
  - Seul Archive.org reste comme source d'enregistrement
- **Contenu Maodo enrichi**: Page `/histoire/maodo` mise à jour avec contenu complet
  - 8 sections: Introduction, Naissance, Formation, Chronologie, Installation à Tivaouane, Œuvres, Héritage, Paroles de Maodo
  - Contenu basé sur des sources historiques fiables
  - Support bilingue FR/EN

### Phase 14 - Content Restoration for All Pages ✅ (Feb 22, 2026)
- **7 pages restaurées avec contenu riche** basé sur des recherches approfondies:
  1. **Les Origines de la Tijaniyya** (`/histoire/origines`) - 5 sections
     - Le Fondateur Cheikh Ahmed Tijani
     - Spécificités de la Tijaniyya
     - Expansion en Afrique de l'Ouest
     - Chronologie (1737-1902)
     - Fès: Le Centre Spirituel
  2. **Géographie Sacrée** (`/histoire/geographie`) - 5 sections
     - Tivaouane: Ville Sainte
     - La Mosquée et la Zawiya d'El Hadji Malick Sy
     - Les Mausolées Sacrés
     - La Grande Mosquée en Construction
     - Rayonnement International
  3. **Les Piliers de la Tariqa** (`/enseignements/piliers`) - 6 sections
     - Fondements Doctrinaux
     - Le Lâzim (Wird Quotidien)
     - La Wazifa
     - Le Dhikr du Vendredi (Haylala)
     - Conseils pour la Pratique
     - Les Bienfaits des Pratiques
  4. **L'École de Tivaouane** (`/enseignements/ecole`) - 6 sections
     - Un Centre d'Excellence
     - Un Système Décentralisé
     - Géostratégie Éducative
     - Une Approche Inclusive
     - L'Héritage Éducatif
     - Disciplines Enseignées
  5. **Le Gamou de Tivaouane** (`/evenements/gamou`) - 6 sections
     - Un Événement Spirituel Majeur
     - Histoire du Gamou
     - Déroulement de la Célébration
     - Importance Nationale
     - Les Nuits du Bourde
     - Dates Clés (Timeline)
  6. **Les Ziarra Annuelles** (`/evenements/ziarra`) - 6 sections
     - Qu'est-ce que la Ziarra?
     - Les Mausolées Visités
     - Programme Typique
     - Signification Spirituelle
     - Organisation et Logistique
     - Distinction avec le Gamou
  7. **Cérémonies Religieuses** (`/evenements/ceremonies`) - 6 sections
     - Les Cérémonies de la Tijaniyya
     - Le Bourde
     - Les Khassaides
     - Hadratoul Jummah
     - Types de Cérémonies
     - L'Atmosphère Spirituelle

### Phase 15 - Media Management Module ✅ (Mar 2, 2026)
- **Module de gestion des fichiers complet**:
  - Backend: `/api/media/*` avec CRUD complet pour fichiers et associations
  - Upload de fichiers (PDF, images, audio, vidéo) avec limite 10 MB
  - Système de tags personnalisables avec couleurs
  - Association dynamique des fichiers aux pages du site
  - Gestion de l'ordre d'affichage
  - Réutilisation multi-pages
- **Nouveaux endpoints API**:
  - `GET /api/media/stats` - Statistiques de la médiathèque
  - `GET /api/media/pages` - Pages disponibles pour associations
  - `GET/POST/DELETE /api/media/tags` - Gestion des tags
  - `POST /api/media/upload` - Upload de fichiers
  - `GET /api/media/files` - Liste des fichiers avec filtres
  - `POST/DELETE /api/media/associations` - Gestion des associations
  - `GET /api/media/associations/page/{slug}` - Médias d'une page
- **Interface Admin**:
  - Nouvel onglet "Médias" dans le panneau d'administration
  - Modal d'upload avec titre, description, tags
  - Modal de gestion des tags (créer, supprimer)
  - Filtres par type de fichier et par tag
  - Recherche de fichiers
  - Prévisualisation des fichiers (images, audio, vidéo)
- **Composant d'affichage**:
  - `PageMediaDisplay.js` pour afficher les médias sur les pages du site
  - Galerie photos avec lightbox
  - Lecteur audio intégré
  - Lecteur vidéo intégré
  - Téléchargement de PDFs
- **Tests**: 100% de succès (17 tests backend + frontend UI)

## Prioritized Backlog

### P0 - Critical
- Aucun bug critique actuel

### P1 - High Priority
- [x] ~~Module de gestion des médias~~ (Mar 2, 2026)
- [ ] Bannière "Bismillah" sur la page d'accueil

### P2 - Medium Priority
- [ ] Transcriptions des Khassaides
- [ ] Amélioration UX bibliothèque numérique
- [ ] Recherche en temps réel avec auto-complétion

### P3 - Future Enhancements
- [ ] Notifications Push depuis l'Admin
- [ ] Intégration contenu xassida.sn (nécessite API)
- [ ] Application mobile native

## API Endpoints (Updated)
- `GET /api/ouvrages/bibliotheque` - Liste des 66 ouvrages
- `GET /api/ouvrages/download/{id}` - Téléchargement PDF direct
- `GET /api/wattu/articles` - Liste des articles Wattu
- `GET /api/dynamic-pages/` - Liste des pages dynamiques
- `GET /api/family-tree/tree` - Arbre généalogique hiérarchique
- `GET /api/search?q={query}` - Recherche globale
- `POST /api/auth/login` - Authentification admin
- **NEW** `GET /api/media/stats` - Statistiques médiathèque
- **NEW** `GET /api/media/files` - Liste des fichiers
- **NEW** `POST /api/media/upload` - Upload de fichiers
- **NEW** `GET/POST/DELETE /api/media/tags` - Gestion des tags
- **NEW** `POST/DELETE /api/media/associations` - Associations page-média

## File Structure (Updated)
```
/app
├── backend/
│   ├── routers/
│   │   └── media.py              # NEW: Routes gestion médias
│   ├── models/
│   │   └── media.py              # NEW: Modèles médias
│   └── server.py
└── frontend/
    ├── public/
    │   └── uploads/              # NEW: Dossier stockage fichiers
    └── src/
        ├── components/
        │   └── PageMediaDisplay.js # NEW: Composant affichage médias
        └── pages/
            └── admin/
                └── MediaManagerTab.jsx # NEW: Interface admin médias
```

## Last Updated
March 2, 2026 - CRUD complet pour Archives, Ouvrages et Arbre Généalogique

### Phase 14 - Wattu Rename & Full CRUD Admin ✅ (March 2, 2026)
- **Page Wattu renommée**: "Wattu - Opinions & Réflexions" (FR) / "Wattu - Opinions & Reflections" (EN)
- **5 articles importés** depuis lempreintedemaodo.com/wattu (déjà présents)
- **CRUD complet pour Archives**: Formulaires d'ajout/modification pour 5 types (Manuscrits, Photos, Audio, Vidéos, Sources)
- **CRUD complet pour Ouvrages**: Formulaires d'ajout/modification pour 4 types (Majeurs, Autres, Bibliothèque, Académiques)  
- **CRUD complet pour Arbre Généalogique**: Ajout du champ node_id requis, formulaire complet
- **Alignement frontend/backend**: Tous les formulaires respectent les schémas Pydantic du backend
- **Tests API validés**: POST/PUT/DELETE fonctionnels pour tous les types de contenu

## Prioritized Backlog

### P0 - Haute Priorité
- [ ] Gestion de l'ordre d'affichage des médias (drag-and-drop)
- [ ] Bannière "Bismillah" sur la page d'accueil

### P1 - Moyenne Priorité
- [ ] Recherche en temps réel avec auto-complétion
- [ ] Notifications Push depuis l'Admin

### P2 - Basse Priorité
- [ ] Transcriptions des Khassaides
- [ ] Intégration contenu xassida.sn (nécessite API)
- [ ] Application mobile native

