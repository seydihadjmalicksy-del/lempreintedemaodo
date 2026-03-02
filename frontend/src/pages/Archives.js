import { Book, Image, Mic, Filter, Play, ExternalLink, FileText, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AudioPlayer, VideoPlayerModal, VideoCard } from "../components/MediaPlayer";
import { useLanguage } from "../contexts/LanguageContext";
import PageMediaDisplay from "../components/PageMediaDisplay";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Archives = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [archiveData, setArchiveData] = useState({
    manuscripts: [],
    photos: [],
    audio: [],
    videos: [],
    sources: []
  });
  const { language } = useLanguage();

  // Fetch archives data from API
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        setLoading(true);
        const [manuscriptsRes, photosRes, audioRes, videosRes, sourcesRes] = await Promise.all([
          fetch(`${API_URL}/api/archives/manuscripts`),
          fetch(`${API_URL}/api/archives/photos`),
          fetch(`${API_URL}/api/archives/audio`),
          fetch(`${API_URL}/api/archives/videos`),
          fetch(`${API_URL}/api/archives/sources`)
        ]);
        
        const [manuscripts, photos, audio, videos, sources] = await Promise.all([
          manuscriptsRes.ok ? manuscriptsRes.json() : [],
          photosRes.ok ? photosRes.json() : [],
          audioRes.ok ? audioRes.json() : [],
          videosRes.ok ? videosRes.json() : [],
          sourcesRes.ok ? sourcesRes.json() : []
        ]);
        
        setArchiveData({ manuscripts, photos, audio, videos, sources });
      } catch (error) {
        console.error('Error fetching archives:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArchives();
  }, []);

  // Helper function to get translated text
  const getText = (item, field) => {
    if (!item || !item[field]) return '';
    if (typeof item[field] === 'string') return item[field];
    return item[field][language] || item[field].fr || '';
  };

  // UI translations
  const ui = {
    fr: {
      title: "Les Archives de la Khadra",
      subtitle: "« Préserver le passé pour éclairer le futur »",
      intro1: "Bienvenue dans le sanctuaire documentaire de L'empreinte de Maodo.",
      intro2: "Cette rubrique est la mémoire vive d'une épopée spirituelle qui a façonné l'Islam en Afrique de l'Ouest.",
      note: "Note aux chercheurs et disciples : Ces archives proviennent de sources authentifiées : BnF, Archive.org, UCAD, Scribd, et bibliothèques soufies. Parcourez-les avec le respect (Adab) dû à l'héritage de nos prédécesseurs.",
      manuscrits: "Manuscrits",
      photos: "Photothèque",
      audio: "Archives Sonores",
      videos: "Vidéothèque",
      all: "Tout",
      manuscritsTitle: "Manuscrits Numérisés",
      photosTitle: "Galerie Photos Historiques",
      audioTitle: "Archives Sonores - Khassaides",
      videosTitle: "Vidéothèque - Documentaires",
      sourcesTitle: "Sources Académiques",
      aboutKhassaides: "À propos des Khassaides",
      khassaidesDesc: "Les khassaides d'El Hadji Malick Sy sont des poèmes religieux composés en arabe, récités lors des cérémonies religieuses et méditations spirituelles.",
      audioSources: "Sources des enregistrements :",
      contributeTitle: "Contribuez à la Préservation du Patrimoine",
      contributeDesc: "Si vous possédez des documents, photos, enregistrements ou témoignages relatifs à l'histoire de Tivaouane et d'El Hadji Malick Sy, nous serions honorés de les intégrer à notre collection.",
      submitDoc: "Soumettre un Document",
      consult: "Consulter",
      consultSource: "Consulter la source",
      loading: "Chargement des archives..."
    },
    en: {
      title: "The Archives of the Khadra",
      subtitle: "« Preserving the past to illuminate the future »",
      intro1: "Welcome to the documentary sanctuary of The Legacy of Maodo.",
      intro2: "This section is the living memory of a spiritual epic that shaped Islam in West Africa.",
      note: "Note to researchers and disciples: These archives come from authenticated sources: BnF, Archive.org, UCAD, Scribd, and Sufi libraries. Browse them with the respect (Adab) due to the heritage of our predecessors.",
      manuscrits: "Manuscripts",
      photos: "Photo Library",
      audio: "Audio Archives",
      videos: "Video Library",
      all: "All",
      manuscritsTitle: "Digitized Manuscripts",
      photosTitle: "Historical Photo Gallery",
      audioTitle: "Audio Archives - Khassaides",
      videosTitle: "Video Library - Documentaries",
      sourcesTitle: "Academic Sources",
      aboutKhassaides: "About the Khassaides",
      khassaidesDesc: "The khassaides of El Hadji Malick Sy are religious poems composed in Arabic, recited during religious ceremonies and spiritual meditations.",
      audioSources: "Recording sources:",
      contributeTitle: "Contribute to Heritage Preservation",
      contributeDesc: "If you have documents, photos, recordings or testimonies related to the history of Tivaouane and El Hadji Malick Sy, we would be honored to include them in our collection.",
      submitDoc: "Submit a Document",
      consult: "View",
      consultSource: "View source",
      loading: "Loading archives..."
    },
    ar: {
      title: "أرشيف الخضرة",
      subtitle: "« الحفاظ على الماضي لإنارة المستقبل »",
      intro1: "مرحباً بكم في المحفظة الوثائقية لبصمة مودو.",
      intro2: "هذا القسم هو الذاكرة الحية لملحمة روحية شكّلت الإسلام في غرب أفريقيا.",
      note: "ملاحظة للباحثين والمريدين: هذه الأرشيفات من مصادر موثقة: BnF، Archive.org، UCAD، Scribd، والمكتبات الصوفية. تصفحوها باحترام (الأدب) الواجب لإرث أسلافنا.",
      manuscrits: "المخطوطات",
      photos: "معرض الصور",
      audio: "الأرشيف الصوتي",
      videos: "مكتبة الفيديو",
      all: "الكل",
      manuscritsTitle: "المخطوطات الرقمية",
      photosTitle: "معرض الصور التاريخية",
      audioTitle: "الأرشيف الصوتي - القصائد",
      videosTitle: "مكتبة الفيديو - الوثائقيات",
      sourcesTitle: "المصادر الأكاديمية",
      aboutKhassaides: "عن القصائد",
      khassaidesDesc: "قصائد الحاج مالك سي هي قصائد دينية مؤلفة بالعربية، تُتلى في المراسم الدينية والتأملات الروحية.",
      audioSources: "مصادر التسجيلات:",
      contributeTitle: "ساهم في حفظ التراث",
      contributeDesc: "إذا كنت تملك وثائق أو صور أو تسجيلات أو شهادات تتعلق بتاريخ تيفاوان والحاج مالك سي، سنكون مشرفين بإدراجها في مجموعتنا.",
      submitDoc: "إرسال وثيقة",
      consult: "عرض",
      consultSource: "عرض المصدر",
      loading: "جاري تحميل الأرشيف..."
    },
    wo: {
      title: "Dëgg yi Xadra",
      subtitle: "« Sàmm léegi ngir leer ëllëg »",
      intro1: "Dalal jàmm ci kër téere yi L'empreinte de Maodo.",
      intro2: "Rubrique bii mooy xel bu dund bu taariix bu sell bu sos diine Islaam ci Afrik àll-géej.",
      note: "Kàddu ngir seetkat yi ak taalibe yi: Dëgg yii jóge ci source yu dëgg: BnF, Archive.org, UCAD, Scribd, ak bibliothèque soufi yi. Seetlu leen ak Adab bu war ngir njàmbaar yi nijaay.",
      manuscrits: "Téere yi",
      photos: "Nataal yi",
      audio: "Dëgg baat yi",
      videos: "Bidiyo yi",
      all: "Lépp",
      manuscritsTitle: "Téere yi bu numérise",
      photosTitle: "Galerie Nataal yi bu yàgg",
      audioTitle: "Dëgg Baat yi - Khassaides",
      videosTitle: "Bidiyo yi - Documentaire",
      sourcesTitle: "Source Académique yi",
      aboutKhassaides: "Ci Khassaides yi",
      khassaidesDesc: "Khassaides El Hadji Maalik Si mooy woy diine bu bind ci arab, di ko jàng ci bëgg-bëgg diine yi ak méditation bu sell.",
      audioSources: "Source yi enregistrement:",
      contributeTitle: "Bokk ci Sàmm Njàmbaar bi",
      contributeDesc: "Su am nga téere, nataal, enregistrement walla seede bu jokk ci taariix Tiwaawaan ak El Hadji Maalik Si, dinanu bëgg ngir leen dugal ci collection bi.",
      submitDoc: "Yónnee Téere",
      consult: "Xool",
      consultSource: "Xool source bi",
      loading: "Di yeb dëgg yi..."
    }
  };

  const t = ui[language] || ui.fr;

  const categories = [
    { id: "all", label: t.all, icon: Filter },
    { id: "manuscrits", label: t.manuscrits, icon: Book },
    { id: "photos", label: t.photos, icon: Image },
    { id: "audio", label: t.audio, icon: Mic },
    { id: "videos", label: t.videos, icon: Play }
  ];

  // Get counts for stats
  const manuscriptsCount = archiveData.manuscripts.length;
  const photosCount = archiveData.photos.length;
  const audioCount = archiveData.audio.length;
  const videosCount = archiveData.videos.length;

  // Prepare audio tracks for player
  const audioTracks = archiveData.audio.map(track => ({
    title: track.title,
    author: track.author,
    duration: track.duration,
    audioUrl: track.audioUrl,
    source: track.source,
    coverImage: track.coverImage
  }));

  // Prepare videos with translated content
  const videos = archiveData.videos.map(video => ({
    title: getText(video, 'title'),
    description: getText(video, 'description'),
    youtubeId: video.youtubeId,
    duration: video.duration,
    views: video.views
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="archives-loading">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#004D33] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4A4A]">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="archives-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Video Modal */}
      {selectedVideo && (
        <VideoPlayerModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">{t.title}</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">{t.subtitle}</p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{manuscriptsCount}</div>
                <div className="text-sm text-white/70">{t.manuscrits}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{photosCount}</div>
                <div className="text-sm text-white/70">{t.photos}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{audioCount}</div>
                <div className="text-sm text-white/70">{t.audio}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{videosCount}</div>
                <div className="text-sm text-white/70">{t.videos}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">{t.intro1} {t.intro2}</p>
            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-base text-[#004D33] italic mb-0">{t.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 bg-[#F9F7F2] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  data-testid={`filter-${category.id}`}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-[#004D33] text-white shadow-lg"
                      : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9] hover:text-[#004D33] shadow-md"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Manuscrits Section */}
      {(selectedCategory === "all" || selectedCategory === "manuscrits") && archiveData.manuscripts.length > 0 && (
        <section className="py-12" data-testid="manuscrits-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Book className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">{t.manuscritsTitle}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveData.manuscripts.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                  data-testid={`manuscrit-${doc.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-[#E8F5E9] text-[#004D33] rounded-full text-xs font-bold">
                      {doc.type}
                    </span>
                    <span className="text-sm text-[#888]">{doc.date}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#004D33] mb-2">{getText(doc, 'title')}</h3>
                  <p className="text-[#4A4A4A] text-sm mb-4 line-clamp-3">{getText(doc, 'description')}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-[#888]">{doc.langue}</span>
                    <a
                      href={doc.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] font-medium text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t.consult}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photos Section */}
      {(selectedCategory === "all" || selectedCategory === "photos") && archiveData.photos.length > 0 && (
        <section className="py-12 bg-white" data-testid="photos-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Image className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">{t.photosTitle}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveData.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  data-testid={`photo-${photo.id}`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={photo.image}
                      alt={getText(photo, 'title')}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#D4AF37] font-semibold">{getText(photo, 'source')}</span>
                      <span className="text-xs text-[#888]">{photo.date}</span>
                    </div>
                    <h3 className="font-bold text-[#004D33] mb-1">{getText(photo, 'title')}</h3>
                    <p className="text-sm text-[#4A4A4A]">{getText(photo, 'description')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Audio Section */}
      {(selectedCategory === "all" || selectedCategory === "audio") && audioTracks.length > 0 && (
        <section className="py-12" data-testid="audio-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Mic className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">{t.audioTitle}</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Audio Player */}
              <div>
                <AudioPlayer 
                  tracks={audioTracks} 
                  currentTrack={currentAudioTrack}
                  setCurrentTrack={setCurrentAudioTrack}
                />
              </div>
              
              {/* Audio Info */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-[#004D33] mb-4">{t.aboutKhassaides}</h3>
                <p className="text-[#4A4A4A] mb-4">{t.khassaidesDesc}</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#004D33]">{t.audioSources}</h4>
                  <a 
                    href="https://archive.org/details/sidi-el-hadj-malick-sy-rta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-[#E8F5E9] rounded-lg hover:bg-[#d4e8d7] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-[#004D33]" />
                      <span className="font-medium text-[#004D33]">Archive.org</span>
                    </div>
                    <p className="text-sm text-[#4A4A4A] mt-1">Collection Sidi El Hadj Malick SY Rta</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Videos Section */}
      {(selectedCategory === "all" || selectedCategory === "videos") && videos.length > 0 && (
        <section className="py-12 bg-white" data-testid="videos-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Play className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">{t.videosTitle}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <VideoCard 
                  key={index}
                  video={video}
                  onClick={setSelectedVideo}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sources Académiques */}
      {selectedCategory === "all" && archiveData.sources.length > 0 && (
        <section className="py-12" data-testid="sources-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">{t.sourcesTitle}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveData.sources.map((source) => (
                <a
                  key={source.id}
                  href={source.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 hover:border-[#D4AF37]"
                >
                  <span className="inline-block px-3 py-1 bg-[#004D33] text-white text-xs font-semibold rounded-full mb-3">
                    {getText(source, 'source')}
                  </span>
                  <h3 className="font-bold text-[#004D33] mb-2">{getText(source, 'title')}</h3>
                  <p className="text-sm text-[#4A4A4A] mb-4">{getText(source, 'description')}</p>
                  <div className="flex items-center gap-2 text-[#D4AF37] font-medium text-sm">
                    <ExternalLink className="w-4 h-4" />
                    {t.consultSource}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Media Files Associated with Archives Page */}
      <section className="py-12 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageMediaDisplay pageSlug="archives" language={language} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t.contributeTitle}</h2>
          <p className="text-lg text-white/90 mb-8">{t.contributeDesc}</p>
          <a 
            href="/contact"
            className="inline-block bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            {t.submitDoc}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Archives;
