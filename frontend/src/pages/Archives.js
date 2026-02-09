import { Book, Image, Mic, Newspaper, Filter, Play, Download, ExternalLink, FileText, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { AudioPlayer, VideoPlayerModal, VideoCard } from "../components/MediaPlayer";

const Archives = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const categories = [
    { id: "all", label: "Tout", icon: Filter },
    { id: "manuscrits", label: "Manuscrits", icon: Book },
    { id: "photos", label: "Photothèque", icon: Image },
    { id: "audio", label: "Archives Sonores", icon: Mic },
    { id: "videos", label: "Vidéothèque", icon: Play }
  ];

  // Manuscrits numérisés avec liens réels
  const manuscrits = [
    {
      id: 1,
      title: "Khilassou Dhahab - Chapitres Essentiels",
      description: "Biographie poétique du Prophète (PSL) composée par El Hadji Malick Sy, récitée lors des Gamou. Texte arabe avec traduction française.",
      date: "XIXe siècle",
      langue: "Arabe + Français",
      lien: "https://fr.scribd.com/document/669838264/khilass-zahab",
      type: "PDF Scribd"
    },
    {
      id: 2,
      title: "Khilassou Zahab - Chapitre 1",
      description: "Premier chapitre louant Dieu, la création et l'âme du Prophète comme miroir de toute existence.",
      date: "XIXe siècle",
      langue: "Arabe",
      lien: "https://www.scribd.com/document/832319484/khilassou-Zahab-Chapitre-1",
      type: "PDF Scribd"
    },
    {
      id: 3,
      title: "Khilassou Zahab - Chapitre 3",
      description: "Sections sur les événements mecquois, prières et lignées ancestrales incluant Kinana, Khuzayma et Mudar.",
      date: "XIXe siècle",
      langue: "Arabe",
      lien: "https://www.scribd.com/document/740233380/khilass-zahab-Chap-3",
      type: "PDF Scribd"
    },
    {
      id: 4,
      title: "Tayssir (Wassilatoul Mouna) - Complet",
      description: "Ouvrage majeur d'El Hadji Malick Sy sur la voie spirituelle soufie. Transcription complète et traduction.",
      date: "Début XXe siècle",
      langue: "Arabe + Français",
      lien: "https://ssmasenegal.com/wp-content/uploads/2024/07/WASSILATOUL-MOUNA-TAYSSIR-transcription-complete-et-traduction.pdf",
      type: "PDF Direct"
    },
    {
      id: 5,
      title: "Tayssir - Version Scribd",
      description: "Version alternative numérisée du Tayssir disponible sur Scribd.",
      date: "Début XXe siècle",
      langue: "Arabe",
      lien: "https://fr.scribd.com/document/481857110/Tayssir-El-Hadj-Malick-Sy-pdf",
      type: "PDF Scribd"
    },
    {
      id: 6,
      title: "Fâkihatou Toullâb (فاكهة الطلاب)",
      description: "Le Fruit des Étudiants - Texte sur les principes généraux de la Tijaniyya et la discipline spirituelle des disciples.",
      date: "Début XXe siècle",
      langue: "Arabe",
      lien: "https://archive.org/details/20240423_20240423_0141",
      type: "Archive.org Audio"
    },
    {
      id: 7,
      title: "Ifhâm al-Munkir - Thèse Rawane Mbaye",
      description: "Thèse universitaire du Pr. Rawane Mbaye sur l'œuvre apologétique d'El Hadji Malick Sy.",
      date: "XXe siècle",
      langue: "Arabe + Français",
      lien: "https://fr.scribd.com/document/684807738/Ifham-Munkir-Al-Jaani-These-3-Rawane-Mbaye",
      type: "PDF Scribd"
    },
    {
      id: 8,
      title: "Le Nouveau Dîwân - 7 Tomes",
      description: "Présentation et inventaire du nouveau Dîwân d'El Hadji Malick Sy, père fondateur de la Zawiya Tidiane de Tivaouane.",
      date: "2020",
      langue: "Français",
      lien: "https://senharmattan.com/fr/religion/5312-presentation-et-inventaire-du-nouveau-diwan-d-el-hadji-malick-sy-pere-fondateur-de-la-zawiya-tidjan-de-tivaouane.html",
      type: "Livre"
    }
  ];

  // Photos historiques des Khalifes et de Tivaouane
  const photos = [
    {
      id: 1,
      title: "El Hadji Malick Sy - Portrait officiel",
      description: "Portrait historique de Seydi El Hadji Malick Sy (1855-1922), fondateur de la Zawiya de Tivaouane.",
      date: "Début XXe siècle",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg",
      source: "Archives familiales"
    },
    {
      id: 2,
      title: "El Hadji Malick Sy avec chapelet",
      description: "Photo historique montrant El Hadji Malick Sy tenant son chapelet.",
      date: "Début XXe siècle",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/d5prlzpy_FB_IMG_1770343515975.jpg",
      source: "Archives familiales"
    },
    {
      id: 3,
      title: "Maodo et ses disciples",
      description: "El Hadji Malick Sy accompagné de ses disciples à Tivaouane.",
      date: "Début XXe siècle",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/4jvj34rl_FB_IMG_1770343569579.jpg",
      source: "Archives Zawiya"
    },
    {
      id: 4,
      title: "Portrait sépia de Maodo",
      description: "Portrait en sépia d'El Hadji Malick Sy.",
      date: "Début XXe siècle",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ov0hfotv_FB_IMG_1770343528749.jpg",
      source: "Archives historiques"
    },
    {
      id: 5,
      title: "La Grande Mosquée de Tivaouane",
      description: "Vue de la Grande Mosquée de Tivaouane, site classé monument historique depuis 1902.",
      date: "XXe siècle",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg",
      source: "Archives Zawiya"
    },
    {
      id: 6,
      title: "Serigne Babacar Sy (1er Khalife)",
      description: "Serigne Khalifa Ababacar Sy (1885-1957), premier successeur de Maodo, fondateur des dahiras et initiateur de la ziarra générale en 1930.",
      date: "1922-1957",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/1b6zos47_FB_IMG_1770232308810.jpg",
      source: "Archives Khalifat"
    }
  ];

  // Archives sonores - Khassaides avec liens réels
  const audioTracks = [
    {
      title: "Tayssîr (Wassîlatul Munâ)",
      author: "El Hadji Malick Sy",
      duration: "20:54",
      audioUrl: "https://sopnabyfrance.com/wp-content/uploads/2023/01/Tayssir.mp3",
      source: "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/",
      coverImage: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg"
    },
    {
      title: "Zajrul Qulûb (زَجْرُ الْقُلُوبْ)",
      author: "El Hadji Malick Sy",
      duration: "15:30",
      audioUrl: "https://sopnabyfrance.com/wp-content/uploads/2023/01/Zadjroul-khouloub.mp3",
      source: "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/",
      coverImage: null
    },
    {
      title: "Yâ Kâchifad-Dâ-i",
      author: "El Hadji Malick Sy",
      duration: "12:45",
      audioUrl: "https://sopnabyfrance.com/wp-content/uploads/2023/01/Ya-kachifdaddahi.mp3",
      source: "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/",
      coverImage: null
    },
    {
      title: "Fanâdjînâ",
      author: "El Hadji Malick Sy",
      duration: "08:20",
      audioUrl: "https://sopnabyfrance.com/wp-content/uploads/2023/01/Fanadjina.mp3",
      source: "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/",
      coverImage: null
    },
    {
      title: "Al Munâjâ",
      author: "El Hadji Malick Sy",
      duration: "18:00",
      audioUrl: "https://sopnabyfrance.com/wp-content/uploads/2023/01/Al-Munaja.mp3",
      source: "https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/",
      coverImage: null
    }
  ];

  // Vidéos documentaires
  const videos = [
    {
      title: "L'Histoire de El Hadji Maodo Malick Sy - Documentaire Complet",
      description: "Documentaire complet sur la vie d'El Hadji Malick Sy : son arrivée à l'islam, son instruction, son pèlerinage, son installation à Tivaouane.",
      youtubeId: "NpOPd8AsV_c",
      duration: "45:00",
      views: 125000
    },
    {
      title: "El Hadji Malick Sy - Documentaire RTS",
      description: "Documentaire officiel de la RTS retraçant la vie et l'œuvre de Maodo (Septembre 2024).",
      youtubeId: "CQJ5rPB4baM",
      duration: "35:00",
      views: 89000
    },
    {
      title: "Documentaire Asfiyahi Television",
      description: "Documentaire de 29 minutes sur la vie et l'héritage spirituel de Seydil Hadji Malick Sy.",
      youtubeId: "Q0KxcWiBbXE",
      duration: "29:30",
      views: 67500
    },
    {
      title: "Mame Maodo : Le Sénégal dans l'histoire",
      description: "Série documentaire présentant l'histoire de Maodo et son impact sur l'histoire du Sénégal.",
      youtubeId: "aviqRGqHnPo",
      duration: "40:00",
      views: 52000
    },
    {
      title: "Khassida Lā Tarkanan - Traduction",
      description: "Récitation de la Khassida avec traduction en wolof et explications spirituelles en français.",
      youtubeId: "JWwRxPQPsCE",
      duration: "45:00",
      views: 34000
    },
    {
      title: "Récitation Khassaides - Nuit du Burd",
      description: "Nuit de récitation des khassaides par Doudou Kende et Abou Aziz Mbaye.",
      youtubeId: "iz3ozGdQ5aQ",
      duration: "1:20:00",
      views: 28000
    }
  ];

  // Sources académiques
  const sourcesAcademiques = [
    {
      title: "BnF - Fiche d'autorité Malick Sy",
      description: "Page officielle de la Bibliothèque nationale de France avec bibliographie complète.",
      lien: "https://data.bnf.fr/fr/14528700/malick_sy/",
      source: "Bibliothèque nationale de France"
    },
    {
      title: "Les Cahiers de l'Islam",
      description: "Article académique sur le rôle de la Tijaniyya dans l'islamisation du Sénégal.",
      lien: "https://www.lescahiersdelislam.fr/Elhadji-Malick-Sy-et-l-islamisation-du-Senegal-le-role-de-la-Tijaniyya-une-confrerie-soufie-d-origine-maghrebine_a1821.html",
      source: "Recherche Académique"
    },
    {
      title: "OpenEdition Journals",
      description: "Article de recherche dans la Revue des mondes musulmans et de la Méditerranée.",
      lien: "https://journals.openedition.org/remmm/21127",
      source: "OpenEdition"
    },
    {
      title: "Archive.org - Collection Audio",
      description: "Collection audio 'Sidi El Hadj Malick SY Rta' disponible en streaming et téléchargement.",
      lien: "https://archive.org/details/sidi-el-hadj-malick-sy-rta",
      source: "Internet Archive"
    },
    {
      title: "Thèses UCAD",
      description: "Collection de thèses et mémoires de l'Université Cheikh Anta Diop sur El Hadji Malick Sy.",
      lien: "http://bibnum.ucad.sn/greenstone/cgi-bin/library.cgi?e=q-00000-00---off-0theses",
      source: "UCAD Dakar"
    },
    {
      title: "Timbuktu Institute",
      description: "Analyse du rôle diplomatique pionnier de la zawiya de Tivaouane.",
      lien: "https://timbuktu-institute.org/index.php/toutes-l-actualites/item/289-tivaouane-le-role-diplomatique-pionnier-d-une-zawiya-rayonnante-par-dr-bakary-sambe",
      source: "Think Tank"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="archives-page">
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Les Archives de la Khadra
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              « Préserver le passé pour éclairer le futur »
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{manuscrits.length}</div>
                <div className="text-sm text-white/70">Manuscrits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{photos.length}</div>
                <div className="text-sm text-white/70">Photos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{audioTracks.length}</div>
                <div className="text-sm text-white/70">Audio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{videos.length}</div>
                <div className="text-sm text-white/70">Vidéos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              Bienvenue dans le <strong className="text-[#004D33]">sanctuaire documentaire</strong> de L'empreinte de Maodo. 
              Cette rubrique est la <strong className="text-[#004D33]">mémoire vive</strong> d'une épopée spirituelle 
              qui a façonné l'Islam en Afrique de l'Ouest.
            </p>
            
            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-base text-[#004D33] italic mb-0">
                <strong>Note aux chercheurs et disciples :</strong> Ces archives proviennent de sources authentifiées : 
                BnF, Archive.org, UCAD, Scribd, et bibliothèques soufies. Parcourez-les avec le respect (Adab) dû à l'héritage de nos prédécesseurs.
              </p>
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
      {(selectedCategory === "all" || selectedCategory === "manuscrits") && (
        <section className="py-12" data-testid="manuscrits-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Book className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">Manuscrits Numérisés</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {manuscrits.map((doc) => (
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
                  
                  <h3 className="text-lg font-bold text-[#004D33] mb-2">{doc.title}</h3>
                  <p className="text-[#4A4A4A] text-sm mb-4 line-clamp-3">{doc.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-[#888]">{doc.langue}</span>
                    <a
                      href={doc.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] font-medium text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Consulter
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photos Section */}
      {(selectedCategory === "all" || selectedCategory === "photos") && (
        <section className="py-12 bg-white" data-testid="photos-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Image className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">Galerie Photos Historiques</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  data-testid={`photo-${photo.id}`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#D4AF37] font-semibold">{photo.source}</span>
                      <span className="text-xs text-[#888]">{photo.date}</span>
                    </div>
                    <h3 className="font-bold text-[#004D33] mb-1">{photo.title}</h3>
                    <p className="text-sm text-[#4A4A4A]">{photo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Audio Section */}
      {(selectedCategory === "all" || selectedCategory === "audio") && (
        <section className="py-12" data-testid="audio-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Mic className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">Archives Sonores - Khassaides</h2>
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
                <h3 className="text-xl font-bold text-[#004D33] mb-4">À propos des Khassaides</h3>
                <p className="text-[#4A4A4A] mb-4">
                  Les khassaides d'El Hadji Malick Sy sont des poèmes religieux composés en arabe, 
                  récités lors des cérémonies religieuses et méditations spirituelles. Ils expriment 
                  l'amour du Prophète (PSL) et les enseignements de la voie soufie Tijaniyya.
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#004D33]">Sources des enregistrements :</h4>
                  <a 
                    href="https://sopnabyfrance.com/bibliotheque-seydil-hadji-malick-sy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-[#E8F5E9] rounded-lg hover:bg-[#d4e8d7] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-[#004D33]" />
                      <span className="font-medium text-[#004D33]">Sopna by France</span>
                    </div>
                    <p className="text-sm text-[#4A4A4A] mt-1">Bibliothèque Seydil Hadji Malick Sy</p>
                  </a>
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
      {(selectedCategory === "all" || selectedCategory === "videos") && (
        <section className="py-12 bg-white" data-testid="videos-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Play className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">Vidéothèque - Documentaires</h2>
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
      {selectedCategory === "all" && (
        <section className="py-12" data-testid="sources-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">Sources Académiques</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sourcesAcademiques.map((source, index) => (
                <a
                  key={index}
                  href={source.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 hover:border-[#D4AF37]"
                >
                  <span className="inline-block px-3 py-1 bg-[#004D33] text-white text-xs font-semibold rounded-full mb-3">
                    {source.source}
                  </span>
                  <h3 className="font-bold text-[#004D33] mb-2">{source.title}</h3>
                  <p className="text-sm text-[#4A4A4A] mb-4">{source.description}</p>
                  <div className="flex items-center gap-2 text-[#D4AF37] font-medium text-sm">
                    <ExternalLink className="w-4 h-4" />
                    Consulter
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Contribuez à la Préservation du Patrimoine
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Si vous possédez des documents, photos, enregistrements ou témoignages relatifs à l'histoire 
            de Tivaouane et d'El Hadji Malick Sy, nous serions honorés de les intégrer à notre collection.
          </p>
          <a 
            href="/contact"
            className="inline-block bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Soumettre un Document
          </a>
        </div>
      </section>
    </div>
  );
};

export default Archives;
