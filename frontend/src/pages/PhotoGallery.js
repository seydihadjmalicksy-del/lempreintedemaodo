import { useState, useEffect } from "react";
import { Image, Filter, Grid, List, X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import Lightbox from "../components/Lightbox";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PhotoGallery = () => {
  const { t, language } = useLanguage();
  const [photos, setPhotos] = useState([]);
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or masonry
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Static photos data (can be migrated to DB later)
  const staticPhotos = [
    {
      id: "1",
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg",
      title: { fr: "Grande Mosquée de Tivaouane", en: "Grand Mosque of Tivaouane", ar: "المسجد الكبير في تيفاوان", wo: "Jàkka bu mag Tiwaawaan" },
      description: { fr: "Vue majestueuse de la Grande Mosquée", en: "Majestic view of the Grand Mosque", ar: "منظر مهيب للمسجد الكبير", wo: "Gis bu rafet Jàkka bu mag bi" },
      category: "mosquee",
      featured: true
    },
    {
      id: "2",
      url: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg",
      title: { fr: "Rassemblement du Gamou", en: "Gamou Gathering", ar: "تجمع المولد", wo: "Ndaje Gamou gi" },
      description: { fr: "Des milliers de fidèles lors du Gamou annuel", en: "Thousands of faithful during the annual Gamou", ar: "آلاف المؤمنين خلال المولد السنوي", wo: "Ay mille mu gëm ci Gamou at bi" },
      category: "evenements",
      featured: true
    },
    {
      id: "3",
      url: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/eho1u4jg_FB_IMG_1770314970498.jpg",
      title: { fr: "El Hadji Malick Sy (Maodo)", en: "El Hadji Malick Sy (Maodo)", ar: "الحاج مالك سي (مودو)", wo: "El Hadji Maalik Si (Maodo)" },
      description: { fr: "Portrait du fondateur de Tivaouane", en: "Portrait of the founder of Tivaouane", ar: "صورة مؤسس تيفاوان", wo: "Nataal tëkkikat Tiwaawaan" },
      category: "portraits",
      featured: true
    },
    {
      id: "4",
      url: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/7lrnv6bf_FB_IMG_1770315030866.jpg",
      title: { fr: "Serigne Babacar Sy", en: "Serigne Babacar Sy", ar: "سرين باباكار سي", wo: "Serigne Babacar Sy" },
      description: { fr: "Deuxième Khalife Général des Tidianes", en: "Second General Khalife of Tidianes", ar: "الخليفة العام الثاني للتجانيين", wo: "Ñaareelu Xaliifa Général Tijaan yi" },
      category: "portraits",
      featured: false
    },
    {
      id: "5",
      url: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/b8cqv2mw_FB_IMG_1770315046169.jpg",
      title: { fr: "Serigne Abdoul Aziz Sy Dabakh", en: "Serigne Abdoul Aziz Sy Dabakh", ar: "سرين عبد العزيز سي دباخ", wo: "Serigne Abdoul Aziz Sy Dabakh" },
      description: { fr: "Troisième Khalife Général des Tidianes", en: "Third General Khalife of Tidianes", ar: "الخليفة العام الثالث للتجانيين", wo: "Ñettelu Xaliifa Général Tijaan yi" },
      category: "portraits",
      featured: false
    },
    {
      id: "6",
      url: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/v32i0zxx_FB_IMG_1770315055682.jpg",
      title: { fr: "Serigne Mansour Sy Borom Daradji", en: "Serigne Mansour Sy Borom Daradji", ar: "سرين منصور سي بوروم داراجي", wo: "Serigne Mansour Sy Borom Daradji" },
      description: { fr: "Quatrième Khalife Général des Tidianes", en: "Fourth General Khalife of Tidianes", ar: "الخليفة العام الرابع للتجانيين", wo: "Ñeenteelu Xaliifa Général Tijaan yi" },
      category: "portraits",
      featured: false
    },
    {
      id: "7",
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg",
      title: { fr: "Cérémonie de prière", en: "Prayer Ceremony", ar: "حفل الصلاة", wo: "Cérémonie julli" },
      description: { fr: "Moment de recueillement à la mosquée", en: "Moment of reflection at the mosque", ar: "لحظة تأمل في المسجد", wo: "Waxtu xel ci jàkka bi" },
      category: "ceremonies",
      featured: false
    },
    {
      id: "8",
      url: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg",
      title: { fr: "Ziarra Générale", en: "General Ziarra", ar: "الزيارة العامة", wo: "Ziarra Générale" },
      description: { fr: "Rassemblement annuel des disciples", en: "Annual gathering of disciples", ar: "التجمع السنوي للمريدين", wo: "Ndaje at taalibe yi" },
      category: "evenements",
      featured: false
    }
  ];

  const categoryLabels = {
    all: { fr: "Toutes", en: "All", ar: "الكل", wo: "Yépp" },
    mosquee: { fr: "Mosquée", en: "Mosque", ar: "المسجد", wo: "Jàkka" },
    portraits: { fr: "Portraits", en: "Portraits", ar: "صور شخصية", wo: "Nataal" },
    evenements: { fr: "Événements", en: "Events", ar: "فعاليات", wo: "Mbir yi" },
    ceremonies: { fr: "Cérémonies", en: "Ceremonies", ar: "احتفالات", wo: "Cérémonies" },
    archives: { fr: "Archives", en: "Archives", ar: "أرشيف", wo: "Archives" }
  };

  useEffect(() => {
    // Load photos
    setPhotos(staticPhotos);
    setFilteredPhotos(staticPhotos);
    
    // Extract unique categories
    const uniqueCategories = ["all", ...new Set(staticPhotos.map(p => p.category))];
    setCategories(uniqueCategories);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, photos]);

  const openLightbox = (index) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev < filteredPhotos.length - 1 ? prev + 1 : prev
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => prev > 0 ? prev - 1 : prev);
  };

  const getLocalizedText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    return textObj?.[language] || textObj?.fr || '';
  };

  const labels = {
    fr: { title: "Galerie Photos", subtitle: "Découvrez Tivaouane en images", photos: "photos", filterBy: "Filtrer par catégorie" },
    en: { title: "Photo Gallery", subtitle: "Discover Tivaouane in images", photos: "photos", filterBy: "Filter by category" },
    ar: { title: "معرض الصور", subtitle: "اكتشف تيفاوان بالصور", photos: "صور", filterBy: "تصفية حسب الفئة" },
    wo: { title: "Galerie Nataal", subtitle: "Gis Tiwaawaan ci nataal", photos: "nataal", filterBy: "Tànn catégorie" }
  };

  const label = labels[language] || labels.fr;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#004D33]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="photo-gallery-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-6">
            <Image className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-white font-semibold">{filteredPhotos.length} {label.photos}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{label.title}</h1>
          <p className="text-xl text-white/90">{label.subtitle}</p>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-5 h-5 text-[#004D33] mr-2" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-[#004D33] text-white"
                      : "bg-[#F9F7F2] text-[#4A4A4A] hover:bg-[#E8F5E9]"
                  }`}
                  data-testid={`filter-${cat}`}
                >
                  {categoryLabels[cat]?.[language] || cat}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#F9F7F2] rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-[#004D33] text-white" : "text-[#4A4A4A]"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "masonry" ? "bg-[#004D33] text-white" : "text-[#4A4A4A]"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPhotos.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === "grid" 
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}>
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className={`group relative overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${
                    photo.featured && viewMode === "masonry" ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                  data-testid={`photo-${photo.id}`}
                >
                  <div className={`aspect-square ${photo.featured && viewMode === "masonry" ? "md:aspect-auto md:h-full" : ""}`}>
                    <img
                      src={photo.url}
                      alt={getLocalizedText(photo.title)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-sm md:text-base mb-1">
                      {getLocalizedText(photo.title)}
                    </h3>
                    <p className="text-white/70 text-xs line-clamp-2">
                      {getLocalizedText(photo.description)}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 bg-[#D4AF37] text-[#004D33] text-xs font-semibold rounded-full w-fit">
                      {categoryLabels[photo.category]?.[language] || photo.category}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {photo.featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-[#D4AF37] text-[#004D33] text-xs font-bold rounded-full">
                      ★
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-[#888888] mx-auto mb-4" />
              <p className="text-[#888888]">
                {language === 'en' ? 'No photos in this category' : 
                 language === 'ar' ? 'لا توجد صور في هذه الفئة' :
                 language === 'wo' ? 'Amul nataal ci catégorie bii' :
                 'Aucune photo dans cette catégorie'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={filteredPhotos.map(p => ({
            url: p.url,
            title: getLocalizedText(p.title),
            description: getLocalizedText(p.description),
            category: categoryLabels[p.category]?.[language] || p.category
          }))}
          currentIndex={currentPhotoIndex}
          onClose={closeLightbox}
          onNext={nextPhoto}
          onPrev={prevPhoto}
        />
      )}
    </div>
  );
};

export default PhotoGallery;
