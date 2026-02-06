import { MapPin, Navigation, Info, ExternalLink } from "lucide-react";
import { useState } from "react";

const CarteTivaouane = () => {
  const [selectedLieu, setSelectedLieu] = useState(null);

  const lieuxSacres = [
    {
      id: 1,
      nom: "Grande Mosquée de Tivaouane",
      description: "Fondée par El Hadji Malick Sy en 1904, la Grande Mosquée est le cœur spirituel de Tivaouane. Elle peut accueillir plus de 10 000 fidèles et abrite le mausolée de Maodo.",
      coordonnees: { lat: 14.9508, lng: -16.8222 },
      type: "mosquee",
      horaires: "Ouverte 24h/24 pour les prières",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 2,
      nom: "Mausolée d'El Hadji Malick Sy",
      description: "Lieu de repos éternel du fondateur Maodo, situé à l'intérieur de la Grande Mosquée. Des milliers de fidèles viennent y recueillir chaque année.",
      coordonnees: { lat: 14.9508, lng: -16.8220 },
      type: "mausolee",
      horaires: "Accessible pendant les heures de prière",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 3,
      nom: "Zawiya El Hadji Malick Sy",
      description: "Centre d'enseignement et de spiritualité fondé par Maodo. C'est ici que se tient la Hadratoul Joumah chaque vendredi.",
      coordonnees: { lat: 14.9512, lng: -16.8225 },
      type: "zawiya",
      horaires: "Hadratoul Joumah : Tous les vendredis après Asr",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 4,
      nom: "Champs de Courses (Gamou)",
      description: "Vaste espace où se rassemblent les millions de pèlerins lors du Gamou annuel. Des tentes et installations temporaires y sont montées.",
      coordonnees: { lat: 14.9480, lng: -16.8200 },
      type: "evenement",
      horaires: "Utilisé principalement lors du Gamou",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 5,
      nom: "Résidence du Khalife",
      description: "Demeure officielle du Khalife Général des Tidianes, Serigne Babacar Sy Mansour.",
      coordonnees: { lat: 14.9515, lng: -16.8218 },
      type: "residence",
      horaires: "Visites sur rendez-vous",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 6,
      nom: "Bibliothèque Seydi El Hadji Malick Sy",
      description: "Bibliothèque regroupant les manuscrits, ouvrages et archives de Maodo et des érudits tidiane.",
      coordonnees: { lat: 14.9505, lng: -16.8230 },
      type: "bibliotheque",
      horaires: "Lun-Sam : 9h-17h",
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'mosquee': return 'bg-[#004D33]';
      case 'mausolee': return 'bg-[#D4AF37]';
      case 'zawiya': return 'bg-[#2E7D32]';
      case 'evenement': return 'bg-[#FF9800]';
      case 'residence': return 'bg-[#1565C0]';
      case 'bibliotheque': return 'bg-[#7B1FA2]';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'mosquee': return 'Mosquée';
      case 'mausolee': return 'Mausolée';
      case 'zawiya': return 'Zawiya';
      case 'evenement': return 'Événement';
      case 'residence': return 'Résidence';
      case 'bibliotheque': return 'Bibliothèque';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="carte-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-6">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">Géographie Sacrée</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Carte Interactive de Tivaouane
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Découvrez les lieux saints de la cité spirituelle
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des lieux */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold text-[#004D33] mb-4">Lieux Saints</h2>
              
              {lieuxSacres.map((lieu) => (
                <button
                  key={lieu.id}
                  onClick={() => setSelectedLieu(lieu)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedLieu?.id === lieu.id 
                      ? 'bg-[#004D33] text-white shadow-lg' 
                      : 'bg-white hover:bg-[#E8F5E9] shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${getTypeColor(lieu.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <MapPin className={`w-5 h-5 ${selectedLieu?.id === lieu.id ? 'text-[#D4AF37]' : 'text-white'}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${selectedLieu?.id === lieu.id ? 'text-white' : 'text-[#004D33]'}`}>
                        {lieu.nom}
                      </h3>
                      <span className={`text-xs ${selectedLieu?.id === lieu.id ? 'text-[#D4AF37]' : 'text-[#888888]'}`}>
                        {getTypeLabel(lieu.type)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Carte et détails */}
            <div className="lg:col-span-2">
              {/* Carte Google Maps intégrée */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.8234567890123!2d-16.8222!3d14.9508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDU3JzAyLjkiTiAxNsKwNDknMTkuOSJX!5e0!3m2!1sfr!2ssn!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Carte de Tivaouane"
                  className="w-full"
                ></iframe>
              </div>

              {/* Détails du lieu sélectionné */}
              {selectedLieu ? (
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <img 
                      src={selectedLieu.image} 
                      alt={selectedLieu.nom}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className={`inline-block ${getTypeColor(selectedLieu.type)} text-white text-xs px-3 py-1 rounded-full mb-2`}>
                        {getTypeLabel(selectedLieu.type)}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{selectedLieu.nom}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-[#4A4A4A] mb-4">{selectedLieu.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-[#888888] mb-4">
                      <Info className="w-4 h-4" />
                      <span>{selectedLieu.horaires}</span>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedLieu.coordonnees.lat},${selectedLieu.coordonnees.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      Obtenir l'itinéraire
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <MapPin className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#004D33] mb-2">Sélectionnez un lieu</h3>
                  <p className="text-[#4A4A4A]">
                    Cliquez sur un lieu dans la liste pour voir ses détails et obtenir l'itinéraire.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Légende */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#004D33] mb-6 text-center">Légende</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { type: 'mosquee', label: 'Mosquée' },
              { type: 'mausolee', label: 'Mausolée' },
              { type: 'zawiya', label: 'Zawiya' },
              { type: 'evenement', label: 'Lieu d\'événement' },
              { type: 'residence', label: 'Résidence' },
              { type: 'bibliotheque', label: 'Bibliothèque' }
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${getTypeColor(item.type)} rounded-full`}></div>
                <span className="text-sm text-[#4A4A4A]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="py-12 bg-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#004D33] mb-6">Comment se rendre à Tivaouane ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-[#004D33] mb-2">Depuis Dakar</h3>
              <p className="text-sm text-[#4A4A4A]">~90 km (1h30 en voiture via l'autoroute A1)</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-[#004D33] mb-2">Depuis Thiès</h3>
              <p className="text-sm text-[#4A4A4A]">~20 km (30 min en voiture)</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-[#004D33] mb-2">Transport</h3>
              <p className="text-sm text-[#4A4A4A]">Bus, taxis et cars rapides disponibles</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarteTivaouane;
