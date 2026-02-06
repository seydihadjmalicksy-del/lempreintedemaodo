import { MapPin, Phone, Mail, Heart, Send } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/contact`, formData);
      toast.success(response.data.message || t('messageSent'));
      setFormData({ nom: "", email: "", sujet: "", message: "" });
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
        (language === 'en' ? "Failed to send message. Please try again." : 
         language === 'ar' ? "فشل إرسال الرسالة. حاول مرة أخرى." :
         "Échec de l'envoi. Veuillez réessayer.");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const coordonnees = [
    {
      icon: MapPin,
      titre: t('address'),
      contenu: "Grande Mosquée de Tivaouane\nTivaouane, Région de Thiès\nSénégal"
    },
    {
      icon: Phone,
      titre: t('phone'),
      contenu: "+221 77 338 90 95\n(8h-20h)"
    },
    {
      icon: Mail,
      titre: "Email",
      contenu: "seydihadjmalicksy@gmail.com"
    }
  ];

  const raisonsDon = {
    fr: [
      "CRAT (Cadre de Réflexion et d'Action Tidiane)",
      "Soutien aux écoles coraniques (daaras)",
      "Aide aux pèlerins démunis lors du Gamou",
      "Numérisation des archives et manuscrits",
      "Projets sociaux (hôpitaux, écoles)",
      "Distribution d'eau et de nourriture lors des événements"
    ],
    en: [
      "CRAT (Framework for Tidiane Reflection and Action)",
      "Support for Quranic schools (daaras)",
      "Aid to needy pilgrims during the Gamou",
      "Digitization of archives and manuscripts",
      "Social projects (hospitals, schools)",
      "Distribution of water and food during events"
    ],
    ar: [
      "إطار التفكير والعمل التجاني",
      "دعم المدارس القرآنية (الدار)",
      "مساعدة الحجاج المحتاجين أثناء المولد",
      "رقمنة الأرشيف والمخطوطات",
      "المشاريع الاجتماعية (المستشفيات، المدارس)",
      "توزيع الماء والطعام أثناء الفعاليات"
    ],
    wo: [
      "CRAT (Cadre xalaat ak liggéey Tijaan)",
      "Dimbali daara yi",
      "Dimbali ajibi yi baaxul ci Gamou gi",
      "Numérisation archive yi ak manuscrit yi",
      "Projet social yi (opital, ekol)",
      "Seddale ndox ak lekk ci mbir yi"
    ]
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="contact-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('contactUs')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              {t('contactSubtitle')}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Coordonnées */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {coordonnees.map((coord, index) => {
              const Icon = coord.icon;
              return (
                <div
                  key={index}
                  className="bg-[#F9F7F2] rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-[#004D33] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#004D33] mb-4">
                    {coord.titre}
                  </h3>
                  
                  <p className="text-[#4A4A4A] whitespace-pre-line">
                    {coord.contenu}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formulaire de Contact */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#004D33] mb-4">
              {language === 'en' ? 'Send us a Message' : 
               language === 'ar' ? 'أرسل لنا رسالة' : 
               language === 'wo' ? 'Yónnee nu ab bataaxal' :
               'Envoyez-nous un Message'}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#004D33] mb-2">
                  {t('yourName')} *
                </label>
                <Input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder={t('yourName')}
                  className="h-12 border-gray-300 focus:border-[#004D33] focus:ring-[#004D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#004D33] mb-2">
                  {t('yourEmail')} *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                  className="h-12 border-gray-300 focus:border-[#004D33] focus:ring-[#004D33]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#004D33] mb-2">
                {t('subject')} *
              </label>
              <Input
                type="text"
                name="sujet"
                value={formData.sujet}
                onChange={handleChange}
                required
                placeholder={t('subject')}
                className="h-12 border-gray-300 focus:border-[#004D33] focus:ring-[#004D33]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#004D33] mb-2">
                {t('message')} *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder={t('message')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004D33] focus:ring-1 focus:ring-[#004D33] resize-none"
              ></textarea>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004D33] hover:bg-[#003d29] text-white h-14 text-lg font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                t('sending')
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('send')}
                </>
              )}
            </Button>
          </form>
        </div>
      </section>

      {/* Faire un Don */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-6">
              <Heart className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-[#004D33] font-semibold">
                {language === 'en' ? 'Support Tivaouane' : 
                 language === 'ar' ? 'ادعم تيفاوان' : 
                 'Soutenez Tivaouane'}
              </span>
            </div>
            
            <h2 className="text-4xl font-bold text-[#004D33] mb-4">
              {language === 'en' ? 'Make a Donation (Hadiya)' : 
               language === 'ar' ? 'تبرع (هدية)' : 
               language === 'wo' ? 'Def ab don (Hadiya)' :
               'Faire un Don (Hadiya)'}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#004D33] mb-6">
                {language === 'en' ? 'What are your donations used for?' : 
                 language === 'ar' ? 'لماذا تستخدم تبرعاتكم؟' : 
                 'À quoi servent vos dons ?'}
              </h3>
              
              <div className="space-y-4">
                {(raisonsDon[language] || raisonsDon.fr).map((raison, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-[#4A4A4A] pt-1">{raison}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#004D33] to-[#003d29] rounded-2xl p-8 lg:p-12 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">
                {language === 'en' ? 'Bank Information' : 
                 language === 'ar' ? 'معلومات بنكية' : 
                 'Informations Bancaires'}
              </h3>
              
              <div className="space-y-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">
                    {language === 'en' ? 'Beneficiary' : language === 'ar' ? 'المستفيد' : 'Bénéficiaire'}
                  </p>
                  <p className="font-semibold">Cadre de Réflexion et d'Action Tidiane</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">
                    {language === 'en' ? 'Bank' : language === 'ar' ? 'البنك' : 'Banque'}
                  </p>
                  <p className="font-semibold">Banque Islamique du Sénégal</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">IBAN</p>
                  <p className="font-mono text-sm">SN XX XXXX XXXX XXXX XXXX XXXX</p>
                </div>
              </div>

              <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg p-4">
                <p className="text-sm text-white/90 italic">
                  {language === 'ar' ? 
                    '"من تصدق بعدل تمرة من كسب طيب، وَلَا يَقْبَلُ اللَّهُ إِلَّا الطَّيِّبَ..."' :
                    '"Celui qui fait une aumône équivalant à une datte provenant d\'un gain licite, Allah l\'accepte de Sa Main droite..."'}
                </p>
                <p className="text-xs text-[#D4AF37] mt-2">
                  {language === 'en' ? '- Authentic Hadith' : language === 'ar' ? '- حديث صحيح' : '- Hadith authentique'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Localisation */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#004D33] mb-4">
              {language === 'en' ? 'How to find us' : 
               language === 'ar' ? 'كيف تجدنا' : 
               'Comment nous trouver'}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-[#004D33] mb-4">
                  {language === 'en' ? 'From Dakar' : language === 'ar' ? 'من داكار' : 'Depuis Dakar'}
                </h3>
                <ul className="space-y-3 text-[#4A4A4A]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>{language === 'en' ? 'By car: 1h30 via the toll highway' : 'En voiture : 1h30 via l\'autoroute à péage'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>{language === 'en' ? 'By bus: Regular departures from Pompiers station' : 'En bus : Départs réguliers depuis la gare routière Pompiers'}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#004D33] mb-4">
                  {language === 'en' ? 'Once there' : language === 'ar' ? 'عند الوصول' : 'Une fois sur place'}
                </h3>
                <ul className="space-y-3 text-[#4A4A4A]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>{language === 'en' ? 'The Grand Mosque is in the city center' : 'La Grande Mosquée est au centre-ville'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>{language === 'en' ? 'Local transport: taxis, carriages, moto-taxis' : 'Transport local : taxis, calèches, motos-taxis'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;