import { Star, BookOpen, MapPin, Calendar, Heart, Award, Quote, Users, Image } from "lucide-react";
import { useState } from "react";

const Maodo = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const photos = [
    {
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg",
      caption: "Portrait de Maodo avec la Grande Mosquée de Tivaouane en arrière-plan"
    },
    {
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/d5prlzpy_FB_IMG_1770343515975.jpg",
      caption: "El Hadji Malick Sy tenant son chapelet - Photo historique"
    },
    {
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/4jvj34rl_FB_IMG_1770343569579.jpg",
      caption: "Maodo accompagné de ses disciples à Tivaouane"
    },
    {
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ov0hfotv_FB_IMG_1770343528749.jpg",
      caption: "Portrait sépia d'El Hadji Malick Sy"
    }
  ];

  const timeline = [
    {
      year: "1855",
      title: "Naissance",
      description: "Naissance dans le quartier de Daw Fall à Gaya, département de Dagana, au nord du Sénégal.",
      icon: Star
    },
    {
      year: "1855-1862",
      title: "Mémorisation du Coran",
      description: "Mémorisation complète du Saint Coran en sept ans, démontrant une intelligence et une dévotion exceptionnelles.",
      icon: BookOpen
    },
    {
      year: "1862-1884",
      title: "Études islamiques",
      description: "25 années d'études approfondies en fiqh maliki, théologie, exégèse et sciences islamiques dans différents centres : Ndombo, Bokhol, Keur Kodé Alassane, Taiba Sèye, Saldé et Thiarène.",
      icon: BookOpen
    },
    {
      year: "1884",
      title: "Installation à Saint-Louis",
      description: "Installation à Saint-Louis pour enseigner. Il adopte le nom de Malick Fawade en hommage à sa pieuse mère.",
      icon: MapPin
    },
    {
      year: "1886-1888",
      title: "Pèlerinage à La Mecque",
      description: "Accomplissement du Hajj à 31 ans. Séjour de deux ans à La Mecque, passage par Marseille et Alexandrie. Il devient 'El Hadji' Malick Sy.",
      icon: Star
    },
    {
      year: "1892",
      title: "Construction de la Zawiya de Ndar",
      description: "Édification de la première zawiya à Saint-Louis (Ndar), centre d'enseignement et de spiritualité.",
      icon: MapPin
    },
    {
      year: "1900",
      title: "Installation à Tivaouane",
      description: "Sur invitation de Djibril Guèye, il s'établit définitivement à Tivaouane après un séjour à Ndiarndé.",
      icon: MapPin
    },
    {
      year: "1902",
      title: "Fondation de la Zawiya de Tivaouane",
      description: "Création de la zawiya principale de Tivaouane et institution de la première célébration du Mawlid (Gamou) avec El Hadji Rawane Ngom.",
      icon: Star
    },
    {
      year: "1922",
      title: "Rappel à Dieu",
      description: "Le 27 juin 1922, El Hadji Malick Sy rejoint son Seigneur à Tivaouane, où il est inhumé. Son fils Serigne Babacar Sy lui succède.",
      icon: Heart
    }
  ];

  const oeuvres = [
    "Khilâçu-Dhahab (L'Or Décanté) - 30 tableaux poétiques sur la vie du Prophète",
    "Fâkihat at-Tullâb - Principes de la Tariqa Tijaniyya",
    "Kifâyat ar-Râghibîn - Traité sur le soufisme",
    "Ifhâm al-Munkir al-Jânî - Défense de la Tariqa",
    "Wassilatoul Mouna (Tayssir) - Invocations des Noms d'Allah"
  ];

  const contributions = [
    {
      title: "Fondateur du Gamou",
      description: "Institution de la première célébration organisée du Mawlid Nabi au Sénégal en 1902",
      icon: Calendar
    },
    {
      title: "Bâtisseur d'écoles",
      description: "Fondation de nombreuses écoles coraniques au Djolof et au Walo",
      icon: BookOpen
    },
    {
      title: "Diffuseur de la Tijaniyya",
      description: "Propagation de la Tariqa Tijaniyya, devenue la principale confrérie soufie au Sénégal",
      icon: Users
    },
    {
      title: "Homme de paix",
      description: "Dialogue pacifique avec les colonisateurs plutôt que confrontation armée",
      icon: Heart
    },
    {
      title: "Auteur prolifique",
      description: "Rédaction d'ouvrages majeurs sur la théologie, le soufisme et la sunna prophétique",
      icon: BookOpen
    },
    {
      title: "Vivificateur de la Sunna",
      description: "Modèle achevé de piété, incarnant les enseignements du Prophète (PSL)",
      icon: Star
    }
  ];

  const citations = [
    {
      texte: "La science sans la pratique est comme un arbre sans fruit.",
      contexte: "Sur l'importance de l'action"
    },
    {
      texte: "Celui qui connaît Dieu, son cœur trouve la paix.",
      contexte: "Sur la connaissance divine"
    },
    {
      texte: "L'amour du Prophète (PSL) est la clé de tout bien.",
      contexte: "Sur l'amour prophétique"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="maodo-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-6">
              <Star className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">Le Fondateur</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              El Hadji Malick Sy
            </h1>
            <p className="text-2xl text-[#D4AF37] font-semibold mb-4">
              Maodo - مودّو
            </p>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              (1855 - 1922)
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Érudit, Saint, Fondateur de la Zawiya de Tivaouane et Vivificateur de la Sunna du Prophète (PSL)
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-8"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[#4A4A4A] leading-relaxed mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-[#004D33] first-letter:float-left first-letter:mr-3">
              El Hadji Malick Sy, affectueusement appelé <strong className="text-[#004D33]">Maodo</strong> (terme wolof signifiant "le Vénéré"), 
              fut l'un des plus grands érudits musulmans de l'Afrique de l'Ouest. Chef de la confrérie Tijaniyya au Sénégal, 
              il transforma Tivaouane en un centre spirituel rayonnant dont l'influence perdure jusqu'à nos jours.
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              Né en 1855 dans le village de Gaya au nord du Sénégal, il consacra sa vie entière à l'apprentissage, 
              l'enseignement et la diffusion de l'Islam selon la voie du Prophète Muhammad (PSL). Son érudition exceptionnelle, 
              sa piété exemplaire et sa sagesse firent de lui une référence incontournable pour des générations de musulmans.
            </p>

            <div className="bg-[#F9F7F2] border-l-4 border-[#D4AF37] p-6 rounded-r-lg my-8">
              <Quote className="w-8 h-8 text-[#D4AF37] mb-4" />
              <p className="text-lg italic text-[#4A4A4A]">
                "Chez Maodo, la dualité l'emporte sur l'alternative : il fut à la fois homme de science et homme d'action, 
                mystique et pragmatique, traditionaliste et moderniste."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie Photos */}
      <section className="py-16 bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-4">
              <Image className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">Photos Historiques</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Portraits de Maodo
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Photo principale */}
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={photos[selectedPhoto].url}
                  alt={photos[selectedPhoto].caption}
                  className="w-full h-auto max-h-[500px] object-contain bg-black"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <p className="text-white text-lg">{photos[selectedPhoto].caption}</p>
                </div>
              </div>
            </div>

            {/* Vignettes */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(index)}
                  className={`relative rounded-xl overflow-hidden aspect-square transition-all ${
                    selectedPhoto === index 
                      ? 'ring-4 ring-[#D4AF37] scale-95' 
                      : 'hover:ring-2 ring-white/50'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                  {selectedPhoto === index && (
                    <div className="absolute inset-0 bg-[#D4AF37]/20"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Parcours de Vie
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-[#D4AF37]/30 transform lg:-translate-x-1/2"></div>

            <div className="space-y-8">
              {timeline.map((event, index) => {
                const Icon = event.icon;
                const isLeft = index % 2 === 0;
                return (
                  <div key={index} className={`relative flex items-start gap-8 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`flex-1 ml-16 lg:ml-0 ${isLeft ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                        <span className="inline-block bg-[#004D33] text-white px-4 py-1 rounded-full text-sm font-bold mb-3">
                          {event.year}
                        </span>
                        <h3 className="text-xl font-bold text-[#004D33] mb-2">{event.title}</h3>
                        <p className="text-[#4A4A4A]">{event.description}</p>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute left-8 lg:left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#004D33] rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10">
                      <Icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>

                    {/* Empty space for alternating layout */}
                    <div className="hidden lg:block flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contributions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Ses Contributions Majeures
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributions.map((contribution, index) => {
              const Icon = contribution.icon;
              return (
                <div
                  key={index}
                  className="bg-[#F9F7F2] rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-[#004D33] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#D4AF37] transition-colors">
                    <Icon className="w-7 h-7 text-[#D4AF37] group-hover:text-[#004D33] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#004D33] mb-2">{contribution.title}</h3>
                  <p className="text-[#4A4A4A]">{contribution.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Oeuvres */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ses Œuvres Littéraires
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-white/80">
              Maodo a laissé un héritage littéraire inestimable
            </p>
          </div>

          <div className="space-y-4">
            {oeuvres.map((oeuvre, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4 hover:bg-white/20 transition-colors"
              >
                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-[#004D33]" />
                </div>
                <p className="text-white">{oeuvre}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/enseignements/ouvrages"
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-6 py-3 rounded-full font-bold transition-colors"
            >
              Voir tous les ouvrages
            </a>
          </div>
        </div>
      </section>

      {/* Citations */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Paroles de Sagesse
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {citations.map((citation, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <Quote className="w-8 h-8 text-[#D4AF37] mb-4" />
                <p className="text-lg text-[#004D33] font-medium italic mb-4">
                  "{citation.texte}"
                </p>
                <p className="text-sm text-[#888888]">{citation.contexte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Héritage */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-6">
            Son Héritage Éternel
          </h2>
          
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
            Aujourd'hui, plus d'un siècle après son rappel à Dieu, l'influence de Maodo continue de rayonner. 
            La Tariqa Tijaniyya est devenue la principale confrérie soufie au Sénégal, et le Gamou de Tivaouane 
            rassemble chaque année <strong className="text-[#004D33]">plus de 5 millions de fidèles</strong>. 
            Ses enseignements, transmis par ses successeurs, continuent d'éclairer les cœurs et les esprits 
            de millions de musulmans à travers le monde.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/histoire/khalifes"
              className="inline-flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-6 py-3 rounded-full font-bold transition-colors"
            >
              <Users className="w-5 h-5" />
              Ses Successeurs
            </a>
            <a
              href="/evenements/gamou"
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-6 py-3 rounded-full font-bold transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Le Gamou
            </a>
          </div>
        </div>
      </section>

      {/* Quote finale */}
      <section className="py-12 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-[#D4AF37] text-5xl mb-4">☪</p>
          <p className="text-xl italic text-white/90 mb-4">
            رَضِيَ اللهُ عَنْهُ وَأَرْضَاهُ
          </p>
          <p className="text-white/70">
            "Que Dieu soit satisfait de lui et le rende satisfait"
          </p>
        </div>
      </section>
    </div>
  );
};

export default Maodo;
