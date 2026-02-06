# Tariqa Tidiane de Tivaouane - PRD (Product Requirements Document)

## 📋 Original Problem Statement
Création d'un portail web complet pour présenter la Tariqa Tidiane de Tivaouane, l'héritage spirituel d'El Hadji Malick Sy (Maodo), les enseignements de la confrérie Tijaniyya, et les événements religieux de la cité sainte.

## 🏗️ Architecture Technique
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (Python)
- **Base de données**: MongoDB (disponible mais non utilisée - données codées en dur)
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
   - `/evenements/gamou` - Le Gamou (date 2025: 4-5 septembre)
   - `/evenements/ziarra` - Ziarra Annuelles (date 2025: 20 avril)
   - `/evenements/ceremonies` - Cérémonies Religieuses + Hadratoul Joumah
5. **Autres**
   - `/archives` - Archives avec système de filtrage
   - `/mediatheque` - Médiathèque enrichie (Chaînes YouTube, Ressources téléchargeables)
   - `/contact` - Contact avec informations bancaires CRAT
   - `/gallery` - Galerie vidéos
   - `/search` - Recherche globale

### Support Multilingue ✅ COMPLÉTÉ (Décembre 2025)
- **4 langues supportées**: Français (FR), English (EN), العربية (AR), Wolof (WO)
- **Support RTL**: Direction droite-à-gauche automatique pour l'arabe
- **Persistance**: Choix de langue sauvegardé dans localStorage
- **Éléments traduits**: Navigation, Hero section, Citations, Événements, Newsletter, Statistiques, Footer
- **Pages entièrement traduites**:
  - ✅ Page Maodo (biographie, chronologie, contributions, citations, oeuvres)
  - ✅ Page Lignée des Héritiers (9 khalifes avec titres, descriptions, contributions)
  - ✅ Page Arbre Généalogique (titres, légende, instructions)
  - ✅ Page d'Accueil (toutes les sections)
  - ✅ Composants Newsletter et StatsCounter
  - ✅ Navigation et barre de recherche
- **Composants mis à jour**: Navbar, Home, Newsletter, StatsCounter, Maodo, LigneeKhalifes, ArbreGenealogique

### Composants Créés
- `Newsletter.js` - Formulaire d'inscription (2 variantes: default, compact) - **Multilingue**
- `StatsCounter.js` - Compteur animé de statistiques - **Multilingue**
- `Footer.js` - Footer global avec newsletter compacte
- `LanguageSelector.js` - ⭐ Sélecteur de langue (FR/EN/AR/WO) avec drapeaux
- `LanguageContext.js` - ⭐ Contexte multi-langue avec traductions complètes

### Photos Authentiques Intégrées
**Maodo (5 photos):**
- Portrait avec mosquée en arrière-plan
- Portrait sépia avec chapelet
- Avec ses disciples
- Portrait doré

**Héritiers (9 photos):**
1. Serigne Babacar Sy (1885-1957)
2. Serigne Mansour Sy 'Balkhawmi' (1900-1957)
3. Serigne Abdoul Aziz Sy 'Dabakh' (1904-1997)
4. Serigne Mouhammadoul Habib Sy (1906-1992)
5. Serigne Moustapha Sy Djamil (1916-1993)
6. Serigne Mansour Sy 'Borom Daradji' (1925-2012)
7. Serigne Cheikh Ahmed Tidiane Sy 'Al Maktoum' (1925-2017)
8. Serigne Abdoul Aziz Sy Al Amine (1928-2017)
9. Serigne Babacar Sy Mansour (1932-Actuel)

### SEO Implémenté
- Meta tags (description, keywords, author)
- Open Graph pour Facebook
- Twitter Cards
- Langue FR par défaut
- Police Amiri pour l'arabe

## 🔄 Tâches Prochaines (P1)

### Newsletter Backend
- [ ] Créer endpoint `/api/newsletter/subscribe`
- [ ] Collection MongoDB pour stocker les emails
- [ ] Validation email côté serveur

### Formulaire Contact
- [ ] Créer endpoint `/api/contact`
- [ ] Stocker messages dans MongoDB ou envoyer par email

### Compléter Contenu
- [ ] Vérifier `/enseignements/ecole` - contenu de remplissage

## 📝 Backlog (P2-P3)

### Migration Base de Données
- [ ] Migrer toutes les données codées en dur vers MongoDB
- [ ] Créer API CRUD pour gestion du contenu
- [ ] Panel d'administration

### Technique
- [ ] Lazy loading des images
- [ ] Service Worker pour PWA
- [ ] Améliorer moteur de recherche (backend)

### Fonctionnel
- [ ] Galerie de photos dédiée avec lightbox
- [ ] Espace membre / Authentification
- [ ] Système de favoris
- [ ] Partage sur réseaux sociaux
- [ ] Commentaires sur les vidéos

## 📁 Fichiers Clés

### Frontend
```
/app/frontend/src/
├── index.js (LanguageProvider wrapper) ✅
├── App.js (Routes)
├── components/
│   ├── Navbar.js (multilingue) ✅
│   ├── Newsletter.js (multilingue) ✅
│   ├── StatsCounter.js (multilingue) ✅
│   ├── Footer.js
│   ├── LanguageSelector.js ⭐
│   └── VideoCard.js
├── contexts/
│   └── LanguageContext.js ⭐ (FR/EN/AR/WO)
└── pages/
    ├── Home.js (multilingue) ✅
    ├── CarteTivaouane.js
    ├── ArbreGenealogique.js
    ├── histoire/
    │   ├── Maodo.js (galerie photos)
    │   └── LigneeKhalifes.js (photos authentiques)
    └── ...
```

### Backend
```
/app/backend/
├── server.py (FastAPI - vidéos codées en dur)
└── requirements.txt
```

## 🔗 Ressources Externes Utilisées
- **Gallica (BnF)**: Livre de Paul Marty 1917 - https://gallica.bnf.fr/ark:/12148/bpt6k77474r
- **Chaînes YouTube**: HABIBBA TV, TIVAOUANE 24 TV, Malikiya TV
- **PDF Ouvrages**: Scribd, ssmasenegal.com, Calameo

## 📅 Dates Importantes (2025)
- **Ziarra Générale**: 20 avril 2025
- **Gamou**: 4-5 septembre 2025 (12 Rabi' al-Awwal)
- **Hadratoul Joumah**: Tous les vendredis après Asr

## 🎨 Design System
- **Couleurs**: Vert #004D33, Or #D4AF37, Fond #F9F7F2
- **Fonts**: Inter (UI), Amiri (Arabe)
- **Composants**: Shadcn UI

---
*Dernière mise à jour: Décembre 2025*
