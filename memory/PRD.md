# Tariqa Tidiane de Tivaouane - PRD (Product Requirements Document)

## 📋 Original Problem Statement
Création d'un portail web complet pour présenter le Foyer Tidiane de Tivaouane, l'héritage spirituel d'El Hadji Malick Sy (Maodo), les enseignements de la confrérie Tijaniyya, et les événements religieux de la cité sainte.

**Nom du site**: L'empreinte de Maodo
**Copyright**: © 2026 CRAT

## 🏗️ Architecture Technique
- **Frontend**: React + Tailwind CSS + Shadcn UI + PWA
- **Backend**: FastAPI (Python) + MongoDB (via Motor async driver) - **REFACTORISÉ en modules**
- **Base de données**: MongoDB
- **Authentification**: JWT avec sessions stockées en MongoDB
- **URL Preview**: https://maodo-legacy.preview.emergentagent.com

### Structure Backend Refactorisée (11 Février 2026)
```
/app/backend/
├── server.py          # Point d'entrée (~100 lignes)
├── database.py        # Configuration MongoDB
├── auth.py            # Authentification
├── models/            # 12 fichiers de modèles Pydantic
│   ├── video.py, newsletter.py, contact.py, quote.py
│   ├── event.py, content.py, admin.py, khalife.py
│   ├── archive.py, family_tree.py, ouvrage.py
│   └── __init__.py
└── routers/           # 14 fichiers de routes
    ├── videos.py, newsletter.py, contact.py, quotes.py
    ├── events.py, content.py, admin.py, khalifes.py
    ├── archives.py, family_tree.py, ouvrages.py
    ├── search.py, calendar.py, notifications.py
    └── __init__.py
```

## ✅ Fonctionnalités Implémentées

### Pages Principales (17+ pages)
1. **Accueil** (`/`) - Citation du jour (dynamique), Calendrier événements (dynamique), Vidéos en vedette, Newsletter, Compteur stats
2. **Histoire**
   - `/histoire/origines` - Les Origines de la Tariqa
   - `/histoire/maodo` - ⭐ Page dédiée à El Hadji Malick Sy avec galerie photos (5 photos authentiques)
   - `/histoire/khalifes` - ⭐ **Lignée des 11 Héritiers** - **Dynamique depuis MongoDB** (11 profils avec photos)
   - `/histoire/geographie` - Géographie Sacrée
   - `/arbre-genealogique` - ⭐ Arbre généalogique interactif
   - `/carte` - ⭐ Carte interactive de Tivaouane avec Google Maps
3. **Enseignements**
   - `/enseignements/piliers` - Piliers de la Tariqa
   - `/enseignements/ecole` - L'École de Tivaouane
   - `/enseignements/ouvrages` - Ouvrages de Référence avec liens réels (Gallica, Scribd, PDF)
4. **Événements**
   - `/evenements/gamou` - ⭐ Le Gamou (date 2025: 4-5 septembre) - **Traduit**
   - `/evenements/ziarra` - ⭐ Ziarra Annuelles (date 2025: 20 avril) - **Traduit**
   - `/evenements/ceremonies` - Cérémonies Religieuses + Hadratoul Joumah
5. **Autres**
   - `/archives` - Archives avec système de filtrage
   - `/mediatheque` - ⭐ Médiathèque enrichie (Chaînes YouTube, Ressources téléchargeables) - **Traduit**
   - `/contact` - Contact avec informations bancaires CRAT - **Formulaire fonctionnel**
   - `/gallery` - Galerie vidéos
   - `/search` - Recherche globale
   - `/photos` - Galerie photos avec filtres par catégorie et lightbox

### 🔐 Authentification Admin ✅ COMPLÉTÉ (Février 2025)
- **Page de connexion**: `/admin/login`
  - Formulaire sécurisé avec username/password
  - Messages d'erreur multilingues
  - Mot de passe par défaut indiqué
- **Panneau d'administration**: `/admin`
  - Protection par token JWT
  - Redirection automatique si non authentifié
  - Statistiques du site (abonnés, messages, vidéos)
  - Gestion des citations et événements
  - Boutons Actualiser et Déconnexion
- **Credentials Admin**:
  - Username: `admin`
  - Password: `tivaouane2025`

### 📱 PWA (Progressive Web App) ✅ COMPLÉTÉ (Février 2025)
- **Service Worker**: Enregistré et actif
  - Mise en cache des assets statiques
  - Support mode hors ligne (network-first, fallback cache)
  - Gestion des événements push
- **Manifest**: Configuré avec
  - Nom de l'app et icônes
  - Thème et couleurs
  - Raccourcis vers les pages principales
  - Mode standalone
- **Composant PWAPrompt**: Interface pour
  - Installation de l'application
  - Activation des notifications push
  - Indicateur de connexion (online/offline)

### Support Multilingue ✅ COMPLÉTÉ (Février 2025)
- **4 langues supportées**: Français (FR), English (EN), العربية (AR), Wolof (WO)
- **Support RTL**: Direction droite-à-gauche automatique pour l'arabe
- **Détection automatique**: ⭐ Langue du navigateur détectée automatiquement à la première visite
- **Persistance**: Choix de langue sauvegardé dans localStorage
- **Éléments traduits**: Navigation, Hero section, Citations, Événements, Newsletter, Statistiques, Footer

### Formulaires Fonctionnels ✅ COMPLÉTÉS (Février 2025)
- **Newsletter** (`/api/newsletter/subscribe`)
- **Contact** (`/api/contact`)

### API Endpoints
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/admin/login` | POST | Connexion admin (retourne token JWT) |
| `/api/admin/logout` | POST | Déconnexion admin |
| `/api/admin/verify` | GET | Vérification token (protected) |
| `/api/admin/seed` | POST | Initialiser les données |
| `/api/newsletter/subscribe` | POST | Inscription newsletter |
| `/api/newsletter/subscribers` | GET | Stats abonnés |
| `/api/contact` | POST | Envoi message contact |
| `/api/contact/messages` | GET | Liste messages |
| `/api/quotes` | GET | Liste des citations |
| `/api/quotes/daily` | GET | Citation du jour |
| `/api/events` | GET | Liste des événements |
| `/api/events/upcoming` | GET | Événements à venir |
| `/api/calendar/events.ics` | GET | Export iCal tous événements |
| `/api/notifications/subscribe` | POST | Abonnement push |
| `/api/notifications/unsubscribe` | POST | Désabonnement push |
| `/api/search` | GET | Recherche globale multilingue |
| `/api/khalifes` | GET | **NOUVEAU** Liste des 11 héritiers (multilingue) |
| `/api/khalifes/current` | GET | **NOUVEAU** Khalife actuel |
| `/api/khalifes/seed` | POST | **NOUVEAU** Initialiser données khalifes |
|| `/api/pages` | GET | **NOUVEAU** Liste toutes les pages avec leurs sections |
|| `/api/content` | GET/POST | Liste/Créer contenu de pages |
|| `/api/content/{id}` | PUT/DELETE | Modifier/Supprimer contenu |
|| `/api/archives/manuscripts` | GET/POST | **NOUVEAU** Manuscrits numérisés (multilingue) |
|| `/api/archives/photos` | GET/POST | **NOUVEAU** Photos historiques (multilingue) |
|| `/api/archives/audio` | GET/POST | **NOUVEAU** Khassaides audio |
|| `/api/archives/videos` | GET/POST | **NOUVEAU** Vidéos documentaires (multilingue) |
|| `/api/archives/sources` | GET/POST | **NOUVEAU** Sources académiques (multilingue) |
|| `/api/archives/stats` | GET | **NOUVEAU** Statistiques des archives |
|| `/api/archives/seed` | POST | **NOUVEAU** Initialiser données archives |
|| `/api/family-tree` | GET | **NOUVEAU** Liste des membres de la famille |
|| `/api/family-tree/tree` | GET | **NOUVEAU** Arbre généalogique hiérarchique |
|| `/api/family-tree/{node_id}` | PUT/DELETE | **NOUVEAU** Modifier/Supprimer membre |
|| `/api/family-tree/seed` | POST | **NOUVEAU** Initialiser données arbre |
|| `/api/ouvrages/majeurs` | GET/POST | **NOUVEAU** Ouvrages majeurs (6 items) |
|| `/api/ouvrages/autres` | GET/POST | **NOUVEAU** Autres écrits (4 items) |
|| `/api/ouvrages/bibliotheque` | GET/POST | **NOUVEAU** Bibliothèque numérique (10 items) |
|| `/api/ouvrages/archives-academiques` | GET/POST | **NOUVEAU** Archives académiques (6 items) |
|| `/api/ouvrages/stats` | GET | **NOUVEAU** Statistiques des ouvrages |
|| `/api/ouvrages/seed` | POST | **NOUVEAU** Initialiser données ouvrages |
|| `/api/ouvrages/{type}/{id}` | PUT/DELETE | **NOUVEAU** Modifier/Supprimer ouvrage |
|| `/health` | GET | Health check pour déploiement K8s |

### Base de Données MongoDB
**Collections:**
- `newsletter_subscriptions`: `{ email, language, subscribed_at, active }`
- `contact_messages`: `{ nom, email, sujet, message, sent_at, id }`
- `quotes`: `{ id, text_fr, text_en, text_ar, text_wo, author, context_fr, context_en, active, order }`
- `events`: `{ id, name_fr/en/ar/wo, description_fr/en/ar/wo, date, location, event_type, recurring, recurrence_pattern, active }`
- `videos`: `{ id, title, description, youtube_id, category, is_featured, created_at }`
- `admin_sessions`: `{ token, username, created_at, expires_at }`
- `push_subscriptions`: `{ endpoint, keys, user_agent, language, preferences, active }`
- `khalifes`: **NOUVEAU** `{ id, name, title{fr,en,ar,wo}, period, icon, description{fr,en,ar,wo}, contributions{fr,en,ar,wo}, image, current, order, active }`
- `archive_manuscripts`: **NOUVEAU** `{ id, title{fr,en,ar,wo}, description{fr,en,ar,wo}, date, langue, lien, type, order, active }`
- `archive_photos`: **NOUVEAU** `{ id, title{fr,en,ar,wo}, description{fr,en,ar,wo}, date, image, source{fr,en,ar,wo}, order, active }`
- `archive_audio`: **NOUVEAU** `{ id, title, author, duration, audioUrl, source, coverImage, order, active }`
- `archive_videos`: **NOUVEAU** `{ id, title{fr,en,ar,wo}, description{fr,en,ar,wo}, youtubeId, duration, views, order, active }`
- `archive_sources`: **NOUVEAU** `{ id, title{fr,en,ar,wo}, description{fr,en,ar,wo}, lien, source{fr,en,ar,wo}, order, active }`
- `family_tree`: **NOUVEAU** `{ id, node_id, nom, surnom, dates, titre{fr,en,ar,wo}, image, parent_id, epouses, is_current_khalife, order, active }`
- `ouvrages_majeurs`: **NOUVEAU** `{ id, titre{fr,en,ar,wo}, sous_titre, auteur, date, description{fr,en,ar,wo}, themes[], importance{fr,en,ar,wo}, icon, order, active }`
- `autres_ouvrages`: **NOUVEAU** `{ id, titre{fr,en,ar,wo}, description{fr,en,ar,wo}, order, active }`
- `bibliotheque`: **NOUVEAU** `{ id, titre{fr,en,ar,wo}, taille, langue, lien, disponible, order, active }`
- `archives_academiques`: **NOUVEAU** `{ id, titre{fr,en,ar,wo}, description{fr,en,ar,wo}, lien, source, order, active }`

## 📝 Backlog

### P0 - Complétées récemment
- [x] ~~**Refactoring Backend server.py**~~ ✅ Complété (11 Février 2026)
  - Divisé un fichier de 4605 lignes en 30+ modules
  - Structure modulaire : models/, routers/, database.py, auth.py
  - Aucun changement fonctionnel, toutes les APIs préservées
  - Tests validés : toutes les routes fonctionnent
- [x] ~~**Amélioration PWA Mode Hors-ligne**~~ ✅ Complété (11 Février 2026)
  - Nouveau service worker v3 avec cache API
  - Composant OfflineManager avec interface utilisateur
  - Indicateur de connexion en temps réel
  - Boutons "Télécharger pour hors-ligne" et "Vider le cache"
  - 14 routes API cachées pour accès hors-ligne
- [x] ~~**Migration Ouvrages vers MongoDB**~~ ✅ Complété (11 Février 2026)
  - 4 nouvelles collections : `ouvrages_majeurs` (6), `autres_ouvrages` (4), `bibliotheque` (10), `archives_academiques` (6)
  - API CRUD complète avec authentification admin pour DELETE
  - Onglet "Ouvrages" ajouté dans le panneau d'administration
  - Frontend `OuvragesReference.js` refactorisé pour charger depuis MongoDB
  - Support multilingue complet (FR, EN, AR, WO) pour tous les champs texte
  - 26 éléments migrés au total
- [x] ~~**Migration Arbre Généalogique vers MongoDB**~~ ✅ Complété (9 Février 2026)
  - Nouvelle collection `family_tree` avec 11 membres
  - API structurée retournant l'arbre hiérarchique
  - Onglet "Arbre" dans le panneau d'administration
  - Frontend mis à jour pour charger depuis MongoDB
- [x] ~~**Migration Archives vers MongoDB**~~ ✅ Complété (9 Février 2026)
  - 5 nouvelles collections : `archive_manuscripts`, `archive_photos`, `archive_audio`, `archive_videos`, `archive_sources`
  - API CRUD complète avec authentification admin
  - Onglet "Archives" dans le panneau d'administration
  - Frontend mis à jour pour charger depuis MongoDB
  - 31 éléments migrés (8 manuscrits, 6 photos, 5 audios, 6 vidéos, 6 sources)
- [x] ~~**Titre Serigne Babacar Sy corrigé** sur l'arbre généalogique~~ ✅ Complété (9 Février 2026)
  - Titre changé en "Second fils de Maodo - Premier Khalife (1922-1957)"
  - Traduit dans les 4 langues (FR, EN, AR, WO)
- [x] ~~**Traductions page Archives complètes**~~ ✅ Complété (9 Février 2026)
  - Interface utilisateur traduite (titres, boutons, labels)
  - Manuscrits : 8 items traduits (FR, EN, AR, WO)
  - Photos : 6 items traduits (FR, EN, AR, WO)
  - Vidéos : 6 documentaires traduits (FR, EN, AR, WO)
  - Sources académiques : 6 items traduits (FR, EN, AR, WO)
- [x] ~~**Système CMS de Pages** dans l'Admin Panel~~ ✅ Complété (Février 2026)
- [x] ~~**Migrer page Khalifes** vers MongoDB~~ ✅ Complété (Février 2026)
- [x] ~~**Migrer les autres pages** : Ziarra, Origines, GeographieSacree vers MongoDB~~ ✅ Complété (Février 2026)

### P1 - Prochaines étapes prioritaires
- [ ] **Bannière "Bismillah"** sur la page d'accueil (détail visuel et spirituel important)
- [ ] **Transformation PWA améliorée** : Améliorer l'expérience mobile avec mode hors-ligne complet pour audio/vidéo

### P2 - Améliorations
- [ ] Simplifier `LanguageContext.js` (supprimer le contenu migré vers MongoDB)
- [ ] Ajouter plus de contenu interactif (quiz, méditations guidées)
- [ ] **Refactoring server.py** : Diviser le fichier monolithique en modules (models.py, routers/archives.py, etc.)
- [ ] **Refactoring AdminPanel.js** : Décomposer en sous-composants (ArchiveManager.js, OuvragesManager.js, etc.)

### P3 - Futures
- [ ] **Notifications Push depuis l'Admin** : Interface pour envoyer des notifications push
- [ ] **Transcriptions des Khassaides** : Intégrer les textes des poèmes à côté des lecteurs audio
- [ ] Intégration réseaux sociaux (flux Twitter/Facebook)
- [ ] Statistiques de visite dans le panneau admin

## 📊 État du Projet

| Fonctionnalité | Status | Notes |
|----------------|--------|-------|
| Support Multilingue | ✅ 100% | FR, EN, AR, WO avec RTL + détection auto |
| Newsletter | ✅ 100% | Backend + Frontend fonctionnels |
| Contact | ✅ 100% | Backend + Frontend fonctionnels |
| Pages traduites | ✅ 100% | Toutes les pages traduites (FR, EN, AR, WO) |
| Contenu dynamique | ✅ 70% | Citations, événements, recherche depuis MongoDB |
| Galerie photos | ✅ 100% | Avec filtres et lightbox |
| CMS Admin | ✅ 100% | Gestion complète CRUD (lecture, ajout, édition, suppression) |
| Export iCal | ✅ 100% | Google Calendar, Outlook, .ics |
| **Auth Admin** | ✅ 100% | Login/Logout/Protection routes |
| **PWA** | ✅ 100% | Service Worker, Manifest, Notifications |
| **CRUD CMS** | ✅ 100% | Édition/Suppression citations et événements |
| **Content CMS** | ✅ 100% | Gestion contenu des pages (26 sections, 6 pages) |
| **Dynamic Pages** | ✅ 100% | Maodo, Gamou, École, Khalifes, Origines, Géographie, Ziarra affichent contenu MongoDB |
| **Pages CMS** | ✅ 100% | **NOUVEAU** Système CMS complet pour créer/modifier/supprimer pages et sections |
| **Enriched Content** | ✅ 100% | **NOUVEAU** - 16 sections (timeline, contributions, oeuvres, program, cycles) |

## 📅 Historique des mises à jour

### Février 2026 (Session Actuelle)
- ✅ **Système CMS de Pages Complet** (9 février 2026):
  - Nouvel onglet "Pages" dans l'Admin Panel avec vue en grille
  - 6 pages gérables dynamiquement (ecole, gamou, geographie, maodo, origines, ziarra)
  - 26 sections de contenu multilingue (FR, EN, AR, WO)
  - CRUD complet : Créer page, Ajouter section, Modifier section, Supprimer section
  - Support RTL pour l'arabe
  - API `/api/pages` pour lister toutes les pages avec leurs sections
  - Tests automatisés : 100% passés (17 tests backend, validation frontend complète)
- ✅ **Enrichissement du Contenu sur Maodo** (9 février 2026):
  - 12 nouvelles vidéos YouTube réelles sur El Hadj Malick Sy (documentaires, Gamou 2024, Khassaides)
  - 10 documents PDF téléchargeables (thèses, exposés, biographies, manuscrits)
  - 6 sources académiques ajoutées (BnF, OpenEdition, UCAD, Timbuktu Institute, Les Cahiers de l'Islam)
  - Nouvelle section "Archives Académiques et Sources de Recherche" sur la page Ouvrages
  - Médiathèque mise à jour avec les vraies vidéos de Maodo
- ✅ **Système d'Archives Complet** (9 février 2026):
  - Page Archives enrichie avec 8 manuscrits, 6 photos, 5 audio, 6 vidéos
  - **Lecteur audio intégré** avec playlist des Khassaides (Tayssîr, Zajrul Qulûb, Yâ Kâchifad-Dâ-i, etc.)
  - **Lecteur vidéo modal** YouTube avec autoplay
  - **Galerie photos historiques** de Maodo et des Khalifes
  - **Manuscrits numérisés**: Khilassou Dhahab, Tayssir, Fâkihatou Toullâb (liens Scribd, Archive.org, PDF directs)
  - **Sources académiques**: BnF, Archive.org, UCAD, OpenEdition, Timbuktu Institute
  - Filtres par catégorie (Manuscrits, Photos, Audio, Vidéos)
- ✅ **Branding Complet** (9 février 2026):
  - Remplacement de "Tariqa Tidiane de Tivaouane" par "L'empreinte de Maodo" partout
  - Titre du site dans l'onglet navigateur : "L'empreinte de Maodo - Héritage Spirituel d'El Hadji Malick Sy"
  - Meta tags SEO (Open Graph, Twitter) mis à jour
  - Manifest.json pour PWA mis à jour (short_name: "Maodo")
  - Copyright : "© 2026 CRAT"
- ✅ **Traductions Multilingues Complètes** (9 février 2026):
  - Français : 100% traduit (langue de base)
  - Anglais : 100% traduit (toutes les sections : Origines, Géographie, Ziarra, Gamou, etc.)
  - Arabe : 100% traduit avec support RTL (right-to-left)
  - Wolof : 100% traduit (langue locale du Sénégal)
  - Plus de 200 clés de traduction par langue
- ✅ **Branding** : 
  - Nom du site "L'empreinte de Maodo" (titre simplifié dans navbar et pages)
  - Copyright changé de "2025" à "2026 CRAT"
  - "Tariqa Tidiane" remplacé par "Foyer Tidiane de Tivaouane"
- ✅ **Admin Panel - Onglet Héritiers** : 
  - Nouvel onglet "Héritiers" dans le panneau d'administration
  - Fonctionnalités CRUD complètes (Créer, Lire, Mettre à jour, Supprimer)
  - Formulaires d'édition multilingue (FR, EN, AR, WO)
- ✅ **Migration Khalifes** : Page `/histoire/khalifes` migrée vers MongoDB
  - Nouvelle collection `khalifes` avec 11 profils complets
  - Endpoints API CRUD (`/api/khalifes`, `/api/khalifes/current`, etc.)
- ✅ **Migration Pages Restantes** :
  - Page **Origines** (`/histoire/origines`) : 4 sections dynamiques (timeline, characteristics, expansion, introduction)
  - Page **Géographie Sacrée** (`/histoire/geographie`) : 4 sections dynamiques (lieux, organisation, introduction, demographics)
  - Page **Ziarra** (`/evenements/ziarra`) : 2 sections dynamiques (ziarras, pilgrim_guide)
  - Nouvel endpoint API `/api/content/seed-page/{slug}` pour initialiser le contenu
- ✅ **Deployment Fix** : Endpoint `/health` ajouté pour Kubernetes health checks
- ✅ **Tests** : Validés à 100%
- ✅ **Content CMS** : Migration du contenu vers MongoDB, hook usePageContent, onglet admin
- ✅ CRUD CMS complet (édition et suppression des citations/événements)
- ✅ Authentification admin complète (login/logout/protection)
- ✅ PWA avec Service Worker et notifications push
- ✅ Tests automatisés passés à 100%
