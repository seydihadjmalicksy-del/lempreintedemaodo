import { Loader2, BookOpen, Star, Users, MapPin, Heart, Calendar, GraduationCap, Quote } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useDynamicPage } from "../hooks/useDynamicPage";

// Icon mapping
const iconMap = {
  BookOpen, Star, Users, MapPin, Heart, Calendar, GraduationCap, Quote
};

/**
 * Generic component to render a dynamic page
 * @param {string} slug - The page slug to load
 * @param {string} fallbackTitle - Fallback title if page not found
 * @param {React.ReactNode} fallbackContent - Fallback content to render
 */
const DynamicPageRenderer = ({ slug, fallbackTitle, fallbackContent, children }) => {
  const { language } = useLanguage();
  const { page, loading, error, getText, getSections, title, description, heroImage, heroIcon } = useDynamicPage(slug, language);

  // Get icon component
  const IconComponent = heroIcon && iconMap[heroIcon] ? iconMap[heroIcon] : BookOpen;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#004D33] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4A4A]">Chargement...</p>
        </div>
      </div>
    );
  }

  // If no dynamic content, render fallback
  if (error || !page) {
    if (fallbackContent) {
      return fallbackContent;
    }
    if (children) {
      return children;
    }
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#004D33] text-xl">{fallbackTitle || "Page non trouvée"}</p>
        </div>
      </div>
    );
  }

  const sections = getSections();

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid={`dynamic-page-${slug.replace('/', '-')}`}>
      {/* Hero Section */}
      <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#004D33] to-[#006644]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/95 via-[#004D33]/85 to-[#004D33]/75"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mb-6">
                <IconComponent className="w-8 h-8 text-[#004D33]" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                {title}
              </h1>
              {description && (
                <p className="text-xl text-white/90 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      {sections.map((section, index) => (
        <SectionRenderer 
          key={section.id || index} 
          section={section} 
          index={index}
          getText={getText}
          language={language}
        />
      ))}

      {/* Footer Quote */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-[#D4AF37] text-5xl mb-6">☪</div>
          <p className="text-white/80 text-lg italic">
            "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ الْفَاتِحِ لِمَا أُغْلِقَ"
          </p>
        </div>
      </section>
    </div>
  );
};

/**
 * Render individual section based on type
 */
const SectionRenderer = ({ section, index, getText, language }) => {
  const sectionTitle = getText(section.titre);
  const sectionContent = getText(section.contenu);
  const isEven = index % 2 === 0;

  switch (section.type) {
    case 'text':
      return (
        <section className={`py-16 ${isEven ? 'bg-white' : 'bg-[#F9F7F2]'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {sectionTitle && (
              <h2 className="text-3xl font-bold text-[#004D33] mb-6">{sectionTitle}</h2>
            )}
            <div className="prose prose-lg max-w-none">
              {sectionContent.split('\n').map((paragraph, i) => (
                paragraph.trim() && (
                  <p key={i} className="text-lg text-[#4A4A4A] leading-relaxed mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
            {section.image && (
              <img 
                src={section.image} 
                alt={sectionTitle} 
                className="mt-8 rounded-xl shadow-lg w-full max-w-2xl mx-auto"
              />
            )}
          </div>
        </section>
      );

    case 'quote':
      return (
        <section className="py-12 bg-[#E8F5E9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-l-4 border-[#D4AF37] pl-6">
              <Quote className="w-8 h-8 text-[#D4AF37] mb-4" />
              {sectionTitle && (
                <h3 className="text-xl font-bold text-[#004D33] mb-4">{sectionTitle}</h3>
              )}
              <blockquote className="text-lg text-[#004D33] italic leading-relaxed">
                {sectionContent.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </blockquote>
            </div>
          </div>
        </section>
      );

    case 'cards':
      const items = sectionContent.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
      return (
        <section className={`py-16 ${isEven ? 'bg-white' : 'bg-[#F9F7F2]'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {sectionTitle && (
              <h2 className="text-3xl font-bold text-[#004D33] mb-8 text-center">{sectionTitle}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#D4AF37] hover:shadow-lg transition-shadow">
                  <p className="text-[#004D33] font-medium">
                    {item.replace(/^[•\-]\s*/, '')}
                  </p>
                </div>
              ))}
            </div>
            {items.length === 0 && sectionContent && (
              <div className="prose prose-lg max-w-none text-center">
                <p className="text-[#4A4A4A]">{sectionContent}</p>
              </div>
            )}
          </div>
        </section>
      );

    case 'timeline':
      const timelineItems = sectionContent.split('\n').filter(line => line.includes(':'));
      return (
        <section className={`py-16 ${isEven ? 'bg-white' : 'bg-[#F9F7F2]'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {sectionTitle && (
              <h2 className="text-3xl font-bold text-[#004D33] mb-8 text-center">{sectionTitle}</h2>
            )}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#D4AF37]"></div>
              <div className="space-y-8">
                {timelineItems.map((item, i) => {
                  const [year, ...rest] = item.split(':');
                  const event = rest.join(':').trim();
                  return (
                    <div key={i} className="relative pl-12">
                      <div className="absolute left-0 w-8 h-8 bg-[#004D33] rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-md">
                        <span className="text-[#D4AF37] font-bold">{year.trim()}</span>
                        <p className="text-[#4A4A4A] mt-1">{event}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      );

    case 'image':
      return (
        <section className={`py-16 ${isEven ? 'bg-white' : 'bg-[#F9F7F2]'}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {sectionTitle && (
              <h2 className="text-3xl font-bold text-[#004D33] mb-8 text-center">{sectionTitle}</h2>
            )}
            {section.image && (
              <img 
                src={section.image} 
                alt={sectionTitle} 
                className="rounded-xl shadow-lg w-full max-w-4xl mx-auto"
              />
            )}
            {sectionContent && (
              <p className="text-center text-[#4A4A4A] mt-4 italic">{sectionContent}</p>
            )}
          </div>
        </section>
      );

    default:
      return (
        <section className={`py-16 ${isEven ? 'bg-white' : 'bg-[#F9F7F2]'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {sectionTitle && (
              <h2 className="text-3xl font-bold text-[#004D33] mb-6">{sectionTitle}</h2>
            )}
            <p className="text-lg text-[#4A4A4A] leading-relaxed">{sectionContent}</p>
          </div>
        </section>
      );
  }
};

export default DynamicPageRenderer;
