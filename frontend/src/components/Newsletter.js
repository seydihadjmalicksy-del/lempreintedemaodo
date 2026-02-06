import { useState } from "react";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Newsletter = ({ variant = "default" }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { t, language } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error(language === 'en' ? "Please enter a valid email address" : 
                  language === 'ar' ? "الرجاء إدخال عنوان بريد إلكتروني صالح" :
                  "Veuillez entrer une adresse email valide");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/newsletter/subscribe`, {
        email: email,
        language: language
      });
      
      setIsSubscribed(true);
      toast.success(response.data.message || t('thankYou'));
      setEmail("");
      
      // Reset après 5 secondes
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
        (language === 'en' ? "Subscription failed. Please try again." : 
         language === 'ar' ? "فشل الاشتراك. حاول مرة أخرى." :
         "Échec de l'inscription. Veuillez réessayer.");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <div className="bg-[#004D33] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-lg font-bold text-white">Newsletter</h3>
        </div>
        
        {isSubscribed ? (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span>{t('thankYou')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('enterEmail')}
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-[#D4AF37]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        )}
      </div>
    );
  }

  // Version par défaut (grande)
  return (
    <section className="py-16 bg-gradient-to-br from-[#004D33] to-[#003d29]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37] rounded-full mb-6">
          <Mail className="w-8 h-8 text-[#004D33]" />
        </div>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          {t('stayInformed')}
        </h2>
        
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          {t('newsletterDesc')}
        </p>

        {isSubscribed ? (
          <div className="flex items-center justify-center gap-3 text-green-400 text-xl">
            <CheckCircle className="w-8 h-8" />
            <span>{t('thankYou')}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('enterEmail')}
                className="flex-1 px-6 py-4 rounded-full bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-[#D4AF37] text-center sm:text-left"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] rounded-full font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('subscribing')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t('subscribe')}
                  </>
                )}
              </button>
            </div>
            
            <p className="text-white/50 text-sm mt-4">
              {language === 'en' ? "We respect your privacy. Unsubscribe anytime." : 
               language === 'ar' ? "نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت." :
               "Nous respectons votre vie privée. Désabonnement possible à tout moment."}
            </p>
          </form>
        )}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-white/70 text-sm">
          <div>
            <p className="text-[#D4AF37] font-bold text-2xl mb-1">5000+</p>
            <p>{language === 'en' ? "Subscribers" : language === 'ar' ? "المشتركون" : "Abonnés"}</p>
          </div>
          <div>
            <p className="text-[#D4AF37] font-bold text-2xl mb-1">2x/{language === 'en' ? "month" : language === 'ar' ? "شهر" : "mois"}</p>
            <p>{language === 'en' ? "Frequency" : language === 'ar' ? "التكرار" : "Fréquence"}</p>
          </div>
          <div>
            <p className="text-[#D4AF37] font-bold text-2xl mb-1">100%</p>
            <p>{language === 'en' ? "Free" : language === 'ar' ? "مجاني" : "Gratuit"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
