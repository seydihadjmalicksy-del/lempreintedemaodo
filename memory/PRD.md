# Tariqa Tidiane de Tivaouane - PRD (Product Requirements Document)

## 📋 Original Problem Statement
Création d'un portail web complet pour présenter la Tariqa Tidiane de Tivaouane, l'héritage spirituel d'El Hadji Malick Sy (Maodo), les enseignements de la confrérie Tijaniyya, et les événements religieux de la cité sainte.

## 🏗️ Architecture Technique
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (Python) + MongoDB (via Motor async driver)
- **Base de données**: MongoDB - Utilisée pour Newsletter et Contact
- **URL Preview**: https://tidjaniyya-hub.preview.emergentagent.com

## ✅ Fonctionnalités Implémentées

### Pages Principales (17+ pages)
1. **Accueil** (`/`) - Citation du jour, Calendrier événements, Vidéos en vedette, Newsletter, Compteur stats
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

### Support Multilingue ✅ COMPLÉTÉ (Février 2025)
- **4 langues supportées**: Français (FR), English (EN), العربية (AR), Wolof (WO)
- **Support RTL**: Direction droite-à-gauche automatique pour l'arabe
- **Détection automatique**: ⭐ Langue du navigateur détectée automatiquement à la première visite
- **Persistance**: Choix de langue sauvegardé dans localStorage
- **Éléments traduits**: Navigation, Hero section, Citations, Événements, Newsletter, Statistiques, Footer
- **Pages entièrement traduites**:
  - ✅ Page Maodo (biographie, chronologie, contributions, citations, oeuvres)
  - ✅ Page Lignée des Héritiers (9 khalifes avec titres, descriptions, contributions)
  - ✅ Page Arbre Généalogique (titres, légende, instructions)
  - ✅ Page d'Accueil (toutes les sections)
  - ✅ **CarteTivaouane** - Carte interactive avec lieux saints traduits
  - ✅ **Gamou** - Page du Gamou avec programme et conseils
  - ✅ **ZiarraAnnuelles** - Pèlerinages spirituels avec guide du pèlerin
  - ✅ **Médiathèque** - Bibliothèque multimédia avec catégories et ressources

### Formulaires Fonctionnels ✅ COMPLÉTÉS (Février 2025)
- **Newsletter** (`/api/newsletter/subscribe`)
  - Inscription avec email et langue préférée
  - Validation email côté serveur
  - Messages de succès multilingues
  - Détection doublons
  - Stockage MongoDB
- **Contact** (`/api/contact`)
  - Formulaire complet (nom, email, sujet, message)
  - Validation côté serveur
  - Messages de succès avec toast Sonner
  - Stockage MongoDB

### Composants Créés
- `Newsletter.js` - Formulaire d'inscription (2 variantes: default, compact) - **Fonctionnel + Multilingue**
- `StatsCounter.js` - Compteur animé de statistiques - **Multilingue**
- `Footer.js` - Footer global avec newsletter compacte
- `LanguageSelector.js` - ⭐ Sélecteur de langue (FR/EN/AR/WO) avec drapeaux
- `LanguageContext.js` - ⭐ Contexte multi-langue avec traductions complètes (1500+ lignes)

### API Endpoints
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/newsletter/subscribe` | POST | Inscription newsletter |
| `/api/newsletter/subscribers` | GET | Stats abonnés |
| `/api/contact` | POST | Envoi message contact |
| `/api/contact/messages` | GET | Liste messages |
| `/api/videos` | GET | Liste vidéos |
| `/api/videos/featured` | GET | Vidéos en vedette |
| `/api/categories` | GET | Catégories |

### Base de Données MongoDB
**Collections:**
- `newsletter_subscriptions`: `{ email, language, subscribed_at, active }`
- `contact_messages`: `{ nom, email, sujet, message, sent_at, id }`

## 📝 Backlog (P1-P3)

### P2 - Compléter le contenu
- [ ] Vérifier `/enseignements/ecole` - contenu de remplissage

### P1 - Migration du contenu vers MongoDB
- [ ] Migrer les textes des pages vers la base de données
- [ ] Créer un CMS simple pour l'administration
- [ ] API endpoints pour chaque type de contenu

### P2 - Moteur de recherche amélioré
- [ ] Endpoint backend pour recherche dans MongoDB
- [ ] Recherche multi-langue

### P3 - Fonctionnalités sociales
- [ ] Boutons de partage social
- [ ] Galerie de photos avec lightbox
- [ ] Intégration calendrier iCal

## 🔒 Informations Techniques

### Variables d'environnement
- **Frontend**: `REACT_APP_BACKEND_URL`
- **Backend**: `MONGO_URL`, `DB_NAME`

### Dépendances clés
- **Backend**: FastAPI, Motor (MongoDB async), Pydantic, python-dotenv
- **Frontend**: React, React Router, Tailwind CSS, Axios, Sonner (toasts), Lucide React (icônes)

## 📊 État du Projet

| Fonctionnalité | Status | Notes |
|----------------|--------|-------|
| Support Multilingue | ✅ 100% | FR, EN, AR, WO avec RTL |
| Newsletter | ✅ 100% | Backend + Frontend fonctionnels |
| Contact | ✅ 100% | Backend + Frontend fonctionnels |
| Pages traduites | ✅ 90% | Principales pages traduites |
| Contenu dynamique | ⏳ 10% | Encore codé en dur |
