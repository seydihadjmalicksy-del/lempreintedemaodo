import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Share2, Loader2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const WattuArticle = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = {
    fr: {
      backToList: "Retour aux articles",
      publishedOn: "Publié le",
      by: "Par",
      share: "Partager",
      notFound: "Article non trouvé",
      loading: "Chargement..."
    },
    en: {
      backToList: "Back to articles",
      publishedOn: "Published on",
      by: "By",
      share: "Share",
      notFound: "Article not found",
      loading: "Loading..."
    },
    ar: {
      backToList: "العودة إلى المقالات",
      publishedOn: "نشر في",
      by: "بقلم",
      share: "مشاركة",
      notFound: "المقال غير موجود",
      loading: "جاري التحميل..."
    },
    wo: {
      backToList: "Dellu ci articles yi",
      publishedOn: "Bind ci",
      by: "Jëkk",
      share: "Séddoo",
      notFound: "Article bi amul",
      loading: "Yéegal..."
    }
  };

  const txt = translations[language] || translations.fr;

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/wattu/articles/${id}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const getLocalizedText = (obj, fallbackLang = 'fr') => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[language] || obj[fallbackLang] || Object.values(obj)[0] || '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : `${language}-${language.toUpperCase()}`, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: getLocalizedText(article.titre),
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  };

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

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#004D33] text-xl mb-4">{txt.notFound}</p>
          <Link to="/wattu" className="text-[#D4AF37] hover:underline">
            {txt.backToList}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="wattu-article-page">
      {/* Hero Image */}
      {article.image && (
        <div className="relative w-full bg-[#F5F5F0]">
          <div className="max-w-4xl mx-auto">
            <img
              src={article.image}
              alt={getLocalizedText(article.titre)}
              className="w-full h-auto object-contain max-h-[70vh]"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          to="/wattu"
          className="inline-flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {txt.backToList}
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#004D33] mb-6">
          {getLocalizedText(article.titre)}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-[#888888] mb-8 pb-8 border-b border-[#E8F5E9]">
          {article.auteur && (
            <span className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {article.auteur}
            </span>
          )}
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {formatDate(article.date_publication)}
          </span>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] transition-colors ml-auto"
          >
            <Share2 className="w-5 h-5" />
            {txt.share}
          </button>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-3 py-1 bg-[#E8F5E9] text-[#004D33] text-sm rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-[#4A4A4A] leading-relaxed whitespace-pre-wrap"
            style={{ fontSize: '1.125rem', lineHeight: '1.8' }}
          >
            {getLocalizedText(article.contenu)}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-[#E8F5E9] text-center">
          <div className="text-[#D4AF37] text-4xl mb-4 bismillah-text">☪</div>
          <p className="text-[#004D33] italic">
            "وَاللَّهُ يَهْدِي مَن يَشَاءُ إِلَىٰ صِرَاطٍ مُّسْتَقِيمٍ"
          </p>
        </div>
      </article>
    </div>
  );
};

export default WattuArticle;
