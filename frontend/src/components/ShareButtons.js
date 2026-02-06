import { Share2, Facebook, Twitter, Link, Mail, Check } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const ShareButtons = ({ url, title, description, variant = "default" }) => {
  const { t, language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      color: 'hover:bg-[#1877f2] hover:text-white'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-[#1da1f2] hover:text-white'
    },
    {
      name: 'WhatsApp',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:bg-[#25d366] hover:text-white'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      color: 'hover:bg-[#004D33] hover:text-white'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const labels = {
    fr: { share: "Partager", copied: "Copié !", copyLink: "Copier le lien" },
    en: { share: "Share", copied: "Copied!", copyLink: "Copy link" },
    ar: { share: "مشاركة", copied: "تم النسخ!", copyLink: "نسخ الرابط" },
    wo: { share: "Séddoo", copied: "Copié na!", copyLink: "Copie lien bi" }
  };

  const label = labels[language] || labels.fr;

  if (variant === "compact") {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] transition-colors"
          data-testid="share-button-compact"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">{label.share}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 p-2 z-50 min-w-[160px]">
            {shareLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[#4A4A4A] transition-colors ${link.color}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{link.name}</span>
                </a>
              );
            })}
            <button
              onClick={() => {
                copyToClipboard();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#4A4A4A] hover:bg-gray-100 w-full"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link className="w-4 h-4" />}
              <span className="text-sm">{copied ? label.copied : label.copyLink}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default horizontal variant
  return (
    <div className="flex items-center gap-2 flex-wrap" data-testid="share-buttons">
      <span className="text-sm text-[#4A4A4A] mr-2">{label.share}:</span>
      
      {shareLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-[#F9F7F2] text-[#4A4A4A] transition-all duration-200 ${link.color}`}
            title={link.name}
            data-testid={`share-${link.name.toLowerCase()}`}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
      
      <button
        onClick={copyToClipboard}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F9F7F2] text-[#4A4A4A] hover:bg-[#004D33] hover:text-white transition-all duration-200"
        title={label.copyLink}
        data-testid="share-copy-link"
      >
        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Link className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default ShareButtons;
