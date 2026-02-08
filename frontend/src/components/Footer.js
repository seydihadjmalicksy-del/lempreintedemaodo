import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Youtube, ExternalLink } from "lucide-react";
import Newsletter from "./Newsletter";

const Footer = () => {
  const quickLinks = [
    { path: "/histoire/maodo", label: "El Hadji Malick Sy" },
    { path: "/histoire/khalifes", label: "Lignée des Héritiers" },
    { path: "/evenements/gamou", label: "Le Gamou" },
    { path: "/enseignements/ouvrages", label: "Ouvrages de Référence" },
    { path: "/mediatheque", label: "Médiathèque" },
    { path: "/contact", label: "Contact" }
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", url: "#" },
    { icon: Youtube, label: "YouTube", url: "https://www.youtube.com/@HABIBBATV" }
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-[#D4AF37]">
              Tariqa Tidiane
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              La Zawiya de Tivaouane, fondée par El Hadji Malick Sy, 
              est le centre spirituel de la Tariqa Tijaniyya au Sénégal.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-[#D4AF37] rounded-full flex items-center justify-center transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-white group-hover:text-[#004D33]" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Liens Rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-[#D4AF37] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Zawiya El Hadji Malick Sy<br />
                  Tivaouane, Sénégal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <span className="text-white/70 text-sm">+221 XX XXX XX XX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <span className="text-white/70 text-sm">contact@zawiya.sn</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Compact */}
          <div>
            <Newsletter variant="compact" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © 2025 CRAT. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-white/50 hover:text-[#D4AF37] transition-colors">
                Mentions légales
              </a>
              <span className="text-white/30">|</span>
              <a href="#" className="text-white/50 hover:text-[#D4AF37] transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Arabic Quote */}
      <div className="bg-[#004D33] py-4 text-center">
        <p className="text-[#D4AF37] text-lg font-amiri" style={{ fontFamily: "'Amiri', serif" }}>
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
        <p className="text-white/60 text-xs mt-1">
          Au nom de Dieu, le Tout Miséricordieux, le Très Miséricordieux
        </p>
      </div>
    </footer>
  );
};

export default Footer;
