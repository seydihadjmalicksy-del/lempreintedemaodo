import { Book, FileText, Scroll, Download } from "lucide-react";

const OuvragesReference = () => {
  const ouvragesMajeurs = [
    {
      icon: Book,
      titre: "Kifâyat ar-Râghibîn",
      sousTitre: "كفاية الراغبين",
      auteur: "El Hadji Malick Sy",
      date: "Début du XXe siècle",
      description: "Ouvrage majeur sur la jurisprudence islamique selon l'école maliki et les fondements de la Tariqa Tidiane. C'est une encyclopédie qui traite de la purification, de la prière, du jeûne, de la zakat et du pèlerinage.",
      themes: ["Fiqh Maliki", "Pratiques rituelles", "Fondements de la Tariqa"],
      importance: "Texte de référence pour tous les disciples tidiane, étudié dans toutes les daaras"
    },
    {
      icon: Scroll,
      titre: "Khilâsatoul Madhâhib",
      sousTitre: "خلاصة المذاهب",
      auteur: "El Hadji Malick Sy",
      date: "1920",
      description: "Résumé des différentes écoles juridiques islamiques. Ouvrage comparatif qui présente les avis des quatre écoles sunnites sur les questions de jurisprudence.",
      themes: ["Droit comparé", "Écoles juridiques", "Ijtihad"],
      importance: "Démontre l'érudition de Maodo et sa capacité à naviguer entre les différentes écoles"
    },
    {
      icon: FileText,
      titre: "Recueil de Poèmes Mystiques",
      sousTitre: "قصائد في مدح النبي",
      auteur: "El Hadji Malick Sy",
      date: "1900-1922",
      description: "Collection de qasidas (poèmes) en l'honneur du Prophète Muhammad (PSL). Ces poèmes expriment un amour profond et une connexion spirituelle intense avec le Bien-Aimé.",
      themes: ["Poésie soufie", "Éloge du Prophète", "Mystique"],
      importance: "Récités lors du Gamou et des cérémonies religieuses, ils nourrissent la ferveur spirituelle"
    },
    {
      icon: Book,
      titre: "Tanbîhoul Ikhwân",
      sousTitre: "تنبيه الإخوان",
      auteur: "El Hadji Malick Sy",
      date: "1910",
      description: "Exhortation aux frères disciples. Traité sur les comportements à adopter et les attitudes à éviter pour le disciple tidiane.",
      themes: ["Adab (bienséance)", "Éthique soufie", "Conduite du disciple"],
      importance: "Guide pratique de vie pour le tidiane sincère"
    }
  ];

  const autresOuvrages = [
    {
      titre: "Commentaires sur le Coran",
      description: "Notes de tafsir dictées par Maodo lors de ses cours"
    },
    {
      titre: "Correspondances",
      description: "Lettres échangées avec d'autres érudits et disciples"
    },
    {
      titre: "Fatwas et Avis Juridiques",
      description: "Réponses aux questions de jurisprudence posées par les fidèles"
    }
  ];

  const bibliothequeNumerique = [
    {
      titre: "Kifâyat ar-Râghibîn (Version PDF)",
      taille: "15 MB",
      langue: "Arabe",
      disponible: true
    },
    {
      titre: "Recueil de Qasidas (Texte et Audio)",
      taille: "50 MB",
      langue: "Arabe avec traduction française",
      disponible: true
    },
    {
      titre: "Biographie de Maodo (Français)",
      taille: "5 MB",
      langue: "Français",
      disponible: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="ouvrages-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Ouvrages de Référence
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              L'Héritage Littéraire d'El Hadji Malick Sy
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
              El Hadji Malick Sy n'était pas seulement un guide spirituel, mais aussi un 
              <strong className="text-[#004D33]"> auteur prolifique</strong>. Malgré ses nombreuses 
              responsabilités, il a laissé une œuvre littéraire considérable qui témoigne de sa 
              maîtrise des sciences islamiques et de sa profondeur mystique.
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-[#004D33] italic mb-0">
                <strong>Note importante :</strong> De nombreux manuscrits de Maodo ont été perdus 
                ou dispersés. Un effort de collecte et de numérisation est en cours pour préserver 
                cet héritage précieux.
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
              Les Œuvres Majeures
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="space-y-8">
            {ouvragesMajeurs.map((ouvrage, index) => {
              const Icon = ouvrage.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                    <div className="bg-gradient-to-br from-[#004D33] to-[#003d29] p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-10 h-10 text-[#004D33]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {ouvrage.titre}
                      </h3>
                      <p className="text-[#D4AF37] text-2xl mb-2 bismillah-text">
                        {ouvrage.sousTitre}
                      </p>
                      <p className="text-white/70 text-sm">{ouvrage.date}</p>
                    </div>

                    <div className="lg:col-span-3 p-8">
                      <div className="mb-4">
                        <span className="text-sm text-[#888888]">Auteur : </span>
                        <span className="font-semibold text-[#004D33]">{ouvrage.auteur}</span>
                      </div>

                      <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                        {ouvrage.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="font-bold text-[#004D33] mb-3">Thèmes abordés :</h4>
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

                      <div className="bg-[#F9F7F2] rounded-lg p-4 border-l-4 border-[#D4AF37]">
                        <p className="text-sm text-[#004D33]">
                          <strong>Importance :</strong> {ouvrage.importance}
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
              Autres Écrits et Travaux
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {autresOuvrages.map((ouvrage, index) => (
              <div
                key={index}
                className="bg-[#F9F7F2] rounded-xl p-6 border-l-4 border-[#D4AF37] hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-[#004D33] mb-3">
                  {ouvrage.titre}
                </h3>
                <p className="text-[#4A4A4A]">
                  {ouvrage.description}
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
              Bibliothèque Numérique
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              Téléchargez gratuitement les ouvrages numérisés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bibliothequeNumerique.map((doc, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-[#004D33]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#004D33] mb-2">
                      {doc.titre}
                    </h3>
                    <div className="space-y-1 text-sm text-[#888888]">
                      <p>Taille : {doc.taille}</p>
                      <p>Langue : {doc.langue}</p>
                    </div>
                  </div>
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    doc.disponible
                      ? "bg-[#004D33] hover:bg-[#003d29] text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!doc.disponible}
                >
                  {doc.disponible ? "Télécharger" : "Bientôt disponible"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Contribuez à la Préservation
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            Si vous possédez des manuscrits, copies ou traductions des œuvres de Maodo, 
            contactez-nous pour participer à notre projet de numérisation.
          </p>

          <button className="bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl">
            Contribuer au Projet
          </button>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ
              <br />
              "En vérité, c'est Nous qui avons fait descendre le Rappel, et c'est Nous qui en sommes gardien"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OuvragesReference;