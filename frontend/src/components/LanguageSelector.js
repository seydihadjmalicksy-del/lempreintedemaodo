import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSelector = ({ variant = "default" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, availableLanguages } = useLanguage();
  const ref = useRef(null);

  const currentLang = availableLanguages.find(l => l.code === language);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (variant === "minimal") {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
        >
          <span>{currentLang?.flag}</span>
          <span className="hidden sm:inline">{currentLang?.label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50 min-w-[140px]">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-[#E8F5E9] transition-colors ${
                  language === lang.code ? 'bg-[#E8F5E9] text-[#004D33]' : 'text-gray-700'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <Globe className="w-5 h-5 text-[#D4AF37]" />
        <span className="text-white">{currentLang?.flag} {currentLang?.label}</span>
        <ChevronDown className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-50 min-w-[180px]">
          <div className="p-2">
            <p className="text-xs text-gray-500 px-3 py-1 uppercase">Langue</p>
          </div>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-[#E8F5E9] transition-colors ${
                language === lang.code ? 'bg-[#E8F5E9] border-l-4 border-[#004D33]' : ''
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className={language === lang.code ? 'font-bold text-[#004D33]' : 'text-gray-700'}>
                {lang.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
