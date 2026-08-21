import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Calendar, User, Tag, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Wattu = () => {
  const { language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = {
    fr: {
      pageTitle: "Wattu - Opinions & Réflexions",
      pageSubtitle: "Espace de partage et de réflexion",
      introText: "Un espace de partage et de réflexion sur les enseignements spirituels, l'actualité de la communauté et les valeurs de la Tariqa Tidiane.",
      allCategories: "Toutes",
      readMore: "Lire la suite",
      noArticles: "Aucun article pour le moment",
      loading: "Chargement des articles...",
      publishedOn: "Publié le",
      by: "Par"
    },
    en: {
      pageTitle: "Wattu - Opinions & Reflections",
      pageSubtitle: "Space for sharing and reflection",
      introText: "A space for sharing and reflection on spiritual teachings, community news and the values of the Tariqa Tidiane.",
      allCategories: "All",
      readMore: "Read more",
      noArticles: "No articles yet",
      loading: "Loading articles...",
      publishedOn: "Published on",
      by: "By"
    },
    ar: {
      pageTitle: "واتو - آراء وتأملات",
      pageSubtitle: "مساحة للمشاركة والتأمل",
      introText: "مساحة للمشاركة والتأمل في التعاليم الروحية وأخبار المجتمع وقيم الطريقة التجانية.",
      allCategories: "الكل",
      readMore: "اقرأ المزيد",
      noArticles: "لا توجد مقالات حتى الآن",
      loading: "جاري تحميل المقالات...",
      publishedOn: "نشر في",
      by: "بقلم"
    },
    wo: {
      pageTitle: "Wattu - Xalaat ak Diggante",
      pageSubtitle: "Benn place ngir séddoo ak xalaat",
      introText: "Benn place ngir séddoo ak xalaat ci njàng yu spirityel, xibaar yu community bi ak solo yu Tariqa Tidiane.",
      allCategories: "Yépp",
      readMore: "Jàng la ci des",
      noArticles: "Amul benn article",
      loading: "Yéegal articles yi...",
      publishedOn: "Bind ci",
      by: "Jëkk"
    }
  };

  const txt = translations[language] || translations.fr;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/wattu/articles`),
          fetch(`${API_URL}/api/wattu/categories`)
        ]);

        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          setArticles(articlesData);
        }
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching wattu data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getLocalizedText = (obj, fallbackLang = 'fr') => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[language] || obj[fallbackLang] || Object.values(obj)[0] || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'wo' ? 'fr-FR' : `${language}-${language.toUpperCase()}`, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredArticles = selectedCategory === "all" 
    ? articles 
    : articles.filter(a => (a.categorie || a.category) === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#004D33] animate-spin mx-auto mb-4" />
          <p className="text-[#004D33] text-lg">{txt.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="wattu-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-8 h-8 text-[#004D33]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {txt.pageTitle}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              {txt.pageSubtitle}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {txt.introText}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-[#004D33] text-white"
                  : "bg-[#E8F5E9] text-[#004D33] hover:bg-[#004D33] hover:text-white"
              }`}
            >
              {txt.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#004D33] text-white"
                    : "bg-[#E8F5E9] text-[#004D33] hover:bg-[#004D33] hover:text-white"
                }`}
              >
                {getLocalizedText(cat.label)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-[#004D33]/30 mx-auto mb-4" />
              <p className="text-[#4A4A4A] text-lg">{txt.noArticles}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <article
                  key={article.id || index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                  data-testid={`wattu-article-${index}`}
                >
                  {(article.image || article.image_url) && (
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F0]">
                      <img
                        src={article.image || article.image_url}
                        alt={getLocalizedText(article.titre || article.title)}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#D4AF37] text-[#004D33] text-xs font-bold rounded-full">
                          {categories.find(c => c.id === (article.categorie || article.category))?.label?.[language] || article.categorie || article.category}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#004D33] mb-3 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {getLocalizedText(article.titre || article.title)}
                    </h3>
                    
                    <p className="text-[#4A4A4A] mb-4 line-clamp-3">
                      {getLocalizedText(article.contenu || article.excerpt || article.content)?.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-[#888888] mb-4">
                      {(article.auteur || article.author) && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {article.auteur || article.author}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(article.date_publication)}
                      </span>
                    </div>
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-[#E8F5E9] text-[#004D33] text-xs rounded">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <Link
                      to={`/wattu/${article.id}`}
                      className="inline-flex items-center gap-2 text-[#004D33] font-medium hover:text-[#D4AF37] transition-colors"
                    >
                      {txt.readMore}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-[#D4AF37] text-5xl mb-6 bismillah-text">☪</div>
          <p className="text-white/80 text-lg italic">
            "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ"
          </p>
          <p className="text-white/60 text-sm mt-2">
            Salat al-Fatihi - Prière sur le Prophète ﷺ
          </p>
        </div>
      </section>
    </div>
  );
};

export default Wattu;
