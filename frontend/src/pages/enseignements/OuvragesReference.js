import { useState, useEffect } from "react";
import { Book, FileText, Scroll, Download, ExternalLink, Loader2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OuvragesReference = () => {
  const { language, t } = useLanguage();
  const [ouvragesMajeurs, setOuvragesMajeurs] = useState([]);
  const [autresOuvrages, setAutresOuvrages] = useState([]);
  const [bibliothequeNumerique, setBibliothequeNumerique] = useState([]);
  const [archivesAcademiques, setArchivesAcademiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Icon mapping
  const iconMap = {
    Book: Book,
    Scroll: Scroll,
    FileText: FileText
  };

  // Translations
  const translations = {
    fr: {
      pageTitle: "Ouvrages de Référence",
      pageSubtitle: "L'Héritage Littéraire d'El Hadji Malick Sy",
      introText: "El Hadji Malick Sy n'était pas seulement un guide spirituel, mais aussi un",
      introHighlight: "auteur prolifique",
      introTextContinue: ". Malgré ses nombreuses responsabilités, il a laissé une œuvre littéraire considérable qui témoigne de sa maîtrise des sciences islamiques et de sa profondeur mystique.",
      noteTitle: "Note importante :",
      noteText: "De nombreux manuscrits de Maodo ont été perdus ou dispersés. Un effort de collecte et de numérisation est en cours pour préserver cet héritage précieux.",
      majorWorksTitle: "Les Œuvres Majeures",
      otherWorksTitle: "Autres Écrits et Travaux",
      digitalLibraryTitle: "Bibliothèque Numérique",
      digitalLibrarySubtitle: "Accédez aux œuvres numérisées et ressources en ligne",
      academicArchivesTitle: "Archives Académiques et Sources de Recherche",
      academicArchivesSubtitle: "Ressources académiques et institutionnelles pour approfondir vos recherches sur El Hadji Malick Sy",
      author: "Auteur",
      themes: "Thèmes abordés",
      importance: "Importance",
      format: "Format",
      language: "Langue",
      accessResource: "Accéder à la ressource",
      consultSource: "Consulter la source",
      contributeTitle: "Contribuez à la Préservation",
      contributeText: "Si vous possédez des manuscrits, copies ou traductions des œuvres de Maodo, contactez-nous pour participer à notre projet de numérisation.",
      contributeButton: "Contribuer au Projet",
      quranVerse: "\"En vérité, c'est Nous qui avons fait descendre le Rappel, et c'est Nous qui en sommes gardien\"",
      loading: "Chargement des ouvrages...",
      error: "Erreur lors du chargement des données"
    },
    en: {
      pageTitle: "Reference Works",
      pageSubtitle: "The Literary Heritage of El Hadji Malick Sy",
      introText: "El Hadji Malick Sy was not only a spiritual guide, but also a",
      introHighlight: "prolific author",
      introTextContinue: ". Despite his many responsibilities, he left a considerable literary work that testifies to his mastery of Islamic sciences and his mystical depth.",
      noteTitle: "Important note:",
      noteText: "Many of Maodo's manuscripts have been lost or scattered. An effort to collect and digitize them is underway to preserve this precious heritage.",
      majorWorksTitle: "Major Works",
      otherWorksTitle: "Other Writings and Works",
      digitalLibraryTitle: "Digital Library",
      digitalLibrarySubtitle: "Access digitized works and online resources",
      academicArchivesTitle: "Academic Archives and Research Sources",
      academicArchivesSubtitle: "Academic and institutional resources to deepen your research on El Hadji Malick Sy",
      author: "Author",
      themes: "Themes covered",
      importance: "Importance",
      format: "Format",
      language: "Language",
      accessResource: "Access resource",
      consultSource: "Consult source",
      contributeTitle: "Contribute to Preservation",
      contributeText: "If you have manuscripts, copies or translations of Maodo's works, contact us to participate in our digitization project.",
      contributeButton: "Contribute to the Project",
      quranVerse: "\"Indeed, it is We who sent down the Reminder, and indeed, We will be its guardian\"",
      loading: "Loading works...",
      error: "Error loading data"
    },
    ar: {
      pageTitle: "المؤلفات المرجعية",
      pageSubtitle: "التراث الأدبي للحاج مالك سي",
      introText: "لم يكن الحاج مالك سي مرشداً روحياً فحسب، بل كان أيضاً",
      introHighlight: "مؤلفاً غزير الإنتاج",
      introTextContinue: ". على الرغم من مسؤولياته العديدة، ترك إرثاً أدبياً كبيراً يشهد على إتقانه للعلوم الإسلامية وعمقه الصوفي.",
      noteTitle: "ملاحظة مهمة:",
      noteText: "فُقدت أو تبعثرت العديد من مخطوطات مودو. يجري حالياً جهد لجمعها ورقمنتها للحفاظ على هذا التراث الثمين.",
      majorWorksTitle: "الأعمال الرئيسية",
      otherWorksTitle: "كتابات وأعمال أخرى",
      digitalLibraryTitle: "المكتبة الرقمية",
      digitalLibrarySubtitle: "الوصول إلى الأعمال الرقمية والموارد عبر الإنترنت",
      academicArchivesTitle: "الأرشيف الأكاديمي ومصادر البحث",
      academicArchivesSubtitle: "موارد أكاديمية ومؤسسية لتعميق أبحاثك حول الحاج مالك سي",
      author: "المؤلف",
      themes: "المواضيع المتناولة",
      importance: "الأهمية",
      format: "الصيغة",
      language: "اللغة",
      accessResource: "الوصول للمورد",
      consultSource: "الاطلاع على المصدر",
      contributeTitle: "ساهم في الحفظ",
      contributeText: "إذا كنت تملك مخطوطات أو نسخاً أو ترجمات لأعمال مودو، تواصل معنا للمشاركة في مشروع الرقمنة.",
      contributeButton: "المساهمة في المشروع",
      quranVerse: "\"إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ\"",
      loading: "جاري تحميل المؤلفات...",
      error: "خطأ في تحميل البيانات"
    },
    wo: {
      pageTitle: "Téere yi ñuy Référence",
      pageSubtitle: "Jéggi Téere El Hadji Malick Sy",
      introText: "El Hadji Malick Sy du rekk guide spirituel, dafay nekk itam",
      introHighlight: "bindkat bu baax",
      introTextContinue: ". Moom te am dooleu responsabilité, dafa bàyyi téere yu bari yu won sa maîtrise ci Sciences Islamiques ak sa profondeur mystique.",
      noteTitle: "Xam-xam bu am solo:",
      noteText: "Ay manuscrits Maodo dañu ñàkk walla sànni. Dañuy jëf ngir jubal ak numériser ñoom ngir aar jéggi bi ci kaw.",
      majorWorksTitle: "Téere yi Ëpp Ci Solo",
      otherWorksTitle: "Yeneen Bindkat ak Jëf",
      digitalLibraryTitle: "Bibliothèque Numérique",
      digitalLibrarySubtitle: "Jël téere yi dañu numériser ak ressources yi ci Internet",
      academicArchivesTitle: "Archives Académiques ak Sources Recherche",
      academicArchivesSubtitle: "Ressources académiques ak institutionnelles ngir xam lu ëpp ci El Hadji Malick Sy",
      author: "Bindkat",
      themes: "Thèmes yi ñuy wax",
      importance: "Solo",
      format: "Format",
      language: "Làkk",
      accessResource: "Jël ressource bi",
      consultSource: "Xool source bi",
      contributeTitle: "Boole ci Aar bi",
      contributeText: "Soo am manuscrits, copies walla yëngal ci téere Maodo, jokkoo ak nun ngir boole ci sa projet numérisation.",
      contributeButton: "Boole ci Projet bi",
      quranVerse: "\"Nun la ko wàcce Zikr bi, te nun lanu koy aar\"",
      loading: "Yéegal téere yi...",
      error: "Njuumte ci yéegal données yi"
    }
  };

  const txt = translations[language] || translations.fr;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [majeursRes, autresRes, biblioRes, archivesRes] = await Promise.all([
          fetch(`${API_URL}/api/ouvrages/majeurs`),
          fetch(`${API_URL}/api/ouvrages/autres`),
          fetch(`${API_URL}/api/ouvrages/bibliotheque`),
          fetch(`${API_URL}/api/ouvrages/archives-academiques`)
        ]);

        if (!majeursRes.ok || !autresRes.ok || !biblioRes.ok || !archivesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [majeurs, autres, biblio, archives] = await Promise.all([
          majeursRes.json(),
          autresRes.json(),
          biblioRes.json(),
          archivesRes.json()
        ]);

        setOuvragesMajeurs(majeurs);
        setAutresOuvrages(autres);
        setBibliothequeNumerique(biblio);
        setArchivesAcademiques(archives);
        setError(null);
      } catch (err) {
        console.error("Error fetching ouvrages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get localized text
  const getLocalizedText = (obj, fallbackLang = 'fr') => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[language] || obj[fallbackLang] || Object.values(obj)[0] || '';
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg">{txt.error}</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="ouvrages-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {txt.pageTitle}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              {txt.pageSubtitle}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              {txt.introText}{" "}
              <strong className="text-[#004D33]">{txt.introHighlight}</strong>
              {txt.introTextContinue}
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-[#004D33] italic mb-0">
                <strong>{txt.noteTitle}</strong> {txt.noteText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ouvrages Majeurs */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              {txt.majorWorksTitle}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="space-y-8">
            {ouvragesMajeurs.map((ouvrage, index) => {
              const Icon = iconMap[ouvrage.icon] || Book;
              return (
                <div
                  key={ouvrage.id || index}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                  data-testid={`ouvrage-majeur-${index}`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                    <div className="bg-gradient-to-br from-[#004D33] to-[#003d29] p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-10 h-10 text-[#004D33]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {getLocalizedText(ouvrage.titre)}
                      </h3>
                      {ouvrage.sous_titre && (
                        <p className="text-[#D4AF37] text-2xl mb-2 bismillah-text">
                          {ouvrage.sous_titre}
                        </p>
                      )}
                      <p className="text-white/70 text-sm">{ouvrage.date}</p>
                    </div>

                    <div className="lg:col-span-3 p-8">
                      <div className="mb-4">
                        <span className="text-sm text-[#888888]">{txt.author} : </span>
                        <span className="font-semibold text-[#004D33]">{ouvrage.auteur}</span>
                      </div>

                      <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                        {getLocalizedText(ouvrage.description)}
                      </p>

                      {ouvrage.themes && ouvrage.themes.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold text-[#004D33] mb-3">{txt.themes} :</h4>
                          <div className="flex flex-wrap gap-2">
                            {ouvrage.themes.map((theme, idx) => (
                              <span
                                key={idx}
                                className="px-4 py-2 bg-[#E8F5E9] text-[#004D33] rounded-full text-sm font-medium"
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-[#F9F7F2] rounded-lg p-4 border-l-4 border-[#D4AF37]">
                        <p className="text-sm text-[#004D33]">
                          <strong>{txt.importance} :</strong> {getLocalizedText(ouvrage.importance)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Autres Ouvrages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              {txt.otherWorksTitle}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {autresOuvrages.map((ouvrage, index) => (
              <div
                key={ouvrage.id || index}
                className="bg-[#F9F7F2] rounded-xl p-6 border-l-4 border-[#D4AF37] hover:shadow-lg transition-shadow"
                data-testid={`autre-ouvrage-${index}`}
              >
                <h3 className="text-lg font-bold text-[#004D33] mb-3">
                  {getLocalizedText(ouvrage.titre)}
                </h3>
                <p className="text-[#4A4A4A]">
                  {getLocalizedText(ouvrage.description)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bibliothèque Numérique */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              {txt.digitalLibraryTitle}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              {txt.digitalLibrarySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bibliothequeNumerique.map((doc, index) => {
              // All documents should have a download button
              // For PDFs: use watermark endpoint, for others: direct link
              const isPdf = doc.lien && (
                doc.lien.toLowerCase().endsWith('.pdf') || 
                doc.format?.toLowerCase() === 'pdf' ||
                (doc.taille && doc.taille.toLowerCase().includes('pdf'))
              );
              const downloadUrl = isPdf 
                ? `${API_URL}/api/ouvrages/download/${doc.id}`
                : doc.lien;
              
              return (
                <div
                  key={doc.id || index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
                  data-testid={`bibliotheque-item-${index}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                      <Download className="w-6 h-6 text-[#004D33]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#004D33] mb-2">
                        {getLocalizedText(doc.titre)}
                      </h3>
                      <div className="space-y-1 text-sm text-[#888888]">
                        <p>{txt.format} : {doc.taille}</p>
                        <p>{txt.language} : {doc.langue}</p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={downloadUrl}
                    target={isPdf ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    download={isPdf ? true : undefined}
                    className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      doc.disponible
                        ? "bg-[#004D33] hover:bg-[#003d29] text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isPdf ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    {isPdf ? (language === 'fr' ? 'Télécharger le PDF' : 'Download PDF') : txt.accessResource}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Archives Académiques */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              {txt.academicArchivesTitle}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              {txt.academicArchivesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivesAcademiques.map((archive, index) => (
              <div
                key={archive.id || index}
                className="bg-[#F9F7F2] rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-[#E8F5E9]"
                data-testid={`archive-academique-${index}`}
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#004D33] text-white text-xs font-semibold rounded-full mb-3">
                    {archive.source}
                  </span>
                  <h3 className="font-bold text-[#004D33] text-lg mb-2">
                    {getLocalizedText(archive.titre)}
                  </h3>
                  <p className="text-[#4A4A4A] text-sm">
                    {getLocalizedText(archive.description)}
                  </p>
                </div>

                <a
                  href={archive.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {txt.consultSource}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {txt.contributeTitle}
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            {txt.contributeText}
          </p>

          <button className="bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl">
            {txt.contributeButton}
          </button>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ
              <br />
              {txt.quranVerse}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OuvragesReference;

