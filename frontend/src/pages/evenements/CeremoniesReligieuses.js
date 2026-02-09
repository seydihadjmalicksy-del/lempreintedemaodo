import { Clock, Users, Church, Sun } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const CeremoniesReligieuses = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Cérémonies Religieuses",
      subtitle: "Vie Spirituelle et Pratiques",
      heroDesc: "Les pratiques régulières qui rythment la vie spirituelle de la communauté tidiane",
      ceremoniesTitle: "Les Cérémonies Régulières",
      socialOrgTitle: "Organisation Sociale et Spirituelle",
      spiritualCommunity: "La Communauté Spirituelle",
      communityDesc: "Tivaouane n'est pas seulement un lieu de prière, c'est une communauté vivante où chaque membre a un rôle. De l'érudit qui enseigne au disciple qui apprend, du bénévole qui organise au pèlerin qui visite, tous participent à cette œuvre collective de préservation et de transmission de l'héritage spirituel de Maodo.",
      ceremonies: [
        {
          titre: "Hadratoul Joumah (Khadra)",
          frequence: "Tous les vendredis",
          description: "La Hadratoul Joumah est une veillée religieuse hebdomadaire instituée à la Zawiya El Hadji Malick Sy. C'est le moment privilégié de la semaine où les disciples se rassemblent pour le dhikr collectif et l'enseignement.",
          deroulement: [
            "Après Asr : Récitations coraniques",
            "Wird et Wazifa collectifs",
            "Enseignements sur la Tijaniyya",
            "Allocutions des guides religieux",
            "Clôture avec les invocations"
          ],
          particularite: "Organisée par la CEZAT, elle est diffusée en direct sur les chaînes HABIBBA TV et TIVAOUANE 24 TV."
        },
        {
          titre: "La Prière du Vendredi",
          frequence: "Hebdomadaire",
          description: "Le vendredi est le jour le plus important de la semaine pour les musulmans. À Tivaouane, la Grande Mosquée accueille des milliers de fidèles.",
          deroulement: [
            "12h30 : Appel à la prière (Adhan)",
            "13h00 : Khoutba (sermon) en arabe et wolof",
            "13h30 : Prière collective de deux rak'at",
            "14h00 : Wazifa collective"
          ],
          particularite: "Le Khalife ou son représentant dirige la prière."
        },
        {
          titre: "Les Prières des Deux Aïds",
          frequence: "Annuelle",
          description: "Aïd al-Fitr et Aïd al-Adha sont célébrés avec faste à Tivaouane.",
          deroulement: [
            "6h00 : Préparation et ablutions",
            "7h00 : Départ en procession",
            "8h00 : Prière collective de l'Aïd",
            "9h00 : Khoutba du Khalife"
          ],
          particularite: "Des centaines de milliers de personnes se rassemblent."
        },
        {
          titre: "Les Assemblées de Dhikr (Hadras)",
          frequence: "Quotidienne",
          description: "Séances collectives de dhikr organisées dans les mosquées et dahiras de Tivaouane.",
          deroulement: [
            "Après Maghreb : Récitation du Wird collectif",
            "Après Isha : Hadra avec chants spirituels",
            "Nuit du vendredi : Hadratul Jummah spéciale",
            "Récitation de Djawharatoul Kamal"
          ],
          particularite: "Ces assemblées créent une atmosphère spirituelle intense."
        },
        {
          titre: "Les Prières Nocturnes (Tahajjud)",
          frequence: "Particulièrement durant Ramadan",
          description: "Prières surérogatoires effectuées durant le dernier tiers de la nuit.",
          deroulement: [
            "3h00 du matin : Appel au Tahajjud",
            "Prière de 8 à 12 rak'at",
            "Invocations et repentir",
            "Lecture du Coran jusqu'à l'aube"
          ],
          particularite: "Durant les dix dernières nuits de Ramadan, la Grande Mosquée ne désemplit pas."
        }
      ],
      organisation: [
        {
          titre: "Les Dahiras",
          description: "Cercles d'études et de dhikr organisés par quartier ou par affinité.",
          role: "Organisation de la Wazifa hebdomadaire, entraide sociale, éducation religieuse"
        },
        {
          titre: "Le Conseil des Sages",
          description: "Instance composée de grands érudits et notables qui conseillent le Khalife.",
          role: "Médiation des conflits, gestion des affaires communautaires"
        },
        {
          titre: "Les Comités d'Organisation",
          description: "Bénévoles qui se chargent de la logistique lors des grands rassemblements.",
          role: "Accueil des pèlerins, sécurité, distribution d'eau et de nourriture"
        }
      ]
    },
    en: {
      title: "Religious Ceremonies",
      subtitle: "Spiritual Life and Practices",
      heroDesc: "The regular practices that rhythm the spiritual life of the Tidiane community",
      ceremoniesTitle: "Regular Ceremonies",
      socialOrgTitle: "Social and Spiritual Organization",
      spiritualCommunity: "The Spiritual Community",
      communityDesc: "Tivaouane is not just a place of prayer, it is a living community where each member has a role. From the scholar who teaches to the disciple who learns, from the volunteer who organizes to the pilgrim who visits, all participate in this collective work of preserving and transmitting Maodo's spiritual heritage.",
      ceremonies: [
        {
          titre: "Hadratoul Joumah (Khadra)",
          frequence: "Every Friday",
          description: "Hadratoul Joumah is a weekly religious vigil instituted at the El Hadji Malick Sy Zawiya. It is the privileged moment of the week when disciples gather for collective dhikr and teaching.",
          deroulement: [
            "After Asr: Quranic recitations",
            "Collective Wird and Wazifa",
            "Teachings on the Tijaniyya",
            "Addresses by religious guides",
            "Closing with invocations"
          ],
          particularite: "Organized by CEZAT, it is broadcast live on HABIBBA TV and TIVAOUANE 24 TV channels."
        },
        {
          titre: "Friday Prayer",
          frequence: "Weekly",
          description: "Friday is the most important day of the week for Muslims. In Tivaouane, the Great Mosque welcomes thousands of faithful.",
          deroulement: [
            "12:30 PM: Call to prayer (Adhan)",
            "1:00 PM: Khoutba (sermon) in Arabic and Wolof",
            "1:30 PM: Collective prayer of two rak'at",
            "2:00 PM: Collective Wazifa"
          ],
          particularite: "The Khalife or his representative leads the prayer."
        },
        {
          titre: "The Two Eid Prayers",
          frequence: "Annual",
          description: "Eid al-Fitr and Eid al-Adha are celebrated with great splendor in Tivaouane.",
          deroulement: [
            "6:00 AM: Preparation and ablutions",
            "7:00 AM: Departure in procession",
            "8:00 AM: Collective Eid prayer",
            "9:00 AM: Khoutba by the Khalife"
          ],
          particularite: "Hundreds of thousands of people gather together."
        },
        {
          titre: "Dhikr Assemblies (Hadras)",
          frequence: "Daily",
          description: "Collective dhikr sessions organized in mosques and dahiras of Tivaouane.",
          deroulement: [
            "After Maghreb: Collective Wird recitation",
            "After Isha: Hadra with spiritual songs",
            "Friday night: Special Hadratul Jummah",
            "Recitation of Djawharatoul Kamal"
          ],
          particularite: "These assemblies create an intense spiritual atmosphere."
        },
        {
          titre: "Night Prayers (Tahajjud)",
          frequence: "Especially during Ramadan",
          description: "Supererogatory prayers performed during the last third of the night.",
          deroulement: [
            "3:00 AM: Call to Tahajjud",
            "Prayer of 8 to 12 rak'at",
            "Invocations and repentance",
            "Quran reading until dawn"
          ],
          particularite: "During the last ten nights of Ramadan, the Great Mosque never empties."
        }
      ],
      organisation: [
        {
          titre: "The Dahiras",
          description: "Study and dhikr circles organized by neighborhood or affinity.",
          role: "Organization of weekly Wazifa, social solidarity, religious education"
        },
        {
          titre: "The Council of Elders",
          description: "Body composed of great scholars and notables who advise the Khalife.",
          role: "Conflict mediation, community affairs management"
        },
        {
          titre: "The Organization Committees",
          description: "Volunteers who handle logistics during major gatherings.",
          role: "Welcome of pilgrims, security, distribution of water and food"
        }
      ]
    },
    ar: {
      title: "المراسم الدينية",
      subtitle: "الحياة الروحية والممارسات",
      heroDesc: "الممارسات المنتظمة التي تنظم الحياة الروحية للمجتمع التجاني",
      ceremoniesTitle: "المراسم المنتظمة",
      socialOrgTitle: "التنظيم الاجتماعي والروحي",
      spiritualCommunity: "المجتمع الروحي",
      communityDesc: "تيفاوان ليست مجرد مكان للصلاة، إنها مجتمع حي حيث لكل عضو دور. من العالم الذي يعلم إلى المريد الذي يتعلم، من المتطوع الذي ينظم إلى الحاج الذي يزور، الكل يشارك في هذا العمل الجماعي لحفظ ونقل الإرث الروحي لمودو.",
      ceremonies: [
        {
          titre: "حضرة الجمعة (الخضرة)",
          frequence: "كل جمعة",
          description: "حضرة الجمعة هي سهرة دينية أسبوعية أُسست في زاوية الحاج مالك سي. إنها اللحظة المميزة في الأسبوع حيث يجتمع المريدون للذكر الجماعي والتعليم.",
          deroulement: [
            "بعد العصر: تلاوات قرآنية",
            "الورد والوظيفة الجماعية",
            "تعاليم عن الطريقة التجانية",
            "خطابات المرشدين الدينيين",
            "الختام بالدعاء"
          ],
          particularite: "تنظمها CEZAT وتُبث مباشرة على قناتي حبيبة TV وتيفاوان 24 TV."
        },
        {
          titre: "صلاة الجمعة",
          frequence: "أسبوعية",
          description: "الجمعة هو أهم يوم في الأسبوع للمسلمين. في تيفاوان، يستقبل المسجد الكبير آلاف المصلين.",
          deroulement: [
            "12:30: الأذان",
            "13:00: الخطبة بالعربية والولوفية",
            "13:30: صلاة الركعتين الجماعية",
            "14:00: الوظيفة الجماعية"
          ],
          particularite: "الخليفة أو من ينوب عنه يؤم الصلاة."
        },
        {
          titre: "صلاة العيدين",
          frequence: "سنوية",
          description: "يُحتفل بعيد الفطر وعيد الأضحى بفخامة في تيفاوان.",
          deroulement: [
            "6:00 صباحاً: التحضير والوضوء",
            "7:00: الانطلاق في موكب",
            "8:00: صلاة العيد الجماعية",
            "9:00: خطبة الخليفة"
          ],
          particularite: "يجتمع مئات الآلاف من الأشخاص."
        },
        {
          titre: "مجالس الذكر (الحضرات)",
          frequence: "يومية",
          description: "جلسات ذكر جماعية تُنظم في مساجد ودوائر تيفاوان.",
          deroulement: [
            "بعد المغرب: تلاوة الورد الجماعي",
            "بعد العشاء: حضرة مع الأناشيد الروحية",
            "ليلة الجمعة: حضرة الجمعة الخاصة",
            "تلاوة جوهرة الكمال"
          ],
          particularite: "هذه المجالس تخلق أجواء روحانية كثيفة."
        },
        {
          titre: "صلاة الليل (التهجد)",
          frequence: "خاصة في رمضان",
          description: "صلوات نافلة تُؤدى في الثلث الأخير من الليل.",
          deroulement: [
            "3:00 فجراً: النداء للتهجد",
            "صلاة من 8 إلى 12 ركعة",
            "الدعاء والتوبة",
            "قراءة القرآن حتى الفجر"
          ],
          particularite: "في العشر الأواخر من رمضان، لا يفرغ المسجد الكبير."
        }
      ],
      organisation: [
        {
          titre: "الدوائر",
          description: "حلقات دراسة وذكر منظمة حسب الأحياء أو الميول.",
          role: "تنظيم الوظيفة الأسبوعية، التكافل الاجتماعي، التعليم الديني"
        },
        {
          titre: "مجلس الحكماء",
          description: "هيئة مكونة من كبار العلماء والوجهاء الذين يقدمون المشورة للخليفة.",
          role: "الوساطة في النزاعات، إدارة شؤون المجتمع"
        },
        {
          titre: "لجان التنظيم",
          description: "متطوعون يتولون اللوجستيات خلال التجمعات الكبرى.",
          role: "استقبال الحجاج، الأمن، توزيع الماء والطعام"
        }
      ]
    },
    wo: {
      title: "Bëgg-bëgg Diine yi",
      subtitle: "Dund bu Sell ak Jëfandikukaay yi",
      heroDesc: "Jëfandikukaay yi di organise dund bu sell mbooloo Tijaan bi",
      ceremoniesTitle: "Bëgg-bëgg yi bu am saa",
      socialOrgTitle: "Organise mbooloo ak bu sell",
      spiritualCommunity: "Mbooloo bu Sell bi",
      communityDesc: "Tiwaawaan duul paxas julli rekk, mooy mbooloo bu dund fi ku nekk am liggéey. Ci boroom xam-xam bi di jàngale ba ci taalibe bi di jàng, ci bénévole bi di organise ba ci ajibi di ñëw, ñépp di bokk ci liggéey bu àddina bii ngir sàmm ak yekkat njàmbaar bu sell bu Maodo.",
      ceremonies: [
        {
          titre: "Hadratoul Joumah (Xadra)",
          frequence: "Àjjuma bu nekk",
          description: "Hadratoul Joumah mooy guddi diine bu ayu-bis bu sos ci Zawiya El Hadji Maalik Si. Mooy waxtu bu rafet ci ayu-bis bi fi taalibe yi di dajale ngir dhikr ak jàng.",
          deroulement: [
            "Ginnaaw Asr: Jàng Quraan",
            "Wird ak Wazifa mbooloo",
            "Jàng ci Tijaniyya",
            "Wax yi guide diine yi",
            "Mujj ci duas yi"
          ],
          particularite: "CEZAT moo ko organise, di ko diffuse direct ci HABIBBA TV ak TIVAOUANE 24 TV."
        },
        {
          titre: "Julli Àjjuma",
          frequence: "Ayu-bis bu nekk",
          description: "Àjjuma mooy bés bu gën mag ci ayu-bis bi ngir Jullit yi. Ci Tiwaawaan, Jammi bu Mag bi di jàpp ay junni nit.",
          deroulement: [
            "12h30: Adhan (woote julli)",
            "13h00: Khoutba ci arab ak wolof",
            "13h30: Julli mbooloo ci ñaari rakka",
            "14h00: Wazifa mbooloo"
          ],
          particularite: "Xaliifa bi walla ki ko tekki moo di imam."
        },
        {
          titre: "Julli Tabaski ak Korité",
          frequence: "At bu nekk",
          description: "Korité ak Tabaski di leen fete bu rafet ci Tiwaawaan.",
          deroulement: [
            "6h00: Jéema ak set",
            "7h00: Dem ci procession",
            "8h00: Julli Aïd mbooloo",
            "9h00: Khoutba Xaliifa bi"
          ],
          particularite: "Ay téeméer mille nit di dajale."
        },
        {
          titre: "Dajale Dhikr yi (Hadras)",
          frequence: "Bés bu nekk",
          description: "Séance dhikr mbooloo bu organise ci jamm yi ak dahira yi Tiwaawaan.",
          deroulement: [
            "Ginnaaw Timis: Jàng Wird mbooloo",
            "Ginnaaw Géew: Hadra ak woy bu sell",
            "Guddi Àjjuma: Hadratul Jummah bu ànd",
            "Jàng Djawharatoul Kamal"
          ],
          particularite: "Dajale yii di sos ambiance bu sell bu mag."
        },
        {
          titre: "Julli Guddi (Tahajjud)",
          frequence: "Ci Ramadan",
          description: "Julli nafila ci xaaji guddi gi.",
          deroulement: [
            "3h00 suba: Woote Tahajjud",
            "Julli 8 ba 12 rakka",
            "Duas ak tuub",
            "Jàng Quraan ba suba"
          ],
          particularite: "Ci 10 guddi yi mujj ci Ramadan, Jammi bu Mag bi fekkul ab waxtu."
        }
      ],
      organisation: [
        {
          titre: "Dahira yi",
          description: "Cercle jàng ak dhikr bu organise ci paxas walla affinité.",
          role: "Organise Wazifa ayu-bis, jàppale mbooloo, jàng diine"
        },
        {
          titre: "Njëkk yi bu Mag",
          description: "Instance bu ñaani boroom xam-xam ak notable yi di dimbalante Xaliifa bi.",
          role: "Ndaje konflit yi, gérer mbir mbooloo mi"
        },
        {
          titre: "Komite Organise yi",
          description: "Bénévole yi di jëf logistique ci dajale yu mag yi.",
          role: "Jot ajibi yi, kaaraange, weccil ndox ak lekk"
        }
      ]
    }
  };

  const t = translations[language] || translations.fr;
  const icons = [Clock, Church, Sun, Users, Clock];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="ceremonies-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              {t.subtitle}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {t.heroDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Ceremonies Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#004D33] mb-12 text-center">
            {t.ceremoniesTitle}
          </h2>
          
          <div className="space-y-8">
            {t.ceremonies.map((ceremony, index) => {
              const Icon = icons[index];
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                  data-testid={`ceremony-${index}`}
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                          <Icon className="w-7 h-7 text-[#004D33]" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-[#004D33]">{ceremony.titre}</h3>
                          <span className="text-[#D4AF37] font-medium">{ceremony.frequence}</span>
                        </div>
                      </div>
                      <p className="text-[#4A4A4A] leading-relaxed mb-4">
                        {ceremony.description}
                      </p>
                      <p className="text-sm text-[#888] italic">
                        {ceremony.particularite}
                      </p>
                    </div>
                    
                    <div className="lg:w-1/3">
                      <div className="bg-[#F9F7F2] rounded-xl p-6">
                        <h4 className="font-bold text-[#004D33] mb-4">{t.socialOrgTitle.split(' ')[0]}</h4>
                        <ul className="space-y-2">
                          {ceremony.deroulement.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#D4AF37] mt-1">•</span>
                              <span className="text-sm text-[#4A4A4A]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Organization Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#004D33] mb-12 text-center">
            {t.socialOrgTitle}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.organisation.map((org, index) => (
              <div
                key={index}
                className="bg-[#F9F7F2] rounded-xl p-6 border-t-4 border-[#D4AF37]"
              >
                <h3 className="text-xl font-bold text-[#004D33] mb-3">{org.titre}</h3>
                <p className="text-[#4A4A4A] mb-4">{org.description}</p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-[#888]">
                    <strong className="text-[#004D33]">Rôle :</strong> {org.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gradient-to-r from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{t.spiritualCommunity}</h2>
          <p className="text-lg text-white/90 leading-relaxed">
            {t.communityDesc}
          </p>
        </div>
      </section>
    </div>
  );
};

export default CeremoniesReligieuses;
