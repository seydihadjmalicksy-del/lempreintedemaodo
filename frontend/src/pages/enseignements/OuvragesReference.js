import { Book, FileText, Scroll, Download, ExternalLink } from "lucide-react";

const OuvragesReference = () => {
  const ouvragesMajeurs = [
    {
      icon: Scroll,
      titre: "Khilâçu-Dhahab (L'Or Décanté)",
      sousTitre: "خلاص الذهب",
      auteur: "El Hadji Malick Sy",
      date: "Début du XXe siècle",
      description: "Chef-d'œuvre poétique composé de trente tableaux dédiés à la célébration de la vie du Prophète Muhammad (PSL). Tous les vers se terminent par la lettre 'M', d'où son nom populaire 'Mi-Mi-Ya'. Considéré comme un monument littéraire inégalé dans l'évocation de la vie du Prophète et les louanges qu'il lui adresse.",
      themes: ["Éloge du Prophète", "Poésie soufie", "Sira (Biographie prophétique)"],
      importance: "Chanté, traduit et commenté lors des Gamous à travers tout le Sénégal. Traduit en français par El Hadji Idrissa Mbengue Salif et Maodo Mbengue."
    },
    {
      icon: Book,
      titre: "Fâkihat at-Tullâb",
      sousTitre: "فاكهة الطلاب",
      auteur: "El Hadji Malick Sy",
      date: "Début du XXe siècle",
      description: "L'œuvre la plus célèbre de Maodo. Ce traité aborde les principes généraux de la Tariqa Tijaniyya et la discipline requise du murid (aspirant spirituel). L'ouvrage se conclut par une section sur 'La Divergence parmi les Saints de Dieu', reflétant l'ouverture d'esprit caractéristique de Maodo envers les différentes voies spirituelles.",
      themes: ["Principes de la Tariqa", "Conduite du murid", "Tolérance spirituelle"],
      importance: "Texte fondamental étudié dans toutes les daaras tidjanes, guide pratique pour tout aspirant spirituel"
    },
    {
      icon: Book,
      titre: "Kifâyat ar-Râghibîn",
      sousTitre: "كفاية الراغبين",
      auteur: "El Hadji Malick Sy",
      date: "Début du XXe siècle",
      description: "Traité essentiel couvrant un large éventail de thèmes soufis incluant l'ascétisme (Zuhd), les relations sociales (Mu'âmalât) et la relation avec Dieu. Maodo y emploie fréquemment le vers poétique à des fins pédagogiques pour faciliter la mémorisation.",
      themes: ["Ascétisme (Zuhd)", "Relations sociales", "Spiritualité"],
      importance: "Encyclopédie spirituelle servant de référence pour la formation des disciples"
    },
    {
      icon: FileText,
      titre: "Ifhâm al-Munkir al-Jânî",
      sousTitre: "إفهام المنكر الجاني",
      auteur: "El Hadji Malick Sy",
      date: "Début du XXe siècle",
      description: "Traité en arabe défendant la Tariqa Tijaniyya et le soufisme sunnite (tasawwuf as-sunnî) contre ses détracteurs. L'ouvrage commente la Jawharat al-Kamal pour mettre en lumière le soufisme orthodoxe et sa base textuelle, positionnant la Tijaniyya comme une voie légitime.",
      themes: ["Défense de la Tariqa", "Soufisme orthodoxe", "Réfutation"],
      importance: "Démonstration de l'érudition de Maodo et de sa maîtrise des sciences islamiques"
    },
    {
      icon: Scroll,
      titre: "Wassilatoul Mouna (Tayssir)",
      sousTitre: "وسيلة المنى (التيسير)",
      auteur: "El Hadji Malick Sy",
      date: "Début du XXe siècle",
      description: "Khassida (poème panégyrique soufi) visant à obtenir la réalisation des vœux par l'invocation des Beaux Noms d'Allah. Ce poème exprime la soumission totale à Dieu et la quête spirituelle du croyant.",
      themes: ["Invocation divine", "Noms d'Allah", "Supplication"],
      importance: "Récité régulièrement par les fidèles, disponible avec transcription et traduction française"
    },
    {
      icon: FileText,
      titre: "Zajrul Qulûb",
      sousTitre: "زجر القلوب",
      auteur: "El Hadji Malick Sy",
      date: "Début du XXe siècle",
      description: "Exhortation des cœurs. Traité spirituel sur la purification de l'âme et l'éveil des cœurs à la réalité divine.",
      themes: ["Purification spirituelle", "Éveil du cœur", "Rappel"],
      importance: "Guide pour la transformation intérieure du disciple"
    }
  ];

  const autresOuvrages = [
    {
      titre: "Dîwân El Hadji Malick Sy",
      description: "Recueil complet des poésies de Maodo, incluant des poèmes sur le Prophète, Cheikh Ahmed Tijani et El Hadji Oumar Foutiyou Tall. Nouvelle édition en sept tomes publiée au Maroc en 2022 pour le centenaire de sa disparition."
    },
    {
      titre: "Abada Buruq",
      description: "Ouvrage disponible en traduction française, faisant partie du corpus littéraire de Maodo."
    },
    {
      titre: "Khutbatul Jumu'a",
      description: "Sermons du vendredi prononcés par Maodo, préservés et transmis à travers les générations."
    },
    {
      titre: "Doua-oul Wazifa",
      description: "Invocations et prières de la Wazifa, pratique quotidienne des disciples tidjanes."
    }
  ];

  const bibliothequeNumerique = [
    {
      titre: "Wassilatoul Mouna (Tayssir) - PDF Complet",
      taille: "PDF",
      langue: "Arabe, Translittération et Français",
      disponible: true,
      lien: "https://ssmasenegal.com/wp-content/uploads/2024/07/WASSILATOUL-MOUNA-TAYSSIR-transcription-complete-et-traduction.pdf"
    },
    {
      titre: "Khilâçu-Dhahab - Version numérique",
      taille: "PDF",
      langue: "Arabe avec traduction française",
      disponible: true,
      lien: "https://www.calameo.com/books/0022411818a800b8305c6"
    },
    {
      titre: "Ifhâm al-Munkir - Thèse universitaire",
      taille: "PDF",
      langue: "Arabe et Français",
      disponible: true,
      lien: "https://fr.scribd.com/document/684807738/Ifham-Munkir-Al-Jaani-These-3-Rawane-Mbaye"
    },
    {
      titre: "Présentation du Nouveau Dîwân (7 tomes)",
      taille: "Livre",
      langue: "Français",
      disponible: true,
      lien: "https://senharmattan.com/fr/religion/5312-presentation-et-inventaire-du-nouveau-diwan-d-el-hadji-malick-sy-pere-fondateur-de-la-zawiya-tidjan-de-tivaouane.html"
    },
    {
      titre: "Thèse du Pr. Rawane Mbaye - Vol. 1 (Pensée et Action)",
      taille: "PDF",
      langue: "Français",
      disponible: true,
      lien: "https://fr.scribd.com/document/655798719/These-Du-Pr-Rawane-Mbaye-Vol-1-Tome-1-3"
    },
    {
      titre: "TAISSIR - Seydi El Hadji Malick Sy",
      taille: "PDF",
      langue: "Arabe",
      disponible: true,
      lien: "https://www.scribd.com/document/519357264/TAISSIR-Seydi-El-Hadji-Malick-Sy"
    },
    {
      titre: "El Hadji Malick Sy et l'islamisation du Sénégal",
      taille: "PDF",
      langue: "Français",
      disponible: true,
      lien: "https://fr.scribd.com/document/526108125/Elhadji-Malick-Sy-et-l-islamisation-du-Senegal"
    },
    {
      titre: "Exposé complet sur Seydil Hadji Malick Sy",
      taille: "PDF",
      langue: "Français",
      disponible: true,
      lien: "https://fr.scribd.com/document/836834898/expose-sur-seydil-hadji-malick-sy"
    },
    {
      titre: "El Hadji Malick Sy - Biographie (PDF)",
      taille: "PDF",
      langue: "Français",
      disponible: true,
      lien: "https://fr.scribd.com/document/409928831/El-Hadji-Malick-Sy-pdf"
    },
    {
      titre: "Édition complète des œuvres - Université Maroc",
      taille: "PDF Académique",
      langue: "Arabe et Français",
      disponible: true,
      lien: "https://www.uir.ac.ma/upload/media/639c87022344a508686074.pdf"
    }
  ];

  // Archives et Documents Académiques
  const archivesAcademiques = [
    {
      titre: "BnF - Fiche d'autorité Malick Sy",
      description: "Page officielle de la Bibliothèque nationale de France sur Malick Sy avec bibliographie complète",
      lien: "https://data.bnf.fr/fr/14528700/malick_sy/",
      source: "Bibliothèque nationale de France"
    },
    {
      titre: "Les Cahiers de l'Islam - Islamisation du Sénégal",
      description: "Article académique sur le rôle de la Tijaniyya dans l'islamisation du Sénégal",
      lien: "https://www.lescahiersdelislam.fr/Elhadji-Malick-Sy-et-l-islamisation-du-Senegal-le-role-de-la-Tijaniyya-une-confrerie-soufie-d-origine-maghrebine_a1821.html",
      source: "Les Cahiers de l'Islam"
    },
    {
      titre: "OpenEdition - Revue des Mondes Musulmans",
      description: "Article de recherche sur El Hadji Malick Sy dans la Revue des mondes musulmans et de la Méditerranée",
      lien: "https://journals.openedition.org/remmm/21127",
      source: "OpenEdition Journals"
    },
    {
      titre: "Timbuktu Institute - Rôle diplomatique de Tivaouane",
      description: "Analyse du rôle diplomatique pionnier de la zawiya de Tivaouane",
      lien: "https://timbuktu-institute.org/index.php/toutes-l-actualites/item/289-tivaouane-le-role-diplomatique-pionnier-d-une-zawiya-rayonnante-par-dr-bakary-sambe",
      source: "Timbuktu Institute"
    },
    {
      titre: "Éditions UCAD - El Hadji Malick Sy",
      description: "Publication universitaire de l'Université Cheikh Anta Diop de Dakar",
      lien: "https://editions.ucad.sn/ouvrages/65",
      source: "UCAD Dakar"
    },
    {
      titre: "Bibliothèque numérique UCAD - Thèses",
      description: "Collection de thèses et mémoires sur El Hadji Malick Sy",
      lien: "http://bibnum.ucad.sn/greenstone/cgi-bin/library.cgi?e=q-00000-00---off-0theses",
      source: "UCAD Bibliothèque"
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
              Accédez aux œuvres numérisées et ressources en ligne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p>Format : {doc.taille}</p>
                      <p>Langue : {doc.langue}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={doc.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    doc.disponible
                      ? "bg-[#004D33] hover:bg-[#003d29] text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Accéder à la ressource
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Archives Académiques et Sources de Recherche */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Archives Académiques et Sources de Recherche
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              Ressources académiques et institutionnelles pour approfondir vos recherches sur El Hadji Malick Sy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivesAcademiques.map((archive, index) => (
              <div
                key={index}
                className="bg-[#F9F7F2] rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-[#E8F5E9]"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#004D33] text-white text-xs font-semibold rounded-full mb-3">
                    {archive.source}
                  </span>
                  <h3 className="font-bold text-[#004D33] text-lg mb-2">
                    {archive.titre}
                  </h3>
                  <p className="text-[#4A4A4A] text-sm">
                    {archive.description}
                  </p>
                </div>

                <a
                  href={archive.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Consulter la source
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