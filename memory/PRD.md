# Tariqa Tidiane de Tivaouane - PRD (Product Requirements Document)

## 📋 Original Problem Statement
Création d'un portail web complet pour présenter la Tariqa Tidiane de Tivaouane, l'héritage spirituel d'El Hadji Malick Sy (Maodo), les enseignements de la confrérie Tijaniyya, et les événements religieux de la cité sainte.

## 🏗️ Architecture Technique
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI (Python)
- **Base de données**: MongoDB (disponible mais non utilisée - données codées en dur)
- **URL Preview**: https://maodo-heritage.preview.emergentagent.com

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

### Composants Créés
- `Newsletter.js` - Formulaire d'inscription (2 variantes: default, compact)
- `StatsCounter.js` - Compteur animé de statistiques
- `Footer.js` - Footer global avec newsletter compacte
- `LanguageSelector.js` - Sélecteur de langue (FR/AR/WO)
- `LanguageContext.js` - Contexte multi-langue (traductions FR, Arabe, Wolof)

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

## 🔄 En Cours / À Compléter

### Multi-langue (Structure créée, intégration à finaliser)
- [x] Contexte LanguageContext créé
- [x] Traductions FR/AR/WO définies
- [x] Composant LanguageSelector créé
- [ ] Intégrer LanguageProvider dans App.js
- [ ] Ajouter LanguageSelector à la Navbar
- [ ] Appliquer les traductions aux composants

### Newsletter
- [x] Composant créé avec simulation
- [ ] Connecter à un vrai service (ex: Mailchimp, SendGrid)

## 📝 Backlog (P2)

### Technique
- [ ] Migrer les données vers MongoDB
- [ ] Créer API pour gestion du contenu
- [ ] Lazy loading des images
- [ ] Service Worker pour PWA

### Fonctionnel
- [ ] Espace membre / Authentification
- [ ] Système de favoris
- [ ] Partage sur réseaux sociaux
- [ ] Commentaires sur les vidéos

## 📁 Fichiers Clés

### Frontend
```
/app/frontend/src/
├── App.js (Routes)
├── components/
│   ├── Navbar.js
│   ├── Newsletter.js ⭐
│   ├── StatsCounter.js ⭐
│   ├── Footer.js ⭐
│   ├── LanguageSelector.js ⭐
│   └── VideoCard.js
├── contexts/
│   └── LanguageContext.js ⭐
└── pages/
    ├── Home.js
    ├── CarteTivaouane.js ⭐
    ├── ArbreGenealogique.js ⭐
    ├── histoire/
    │   ├── Maodo.js ⭐ (avec galerie photos)
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
*Dernière mise à jour: 6 février 2025*
