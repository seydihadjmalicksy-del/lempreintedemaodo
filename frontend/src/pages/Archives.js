import { Book, Image, Mic, Newspaper, Filter } from "lucide-react";
import { useState } from "react";

const Archives = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "Tout", icon: Filter },
    { id: "manuscrits", label: "Manuscrits", icon: Book },
    { id: "photos", label: "Photothèque", icon: Image },
    { id: "audio", label: "Archives Sonores", icon: Mic },
    { id: "presse", label: "Presse & Témoignages", icon: Newspaper }
  ];

  const archiveItems = [
    {
      id: 1,
      category: "manuscrits",
      title: "Kifâyat ar-Râghibîn",
      description: "Ouvrage majeur d'El Hadji Malick Sy sur la jurisprudence islamique et les fondements de la Tariqa",
      date: "1920",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      id: 2,
      category: "photos",
      title: "Construction de la Grande Mosquée",
      description: "Photos historiques de l'édification de la Grande Mosquée de Tivaouane",
      date: "1902-1930",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 3,
      category: "audio",
      title: "Causeries de Serigne Abdoul Aziz Sy Dabakh",
      description: "Enregistrements des tafsirs et enseignements spirituels du grand érudit",
      date: "1960-1990",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      id: 4,
      category: "manuscrits",
      title: "Poèmes Mystiques de Maodo",
      description: "Recueil de poésies à la gloire du Prophète (PSL) et de la voie soufie",
      date: "1910-1922",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      id: 5,
      category: "photos",
      title: "Portraits des Khalifes",
      description: "Collection de photographies des héritiers d'El Hadji Malick Sy",
      date: "1922-2024",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 6,
      category: "presse",
      title: "Articles Coloniaux",
      description: "Documents d'archives sur les relations entre l'administration française et la Zawiya",
      date: "1900-1960",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    }
  ];

  const filteredItems = selectedCategory === "all" 
    ? archiveItems 
    : archiveItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="archives-page">
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
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              Bienvenue dans le <strong className="text-[#004D33]">sanctuaire documentaire</strong> de L'empreinte de Tivaouane. 
              Cette rubrique n'est pas qu'un simple espace de stockage ; elle est la <strong className="text-[#004D33]">mémoire vive</strong> d'une 
              épopée spirituelle qui a façonné l'Islam en Afrique de l'Ouest.
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              Le projet de conservation de la Zawiya de Tivaouane répond à une <strong className="text-[#004D33]">exigence de transmission</strong>. 
              Comme l'enseignait Seydi El Hadji Malick Sy (rta), le savoir est une lumière qui ne doit jamais s'éteindre. 
              Ici, nous rassemblons les fragments d'histoire qui témoignent de la rigueur intellectuelle et de la profondeur mystique 
              de la lignée de Maodo.
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-base text-[#004D33] italic mb-0">
                <strong>Note aux chercheurs et disciples :</strong> Ces archives sont le fruit d'un travail méticuleux de collecte 
                et de restauration. Elles sont mises à votre disposition pour l'étude, la recherche et le recueillement. 
                Nous vous invitons à les parcourir avec le respect (Adab) dû à l'héritage de nos prédécesseurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  data-testid={`filter-${category.id}`}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? "bg-[#004D33] text-white shadow-lg"
                      : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9] hover:text-[#004D33] shadow-md"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Archives Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                data-testid={`archive-item-${item.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-[#E8F5E9] text-[#004D33] rounded-full text-xs font-bold uppercase">
                      {categories.find(c => c.id === item.category)?.label}
                    </span>
                    <span className="text-sm text-[#888888]">{item.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#004D33] mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-[#4A4A4A] mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <button className="text-[#004D33] hover:text-[#D4AF37] font-medium transition-colors inline-flex items-center gap-2">
                    Consulter l'archive
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Contribuez à la Préservation du Patrimoine
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Si vous possédez des documents, photos ou témoignages relatifs à l'histoire de Tivaouane, 
            nous serions honorés de les intégrer à notre collection.
          </p>
          <button className="bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl">
            Soumettre un Document
          </button>
        </div>
      </section>
    </div>
  );
};

export default Archives;