import { BookOpen, Sun, Users, Clock } from "lucide-react";

const PiliersTariqa = () => {
  const piliers = [
    {
      icon: BookOpen,
      title: "Le Wird (الورد)",
      subtitle: "La Litanie Quotidienne",
      description: "Ensemble d'invocations prescrites à réciter matin et soir. C'est le cœur de la pratique tidiane.",
      details: [
        {
          name: "Istighfar (Demande de Pardon)",
          content: "100 fois : أَسْتَغْفِرُ اللهَ (Astaghfirullah)"
        },
        {
          name: "Salat Fatih (Prière sur le Prophète)",
          content: "100 fois une formule spécifique de bénédiction sur le Prophète (PSL)"
        },
        {
          name: "La ilaha illallah",
          content: "100 fois : لَا إِلٰهَ إِلَّا اللهُ (Attestation de l'unicité divine)"
        }
      ],
      conditions: "Doit être récité avec pureté rituelle (ablutions) et présence du cœur",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      icon: Users,
      title: "La Wazifa (الوظيفة)",
      subtitle: "L'Oraison Collective du Vendredi",
      description: "Récitation hebdomadaire collective effectuée le vendredi après-midi, réunissant les disciples.",
      details: [
        {
          name: "Istighfar",
          content: "1000 fois (مرة - fois)"
        },
        {
          name: "Djawharatoul Kamal",
          content: "12 fois (perle de la perfection - poème mystique)"
        },
        {
          name: "Salat Fatih",
          content: "50 à 100 fois selon les écoles"
        }
      ],
      conditions: "Pratique collective recommandée dans les dahiras (cercles d'études)",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      icon: Clock,
      title: "Hadratul Jummah (حضرة الجمعة)",
      subtitle: "L'Oraison du Vendredi Soir",
      description: "Moment de communion spirituelle intense, souvent accompagné de chants mystiques.",
      details: [
        {
          name: "La ilaha illallah",
          content: "1000 à 1600 fois selon la capacité"
        },
        {
          name: "Djawharatoul Kamal",
          content: "Récitation en groupe avec ferveur"
        },
        {
          name: "Chants spirituels",
          content: "Qasidas en l'honneur du Prophète (PSL)"
        }
      ],
      conditions: "Pratique collective dans une atmosphère de recueillement",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    }
  ];

  const principes = [
    {
      title: "L'Amour du Prophète (PSL)",
      description: "Le disciple tidiane doit cultiver un amour profond et constant pour le Prophète Muhammad (PSL), considéré comme la voie d'accès à Allah."
    },
    {
      title: "L'Attachement au Cheikh",
      description: "Respect et obéissance envers le guide spirituel qui transmet la Baraka (grâce divine) et guide le disciple sur le chemin."
    },
    {
      title: "La Régularité dans le Dhikr",
      description: "Constance dans la récitation quotidienne du Wird, même en voyage ou en état de difficulté."
    },
    {
      title: "L'Abandon des Innovations",
      description: "Stricte adhésion à la Sunna (tradition prophétique) et rejet des innovations blâmables (Bid'a)."
    },
    {
      title: "La Fraternité",
      description: "Amour et solidarité entre les disciples (Ikhwanes), formant une communauté spirituelle unie."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="piliers-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Les Piliers de la Tijaniyya
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              Les Fondements de la Voie Spirituelle
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
              La Tijaniyya repose sur des <strong className="text-[#004D33]">pratiques spirituelles 
              précises</strong> transmises directement par le Prophète Muhammad (PSL) à Cheikh Ahmed Tijani. 
              Ces pratiques, appelées <strong className="text-[#004D33]">Awrad</strong> (litanies), constituent 
              l'essence même de la voie.
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-[#004D33] italic mb-0">
                <strong>Principe fondamental :</strong> "La Tijaniyya ne demande ni retraite spirituelle 
                (Khalwa), ni jeûnes surérogatoires excessifs. Elle mise sur la simplicité et la régularité 
                dans l'invocation d'Allah, accessible à tout musulman sincère."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Les Trois Piliers Principaux */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Les Trois Oraisons Principales
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="space-y-12">
            {piliers.map((pilier, index) => {
              const Icon = pilier.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    <div className="relative h-64 lg:h-auto">
                      <img
                        src={pilier.image}
                        alt={pilier.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#004D33]/60 to-transparent flex items-end p-6">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <Icon className="w-8 h-8 text-[#004D33]" />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 p-8 lg:p-12">
                      <h3 className="text-3xl font-bold text-[#004D33] mb-2">
                        {pilier.title}
                      </h3>
                      <p className="text-xl text-[#D4AF37] font-semibold mb-4">
                        {pilier.subtitle}
                      </p>
                      <p className="text-lg text-[#4A4A4A] mb-6 leading-relaxed">
                        {pilier.description}
                      </p>

                      <div className="bg-[#F9F7F2] rounded-xl p-6 mb-6">
                        <h4 className="text-lg font-bold text-[#004D33] mb-4">Composition :</h4>
                        <div className="space-y-4">
                          {pilier.details.map((detail, idx) => (
                            <div key={idx} className="border-l-4 border-[#D4AF37] pl-4">
                              <p className="font-semibold text-[#004D33] mb-1">{detail.name}</p>
                              <p className="text-[#4A4A4A]">{detail.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#E8F5E9] rounded-lg p-4">
                        <p className="text-sm text-[#004D33]">
                          <strong>Conditions :</strong> {pilier.conditions}
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

      {/* Principes Éthiques */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Les Principes Éthiques et Spirituels
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              Au-delà des pratiques rituelles, la Tariqa Tidiane impose un code de conduite (Adab) 
              qui façonne la personnalité du disciple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principes.map((principe, index) => (
              <div
                key={index}
                className="bg-[#F9F7F2] rounded-xl p-8 border-l-4 border-[#D4AF37] hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-[#004D33] mb-4">
                  {principe.title}
                </h3>
                <p className="text-[#4A4A4A] leading-relaxed">
                  {principe.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spécificité de la Tariqa */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 lg:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-[#004D33] mb-6">
              La Spécificité de la Voie Tidiane
            </h2>
            
            <div className="space-y-6 text-lg text-[#4A4A4A] leading-relaxed">
              <p>
                Contrairement à d'autres voies soufies qui exigent des pratiques ascétiques rigoureuses, 
                la Tariqa Tidiane se distingue par sa <strong className="text-[#004D33]">simplicité</strong> 
                et son <strong className="text-[#004D33]">accessibilité</strong>.
              </p>

              <div className="bg-[#E8F5E9] p-6 rounded-lg">
                <h4 className="font-bold text-[#004D33] mb-3">Les Points Distinctifs :</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1 text-xl">✓</span>
                    <span><strong>Pas de retraite obligatoire (Khalwa) :</strong> Le disciple reste intégré 
                    dans la société et continue ses activités professionnelles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1 text-xl">✓</span>
                    <span><strong>Interdiction de mendier :</strong> Le tidiane doit travailler pour subvenir 
                    à ses besoins et préserver sa dignité</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1 text-xl">✓</span>
                    <span><strong>Exclusivité de la Tariqa :</strong> Le disciple ne peut appartenir à une 
                    autre confrérie simultanément</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1 text-xl">✓</span>
                    <span><strong>Promesse de récompense divine :</strong> Cheikh Ahmed Tijani a reçu la promesse 
                    que tout disciple régulier dans sa pratique entrera au Paradis sans passage par l'Enfer</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Une Voie d'Équilibre
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            La Tariqa Tidiane incarne l'équilibre entre la Loi (Sharia) et la Vérité (Haqiqa), 
            entre l'exigence spirituelle et la vie sociale, entre la science et l'amour divin. 
            C'est cette harmonie qui fait sa force et explique son expansion à travers le monde musulman.
          </p>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ
              <br />
              "Nous ne t'avons envoyé que comme une miséricorde pour les mondes"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PiliersTariqa;