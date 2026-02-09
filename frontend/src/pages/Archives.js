import { Book, Image, Mic, Newspaper, Filter, Play, Download, ExternalLink, FileText, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { AudioPlayer, VideoPlayerModal, VideoCard } from "../components/MediaPlayer";
import { useLanguage } from "../contexts/LanguageContext";

const Archives = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { language } = useLanguage();

  // Translations for UI elements
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
      consultSource: "Consulter la source"
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
      consultSource: "View source"
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
      consultSource: "عرض المصدر"
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
      consultSource: "Xool source bi"
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

  // Manuscrits numérisés avec traductions
  const manuscritsData = {
    fr: [
      { id: 1, title: "Khilassou Dhahab - Chapitres Essentiels", description: "Biographie poétique du Prophète (PSL) composée par El Hadji Malick Sy, récitée lors des Gamou. Texte arabe avec traduction française.", date: "XIXe siècle", langue: "Arabe + Français", lien: "https://fr.scribd.com/document/669838264/khilass-zahab", type: "PDF Scribd" },
      { id: 2, title: "Khilassou Zahab - Chapitre 1", description: "Premier chapitre louant Dieu, la création et l'âme du Prophète comme miroir de toute existence.", date: "XIXe siècle", langue: "Arabe", lien: "https://www.scribd.com/document/832319484/khilassou-Zahab-Chapitre-1", type: "PDF Scribd" },
      { id: 3, title: "Khilassou Zahab - Chapitre 3", description: "Sections sur les événements mecquois, prières et lignées ancestrales incluant Kinana, Khuzayma et Mudar.", date: "XIXe siècle", langue: "Arabe", lien: "https://www.scribd.com/document/740233380/khilass-zahab-Chap-3", type: "PDF Scribd" },
      { id: 4, title: "Tayssir (Wassilatoul Mouna) - Complet", description: "Ouvrage majeur d'El Hadji Malick Sy sur la voie spirituelle soufie. Transcription complète et traduction.", date: "Début XXe siècle", langue: "Arabe + Français", lien: "https://ssmasenegal.com/wp-content/uploads/2024/07/WASSILATOUL-MOUNA-TAYSSIR-transcription-complete-et-traduction.pdf", type: "PDF Direct" },
      { id: 5, title: "Tayssir - Version Scribd", description: "Version alternative numérisée du Tayssir disponible sur Scribd.", date: "Début XXe siècle", langue: "Arabe", lien: "https://fr.scribd.com/document/481857110/Tayssir-El-Hadj-Malick-Sy-pdf", type: "PDF Scribd" },
      { id: 6, title: "Fâkihatou Toullâb (فاكهة الطلاب)", description: "Le Fruit des Étudiants - Texte sur les principes généraux de la Tijaniyya et la discipline spirituelle des disciples.", date: "Début XXe siècle", langue: "Arabe", lien: "https://archive.org/details/20240423_20240423_0141", type: "Archive.org Audio" },
      { id: 7, title: "Ifhâm al-Munkir - Thèse Rawane Mbaye", description: "Thèse universitaire du Pr. Rawane Mbaye sur l'œuvre apologétique d'El Hadji Malick Sy.", date: "XXe siècle", langue: "Arabe + Français", lien: "https://fr.scribd.com/document/684807738/Ifham-Munkir-Al-Jaani-These-3-Rawane-Mbaye", type: "PDF Scribd" },
      { id: 8, title: "Le Nouveau Dîwân - 7 Tomes", description: "Présentation et inventaire du nouveau Dîwân d'El Hadji Malick Sy, père fondateur de la Zawiya Tidiane de Tivaouane.", date: "2020", langue: "Français", lien: "https://senharmattan.com/fr/religion/5312-presentation-et-inventaire-du-nouveau-diwan-d-el-hadji-malick-sy-pere-fondateur-de-la-zawiya-tidjan-de-tivaouane.html", type: "Livre" }
    ],
    en: [
      { id: 1, title: "Khilassou Dhahab - Essential Chapters", description: "Poetic biography of the Prophet (PBUH) composed by El Hadji Malick Sy, recited during Gamou celebrations. Arabic text with French translation.", date: "19th century", langue: "Arabic + French", lien: "https://fr.scribd.com/document/669838264/khilass-zahab", type: "PDF Scribd" },
      { id: 2, title: "Khilassou Zahab - Chapter 1", description: "First chapter praising God, creation and the Prophet's soul as mirror of all existence.", date: "19th century", langue: "Arabic", lien: "https://www.scribd.com/document/832319484/khilassou-Zahab-Chapitre-1", type: "PDF Scribd" },
      { id: 3, title: "Khilassou Zahab - Chapter 3", description: "Sections on Meccan events, prayers and ancestral lineages including Kinana, Khuzayma and Mudar.", date: "19th century", langue: "Arabic", lien: "https://www.scribd.com/document/740233380/khilass-zahab-Chap-3", type: "PDF Scribd" },
      { id: 4, title: "Tayssir (Wassilatoul Mouna) - Complete", description: "Major work by El Hadji Malick Sy on the Sufi spiritual path. Complete transcription and translation.", date: "Early 20th century", langue: "Arabic + French", lien: "https://ssmasenegal.com/wp-content/uploads/2024/07/WASSILATOUL-MOUNA-TAYSSIR-transcription-complete-et-traduction.pdf", type: "PDF Direct" },
      { id: 5, title: "Tayssir - Scribd Version", description: "Alternative digitized version of Tayssir available on Scribd.", date: "Early 20th century", langue: "Arabic", lien: "https://fr.scribd.com/document/481857110/Tayssir-El-Hadj-Malick-Sy-pdf", type: "PDF Scribd" },
      { id: 6, title: "Fâkihatou Toullâb (فاكهة الطلاب)", description: "The Fruit of Students - Text on general principles of Tijaniyya and spiritual discipline of disciples.", date: "Early 20th century", langue: "Arabic", lien: "https://archive.org/details/20240423_20240423_0141", type: "Archive.org Audio" },
      { id: 7, title: "Ifhâm al-Munkir - Rawane Mbaye Thesis", description: "University thesis by Pr. Rawane Mbaye on the apologetic work of El Hadji Malick Sy.", date: "20th century", langue: "Arabic + French", lien: "https://fr.scribd.com/document/684807738/Ifham-Munkir-Al-Jaani-These-3-Rawane-Mbaye", type: "PDF Scribd" },
      { id: 8, title: "The New Dîwân - 7 Volumes", description: "Presentation and inventory of the new Dîwân of El Hadji Malick Sy, founding father of the Tidiane Zawiya of Tivaouane.", date: "2020", langue: "French", lien: "https://senharmattan.com/fr/religion/5312-presentation-et-inventaire-du-nouveau-diwan-d-el-hadji-malick-sy-pere-fondateur-de-la-zawiya-tidjan-de-tivaouane.html", type: "Book" }
    ],
    ar: [
      { id: 1, title: "خلاص الذهب - الفصول الأساسية", description: "سيرة شعرية للنبي (ص) ألفها الحاج مالك سي، تُتلى في احتفالات المولد. نص عربي مع ترجمة فرنسية.", date: "القرن 19", langue: "عربي + فرنسي", lien: "https://fr.scribd.com/document/669838264/khilass-zahab", type: "PDF Scribd" },
      { id: 2, title: "خلاص الذهب - الفصل الأول", description: "الفصل الأول في حمد الله والخلق وروح النبي كمرآة لكل الوجود.", date: "القرن 19", langue: "عربي", lien: "https://www.scribd.com/document/832319484/khilassou-Zahab-Chapitre-1", type: "PDF Scribd" },
      { id: 3, title: "خلاص الذهب - الفصل الثالث", description: "أقسام عن أحداث مكة والصلوات والأنساب بما في ذلك كنانة وخزيمة ومضر.", date: "القرن 19", langue: "عربي", lien: "https://www.scribd.com/document/740233380/khilass-zahab-Chap-3", type: "PDF Scribd" },
      { id: 4, title: "التيسير (وسيلة المنى) - كامل", description: "عمل رئيسي للحاج مالك سي عن الطريق الروحي الصوفي. نسخ وترجمة كاملة.", date: "أوائل القرن 20", langue: "عربي + فرنسي", lien: "https://ssmasenegal.com/wp-content/uploads/2024/07/WASSILATOUL-MOUNA-TAYSSIR-transcription-complete-et-traduction.pdf", type: "PDF مباشر" },
      { id: 5, title: "التيسير - نسخة Scribd", description: "نسخة رقمية بديلة من التيسير متوفرة على Scribd.", date: "أوائل القرن 20", langue: "عربي", lien: "https://fr.scribd.com/document/481857110/Tayssir-El-Hadj-Malick-Sy-pdf", type: "PDF Scribd" },
      { id: 6, title: "فاكهة الطلاب", description: "ثمرة الطلاب - نص عن المبادئ العامة للتجانية والانضباط الروحي للمريدين.", date: "أوائل القرن 20", langue: "عربي", lien: "https://archive.org/details/20240423_20240423_0141", type: "Archive.org صوتي" },
      { id: 7, title: "إفحام المنكر - أطروحة روان مباي", description: "أطروحة جامعية للبروفيسور روان مباي عن العمل الدفاعي للحاج مالك سي.", date: "القرن 20", langue: "عربي + فرنسي", lien: "https://fr.scribd.com/document/684807738/Ifham-Munkir-Al-Jaani-These-3-Rawane-Mbaye", type: "PDF Scribd" },
      { id: 8, title: "الديوان الجديد - 7 مجلدات", description: "عرض وجرد الديوان الجديد للحاج مالك سي، الأب المؤسس للزاوية التجانية في تيفاوان.", date: "2020", langue: "فرنسي", lien: "https://senharmattan.com/fr/religion/5312-presentation-et-inventaire-du-nouveau-diwan-d-el-hadji-malick-sy-pere-fondateur-de-la-zawiya-tidjan-de-tivaouane.html", type: "كتاب" }
    ],
    wo: [
      { id: 1, title: "Khilassou Dhahab - Chapitre yu gën mag", description: "Taariix woy bu Yonent bi (YWS) bu El Hadji Maalik Si bind, di ko jàng ci Gamou yi. Téere arab ak tekki français.", date: "At 19ème", langue: "Arab + Français", lien: "https://fr.scribd.com/document/669838264/khilass-zahab", type: "PDF Scribd" },
      { id: 2, title: "Khilassou Zahab - Chapitre 1", description: "Njëkk chapitre ci sant Yàlla, création ak ruu Yonent bi ci miroir bu àdduna bi yépp.", date: "At 19ème", langue: "Arab", lien: "https://www.scribd.com/document/832319484/khilassou-Zahab-Chapitre-1", type: "PDF Scribd" },
      { id: 3, title: "Khilassou Zahab - Chapitre 3", description: "Xétu ci mbir Makka yi, julli yi ak njàmbaar yi di Kinana, Khuzayma ak Mudar.", date: "At 19ème", langue: "Arab", lien: "https://www.scribd.com/document/740233380/khilass-zahab-Chap-3", type: "PDF Scribd" },
      { id: 4, title: "Tayssir (Wassilatoul Mouna) - Bu mat", description: "Téere bu mag bu El Hadji Maalik Si ci yoon bu sell soufi. Tekki bu mat.", date: "Njëkk at 20ème", langue: "Arab + Français", lien: "https://ssmasenegal.com/wp-content/uploads/2024/07/WASSILATOUL-MOUNA-TAYSSIR-transcription-complete-et-traduction.pdf", type: "PDF Direct" },
      { id: 5, title: "Tayssir - Version Scribd", description: "Version numérique bu yeneen bu Tayssir ci Scribd.", date: "Njëkk at 20ème", langue: "Arab", lien: "https://fr.scribd.com/document/481857110/Tayssir-El-Hadj-Malick-Sy-pdf", type: "PDF Scribd" },
      { id: 6, title: "Fâkihatou Toullâb (فاكهة الطلاب)", description: "Màggal Taalibe yi - Téere ci principe Tijaniyya ak dicipline bu sell taalibe yi.", date: "Njëkk at 20ème", langue: "Arab", lien: "https://archive.org/details/20240423_20240423_0141", type: "Archive.org Audio" },
      { id: 7, title: "Ifhâm al-Munkir - Thèse Rawane Mbaye", description: "Thèse université bu Pr. Rawane Mbaye ci liggéey bu El Hadji Maalik Si.", date: "At 20ème", langue: "Arab + Français", lien: "https://fr.scribd.com/document/684807738/Ifham-Munkir-Al-Jaani-These-3-Rawane-Mbaye", type: "PDF Scribd" },
      { id: 8, title: "Dîwân bu Bees bi - 7 Tomes", description: "Présentation ak inventaire Dîwân bu bees bu El Hadji Maalik Si, baay tëkkikat Zawiya Tijaan Tiwaawaan.", date: "2020", langue: "Français", lien: "https://senharmattan.com/fr/religion/5312-presentation-et-inventaire-du-nouveau-diwan-d-el-hadji-malick-sy-pere-fondateur-de-la-zawiya-tidjan-de-tivaouane.html", type: "Téere" }
    ]
  };
  
  const manuscrits = manuscritsData[language] || manuscritsData.fr;

  // Photos historiques avec traductions
  const photosData = {
    fr: [
      { id: 1, title: "El Hadji Malick Sy - Portrait officiel", description: "Portrait historique de Seydi El Hadji Malick Sy (1855-1922), fondateur de la Zawiya de Tivaouane.", date: "Début XXe siècle", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg", source: "Archives familiales" },
      { id: 2, title: "El Hadji Malick Sy avec chapelet", description: "Photo historique montrant El Hadji Malick Sy tenant son chapelet.", date: "Début XXe siècle", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/d5prlzpy_FB_IMG_1770343515975.jpg", source: "Archives familiales" },
      { id: 3, title: "Maodo et ses disciples", description: "El Hadji Malick Sy accompagné de ses disciples à Tivaouane.", date: "Début XXe siècle", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/4jvj34rl_FB_IMG_1770343569579.jpg", source: "Archives Zawiya" },
      { id: 4, title: "Portrait sépia de Maodo", description: "Portrait en sépia d'El Hadji Malick Sy.", date: "Début XXe siècle", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ov0hfotv_FB_IMG_1770343528749.jpg", source: "Archives historiques" },
      { id: 5, title: "La Grande Mosquée de Tivaouane", description: "Vue de la Grande Mosquée de Tivaouane, site classé monument historique depuis 1902.", date: "XXe siècle", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg", source: "Archives Zawiya" },
      { id: 6, title: "Serigne Babacar Sy (1er Khalife)", description: "Serigne Khalifa Ababacar Sy (1885-1957), premier successeur de Maodo, fondateur des dahiras et initiateur de la ziarra générale en 1930.", date: "1922-1957", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/1b6zos47_FB_IMG_1770232308810.jpg", source: "Archives Khalifat" }
    ],
    en: [
      { id: 1, title: "El Hadji Malick Sy - Official Portrait", description: "Historical portrait of Seydi El Hadji Malick Sy (1855-1922), founder of the Zawiya of Tivaouane.", date: "Early 20th century", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg", source: "Family Archives" },
      { id: 2, title: "El Hadji Malick Sy with prayer beads", description: "Historical photo showing El Hadji Malick Sy holding his prayer beads.", date: "Early 20th century", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/d5prlzpy_FB_IMG_1770343515975.jpg", source: "Family Archives" },
      { id: 3, title: "Maodo and his disciples", description: "El Hadji Malick Sy accompanied by his disciples in Tivaouane.", date: "Early 20th century", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/4jvj34rl_FB_IMG_1770343569579.jpg", source: "Zawiya Archives" },
      { id: 4, title: "Sepia portrait of Maodo", description: "Sepia portrait of El Hadji Malick Sy.", date: "Early 20th century", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ov0hfotv_FB_IMG_1770343528749.jpg", source: "Historical Archives" },
      { id: 5, title: "The Great Mosque of Tivaouane", description: "View of the Great Mosque of Tivaouane, classified as a historical monument since 1902.", date: "20th century", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg", source: "Zawiya Archives" },
      { id: 6, title: "Serigne Babacar Sy (1st Khalife)", description: "Serigne Khalifa Ababacar Sy (1885-1957), first successor of Maodo, founder of dahiras and initiator of the general ziarra in 1930.", date: "1922-1957", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/1b6zos47_FB_IMG_1770232308810.jpg", source: "Khalifat Archives" }
    ],
    ar: [
      { id: 1, title: "الحاج مالك سي - صورة رسمية", description: "صورة تاريخية للسيدي الحاج مالك سي (1855-1922)، مؤسس زاوية تيفاوان.", date: "أوائل القرن 20", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg", source: "أرشيف العائلة" },
      { id: 2, title: "الحاج مالك سي مع السبحة", description: "صورة تاريخية تظهر الحاج مالك سي ممسكاً بسبحته.", date: "أوائل القرن 20", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/d5prlzpy_FB_IMG_1770343515975.jpg", source: "أرشيف العائلة" },
      { id: 3, title: "مودو وتلاميذه", description: "الحاج مالك سي برفقة تلاميذه في تيفاوان.", date: "أوائل القرن 20", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/4jvj34rl_FB_IMG_1770343569579.jpg", source: "أرشيف الزاوية" },
      { id: 4, title: "صورة بني داكن لمودو", description: "صورة بني داكن للحاج مالك سي.", date: "أوائل القرن 20", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ov0hfotv_FB_IMG_1770343528749.jpg", source: "الأرشيف التاريخي" },
      { id: 5, title: "المسجد الكبير في تيفاوان", description: "منظر المسجد الكبير في تيفاوان، المصنف كمعلم تاريخي منذ 1902.", date: "القرن 20", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg", source: "أرشيف الزاوية" },
      { id: 6, title: "سرين باباكار سي (الخليفة الأول)", description: "سرين خليفة أباباكار سي (1885-1957)، أول خليفة لمودو، مؤسس الدوائر ومبتكر الزيارة العامة في 1930.", date: "1922-1957", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/1b6zos47_FB_IMG_1770232308810.jpg", source: "أرشيف الخلافة" }
    ],
    wo: [
      { id: 1, title: "El Hadji Maalik Si - Nataal bu sellal", description: "Nataal taariix bu Seydi El Hadji Maalik Si (1855-1922), tëkkikat Zawiya Tiwaawaan.", date: "Njëkk at 20ème", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg", source: "Dëgg kër gi" },
      { id: 2, title: "El Hadji Maalik Si ak chapelet", description: "Nataal taariix di won El Hadji Maalik Si di moom sa chapelet.", date: "Njëkk at 20ème", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/d5prlzpy_FB_IMG_1770343515975.jpg", source: "Dëgg kër gi" },
      { id: 3, title: "Maodo ak taalibe yi", description: "El Hadji Maalik Si ak taalibe yi ci Tiwaawaan.", date: "Njëkk at 20ème", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/4jvj34rl_FB_IMG_1770343569579.jpg", source: "Dëgg Zawiya" },
      { id: 4, title: "Nataal sépia Maodo", description: "Nataal sépia El Hadji Maalik Si.", date: "Njëkk at 20ème", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ov0hfotv_FB_IMG_1770343528749.jpg", source: "Dëgg taariix" },
      { id: 5, title: "Jammi bu Mag bi Tiwaawaan", description: "Xool Jammi bu Mag bi Tiwaawaan, paxas taariix dale 1902.", date: "At 20ème", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg", source: "Dëgg Zawiya" },
      { id: 6, title: "Serigne Babacar Sy (Njëkk Xaliifa)", description: "Serigne Khalifa Ababacar Sy (1885-1957), njëkk ki topp Maodo, tëkkikat dahira yi ak ziarra générale ci 1930.", date: "1922-1957", image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/1b6zos47_FB_IMG_1770232308810.jpg", source: "Dëgg Xalifa" }
    ]
  };
  
  const photos = photosData[language] || photosData.fr;

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
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              {t.subtitle}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{manuscrits.length}</div>
                <div className="text-sm text-white/70">{t.manuscrits}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{photos.length}</div>
                <div className="text-sm text-white/70">{t.photos}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{audioTracks.length}</div>
                <div className="text-sm text-white/70">{t.audio}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{videos.length}</div>
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
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              {t.intro1} {t.intro2}
            </p>
            
            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-base text-[#004D33] italic mb-0">
                {t.note}
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
              <h2 className="text-3xl font-bold text-[#004D33]">{t.manuscritsTitle}</h2>
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
      {(selectedCategory === "all" || selectedCategory === "photos") && (
        <section className="py-12 bg-white" data-testid="photos-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Image className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">{t.photosTitle}</h2>
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
                <p className="text-[#4A4A4A] mb-4">
                  {t.khassaidesDesc}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#004D33]">{t.audioSources}</h4>
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
      {selectedCategory === "all" && (
        <section className="py-12" data-testid="sources-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="w-8 h-8 text-[#D4AF37]" />
              <h2 className="text-3xl font-bold text-[#004D33]">{t.sourcesTitle}</h2>
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
                    {t.consultSource}
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
            {t.contributeTitle}
          </h2>
          <p className="text-lg text-white/90 mb-8">
            {t.contributeDesc}
          </p>
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
