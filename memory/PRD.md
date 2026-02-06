# Tariqa Tidiane de Tivaouane - PRD (Product Requirements Document)

## 📋 Original Problem Statement
Création d'un portail web complet pour présenter la Tariqa Tidiane de Tivaouane, l'héritage spirituel d'El Hadji Malick Sy (Maodo), les enseignements de la confrérie Tijaniyya, et les événements religieux de la cité sainte.

## 🏗️ Architecture Technique
- **Frontend**: React + Tailwind CSS + Shadcn UI + PWA
- **Backend**: FastAPI (Python) + MongoDB (via Motor async driver)
- **Base de données**: MongoDB
- **Authentification**: JWT avec sessions stockées en MongoDB
- **URL Preview**: https://tisoweb.preview.emergentagent.com

## ✅ Fonctionnalités Implémentées

### Pages Principales (17+ pages)
1. **Accueil** (`/`) - Citation du jour (dynamique), Calendrier événements (dynamique), Vidéos en vedette, Newsletter, Compteur stats
2. **Histoire**
   - `/histoire/origines` - Les Origines de la Tariqa
   - `/histoire/maodo` - ⭐ Page dédiée à El Hadji Malick Sy avec galerie photos (5 photos authentiques)
   - `/histoire/khalifes` - Lignée des 9 Héritiers avec photos authentiques
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

### Base de Données MongoDB
**Collections:**
- `newsletter_subscriptions`: `{ email, language, subscribed_at, active }`
- `contact_messages`: `{ nom, email, sujet, message, sent_at, id }`
- `quotes`: `{ id, text_fr, text_en, text_ar, text_wo, author, context_fr, context_en, active, order }`
- `events`: `{ id, name_fr/en/ar/wo, description_fr/en/ar/wo, date, location, event_type, recurring, recurrence_pattern, active }`
- `videos`: `{ id, title, description, youtube_id, category, is_featured, created_at }`
- `admin_sessions`: `{ token, username, created_at, expires_at }`
- `push_subscriptions`: `{ endpoint, keys, user_agent, language, preferences, active }`

## 📝 Backlog

### P1 - Prochaines étapes prioritaires
- [ ] **Migration contenu vers BDD**: Refactoriser les pages statiques pour utiliser l'API

### P2 - Améliorations
- [ ] Simplifier `LanguageContext.js` après migration du contenu
- [ ] Bannière "Bismillah" demandée précédemment

### P3 - Futures
- [ ] Intégration réseaux sociaux (flux Twitter/Facebook)
- [ ] Envoi de notifications push depuis le panneau admin

## 📊 État du Projet

| Fonctionnalité | Status | Notes |
|----------------|--------|-------|
| Support Multilingue | ✅ 100% | FR, EN, AR, WO avec RTL + détection auto |
| Newsletter | ✅ 100% | Backend + Frontend fonctionnels |
| Contact | ✅ 100% | Backend + Frontend fonctionnels |
| Pages traduites | ✅ 95% | Principales pages traduites |
| Contenu dynamique | ✅ 70% | Citations, événements, recherche depuis MongoDB |
| Galerie photos | ✅ 100% | Avec filtres et lightbox |
| CMS Admin | ✅ 100% | Gestion complète CRUD (lecture, ajout, édition, suppression) |
| Export iCal | ✅ 100% | Google Calendar, Outlook, .ics |
| **Auth Admin** | ✅ 100% | Login/Logout/Protection routes |
| **PWA** | ✅ 100% | Service Worker, Manifest, Notifications |
| **CRUD CMS** | ✅ 100% | **NOUVEAU** - Édition/Suppression citations et événements |

## 📅 Historique des mises à jour

### Février 2025
- ✅ CRUD CMS complet (édition et suppression des citations/événements)
- ✅ Authentification admin complète (login/logout/protection)
- ✅ PWA avec Service Worker et notifications push
- ✅ Tests automatisés passés à 100%
