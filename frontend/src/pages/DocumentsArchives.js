import { Book, FileText, Image, ExternalLink, Calendar, MapPin, Camera, Archive, Eye } from "lucide-react";

const DocumentsArchives = () => {
  const gallicaPhotos = [
    {
      title: "Al-Hadj Malik, de Tivaouane",
      page: 176,
      folio: 194,
      description: "Portrait photographique d'El Hadji Malick Sy, fondateur de la Zawiya de Tivaouane. Photo prise du vivant de Maodo, vers 1912.",
      type: "photo",
      embedUrl: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f194.item",
      iiifUrl: "https://gallica.bnf.fr/iiif/ark:/12148/bpt6k77474r/f194/full/600,/0/native.jpg"
    },
    {
      title: "Al-Hadj Malik et deux de ses petits-fils, en voiture",
      page: 178,
      folio: 196,
      description: "El Hadji Malick Sy accompagné de deux de ses petits-fils. Au fond, on aperçoit sa mosquée à Tivaouane.",
      type: "photo",
      embedUrl: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f196.item",
      iiifUrl: "https://gallica.bnf.fr/iiif/ark:/12148/bpt6k77474r/f196/full/600,/0/native.jpg"
    },
    {
      title: "La mosquée des Tidianïa d'Al-Hadj Malik, à Tivaouane",
      page: 182,
      folio: 200,
      description: "Vue historique de la Grande Mosquée fondée par El Hadji Malick Sy à Tivaouane.",
      type: "photo",
      embedUrl: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f200.item",
      iiifUrl: "https://gallica.bnf.fr/iiif/ark:/12148/bpt6k77474r/f200/full/600,/0/native.jpg"
    },
    {
      title: "La mosquée d'Al-Hadj Malik, à Dakar",
      page: 202,
      folio: 220,
      description: "La première mosquée construite par Maodo à Dakar, témoignage de son expansion spirituelle dans la capitale.",
      type: "photo",
      embedUrl: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f220.item",
      iiifUrl: "https://gallica.bnf.fr/iiif/ark:/12148/bpt6k77474r/f220/full/600,/0/native.jpg"
    }
  ];

  const chapters = [
    {
      title: "Personnalité et Famille d'Al-Hadj Malik",
      page: 175,
      description: "Biographie détaillée et arbre généalogique de Maodo établis par l'administration coloniale.",
      link: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f193.item"
    },
    {
      title: "La Zaouïa d'Al-Hadj Malik à Tivaouane",
      page: 182,
      description: "Description de la zawiya, centre spirituel de la Tariqa Tidiane au Sénégal.",
      link: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f200.item"
    },
    {
      title: "L'Influence d'Al-Hadj Malik",
      page: 188,
      description: "Analyse de l'influence spirituelle et sociale de Maodo au Sénégal.",
      link: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f206.item"
    },
    {
      title: "Poème sur le Pèlerinage à La Mecque",
      page: 212,
      description: "Transcription d'un poème composé par El Hadji Malick Sy relatant son Hajj.",
      link: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f230.item"
    },
    {
      title: "Liste des Œuvres d'Al-Hadj Malik",
      page: 214,
      description: "Inventaire des ouvrages et écrits de Maodo recensés en 1917.",
      link: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f232.item"
    }
  ];

  const otherArchives = [
    {
      title: "Fidèles priant devant la tombe d'El Hadj Malick Sy (1958)",
      source: "Ministère des Armées - ECPAD",
      year: 1958,
      description: "Photographie noir et blanc montrant des fidèles en prière devant le mausolée de Maodo. Légende originale : 'Tivaouane, seconde ville sainte du Sénégal, Terre bénie de la secte tidjane'.",
      link: "https://imagesdefense.gouv.fr/fr/republique-du-senegal-tivaouane-1958-fildeles-priant-devant-la-tombe-de-el-hadj-malicksy-tivaouane-seconde-ville-sainte-du-senegal-terre-benie-de-la-secte-tidjane.html",
      type: "photo"
    },
    {
      title: "Carte Administrative du Sénégal Colonial",
      source: "Gallica - BnF",
      year: 1917,
      description: "Carte montrant l'organisation administrative du Sénégal à l'époque coloniale, incluant la région de Tivaouane.",
      link: "https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f189.item",
      type: "carte"
    },
    {
      title: "Carte Murale de l'AOF (1922)",
      source: "Gallica - BnF",
      year: 1922,
      description: "Grande carte de l'Afrique Occidentale Française par Édouard de Martonne, montrant les divisions administratives et ethnographiques.",
      link: "https://gallica.bnf.fr/ark:/12148/btv1b53064951c",
      type: "carte"
    }
  ];

  const relatedDocuments = [
    {
      title: "La confrérie layenne et les Lébou du Sénégal",
      author: "Cécile Laborde",
      description: "Étude comparative des confréries au Sénégal.",
      link: "https://gallica.bnf.fr/ark:/12148/bpt6k3323923w"
    },
    {
      title: "Le marabout et le prince : islam et pouvoir au Sénégal",
      author: "Christian Coulon",
      description: "Analyse des relations entre pouvoir spirituel et temporel.",
      link: "https://gallica.bnf.fr/ark:/12148/bpt6k3324467n"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="documents-archives-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-6">
              <Archive className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">Fonds Documentaires</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Archives et Documents Historiques
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              Sources primaires et photographies d'époque sur El Hadji Malick Sy et Tivaouane
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Source Principale */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#004D33] to-[#003d29] rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Book className="w-8 h-8 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] font-semibold">Source Principale - Gallica (BnF)</span>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  "Études sur l'Islam au Sénégal"
                </h2>
                
                <p className="text-xl text-white/90 mb-2">par Paul Marty (1917)</p>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  Document exceptionnel de 446 pages contenant le <strong>Chapitre III entièrement dédié à El Hadji Malick Sy</strong> (pages 173-216). 
                  Ce livre comprend des photographies historiques uniques, des descriptions de la Zawiya de Tivaouane, 
                  et la liste des œuvres de Maodo établie de son vivant.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://gallica.bnf.fr/ark:/12148/bpt6k77474r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-6 py-3 rounded-full font-bold transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Consulter sur Gallica
                  </a>
                  <a
                    href="https://gallica.bnf.fr/ark:/12148/bpt6k77474r/f191.item"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-bold transition-all"
                  >
                    <FileText className="w-5 h-5" />
                    Aller au Chapitre III
                  </a>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 text-[#D4AF37]">Informations</h3>
                <ul className="space-y-3 text-white/90">
                  <li className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    <span>Publié en 1917</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#D4AF37]" />
                    <span>446 pages numérisées</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-[#D4AF37]" />
                    <span>Photos historiques incluses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    <span>Domaine public</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photographies Historiques */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Photographies Historiques (1917)
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              Images d'époque d'El Hadji Malick Sy et de ses édifices religieux, extraites du livre de Paul Marty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gallicaPhotos.map((photo, index) => (
              <a
                key={index}
                href={photo.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Container with decorative background */}
                <div className="relative bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] aspect-[4/3] overflow-hidden flex items-center justify-center">
                  {/* Decorative Islamic pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>
                  
                  {/* Central content */}
                  <div className="relative z-10 text-center p-8">
                    <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10 text-[#004D33]" />
                    </div>
                    <p className="text-[#D4AF37] font-bold text-lg mb-2">Page {photo.page}</p>
                    <p className="text-white/70 text-sm">Cliquez pour voir l'image originale</p>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#004D33]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                      <p className="text-white font-bold">Voir sur Gallica</p>
                      <p className="text-white/70 text-sm">Haute résolution</p>
                    </div>
                  </div>
                </div>
                
                {/* Info Section */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="px-3 py-1 bg-[#E8F5E9] rounded-full">
                      <span className="text-[#004D33] text-xs font-semibold">Domaine Public</span>
                    </div>
                    <span className="text-[#888888] text-xs">Gallica - BnF</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#004D33] mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-[#4A4A4A] text-sm">
                    {photo.description}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Note about images */}
          <div className="mt-12 bg-white rounded-xl p-6 border-l-4 border-[#D4AF37]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                <Archive className="w-5 h-5 text-[#004D33]" />
              </div>
              <div>
                <h4 className="font-bold text-[#004D33] mb-2">À propos de ces documents</h4>
                <p className="text-[#4A4A4A] text-sm">
                  Ces photographies proviennent du livre <em>"Études sur l'Islam au Sénégal"</em> de Paul Marty, publié en 1917 
                  et numérisé par la Bibliothèque nationale de France (BnF). Elles sont dans le <strong>domaine public</strong> et 
                  constituent un témoignage historique précieux de Tivaouane à l'époque de Maodo. En cliquant sur chaque élément, 
                  vous accédez à la page originale sur Gallica où vous pouvez télécharger l'image en haute résolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapitres du Livre */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Chapitres sur El Hadji Malick Sy
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              Accès direct aux sections du livre consacrées à Maodo et à la Tariqa Tidiane
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <a
                key={index}
                href={chapter.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-6 bg-[#F9F7F2] hover:bg-[#E8F5E9] rounded-xl p-6 transition-all"
              >
                <div className="w-16 h-16 bg-[#004D33] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#D4AF37] font-bold text-lg">p.{chapter.page}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#004D33] group-hover:text-[#D4AF37] transition-colors mb-1">
                    {chapter.title}
                  </h3>
                  <p className="text-[#4A4A4A]">{chapter.description}</p>
                </div>

                <ExternalLink className="w-5 h-5 text-[#888888] group-hover:text-[#D4AF37] transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Autres Archives */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Autres Fonds d'Archives
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              Documents complémentaires provenant d'autres institutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {otherArchives.map((archive, index) => (
              <a
                key={index}
                href={archive.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                      {archive.type === 'photo' ? (
                        <Camera className="w-5 h-5 text-[#004D33]" />
                      ) : (
                        <MapPin className="w-5 h-5 text-[#004D33]" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-[#888888]">{archive.source}</p>
                      <p className="text-sm font-semibold text-[#D4AF37]">{archive.year}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#004D33] mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {archive.title}
                  </h3>
                  
                  <p className="text-sm text-[#4A4A4A] mb-4">
                    {archive.description}
                  </p>

                  <div className="flex items-center gap-2 text-[#004D33] group-hover:text-[#D4AF37] transition-colors">
                    <span className="text-sm font-semibold">Consulter</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Études Complémentaires */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Études Complémentaires
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              Ouvrages académiques sur l'Islam et les confréries au Sénégal disponibles sur Gallica
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedDocuments.map((doc, index) => (
              <a
                key={index}
                href={doc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 bg-[#F9F7F2] hover:bg-[#E8F5E9] rounded-xl p-6 transition-all"
              >
                <div className="w-12 h-12 bg-[#004D33] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Book className="w-6 h-6 text-[#D4AF37]" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#004D33] group-hover:text-[#D4AF37] transition-colors mb-1">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-[#D4AF37] mb-2">{doc.author}</p>
                  <p className="text-sm text-[#4A4A4A]">{doc.description}</p>
                </div>

                <ExternalLink className="w-5 h-5 text-[#888888] group-hover:text-[#D4AF37] transition-colors flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Note sur les Archives */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Préservation du Patrimoine
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            Ces documents d'archives constituent un témoignage précieux de l'histoire de Tivaouane 
            et de la Tariqa Tidiane. Les <strong>Archives nationales du Sénégal</strong> travaillent 
            actuellement à la numérisation de leurs fonds pour les rendre accessibles au public.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <p className="text-white/80 italic">
              Si vous possédez des documents, photographies ou manuscrits relatifs à 
              El Hadji Malick Sy ou à l'histoire de Tivaouane, contactez-nous pour contribuer 
              à la préservation de ce patrimoine spirituel.
            </p>
          </div>

          <div className="mt-8">
            <div className="text-[#D4AF37] text-5xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              رَبِّ زِدْنِي عِلْمًا
              <br />
              "Seigneur, augmente ma science" (Coran 20:114)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DocumentsArchives;
