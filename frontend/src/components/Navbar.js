import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Accueil" },
    { 
      label: "Histoire", 
      dropdown: [
        { path: "/histoire/origines", label: "Les Origines" },
        { path: "/histoire/el-hadji-malick-sy", label: "El Hadji Malick Sy" },
        { path: "/histoire/khalifes", label: "Lignée des Khalifes" },
        { path: "/histoire/geographie", label: "Géographie Sacrée" }
      ]
    },
    { 
      label: "Enseignements",
      dropdown: [
        { path: "/enseignements/piliers", label: "Piliers de la Tariqa" },
        { path: "/enseignements/ecole", label: "L'École de Tivaouane" },
        { path: "/enseignements/ouvrages", label: "Ouvrages de Référence" }
      ]
    },
    { 
      label: "Événements",
      dropdown: [
        { path: "/evenements/gamou", label: "Le Gamou" },
        { path: "/evenements/ziarra", label: "Ziarra Annuelles" },
        { path: "/evenements/ceremonies", label: "Cérémonies Religieuses" }
      ]
    },
    { path: "/archives", label: "Archives" },
    { path: "/mediatheque", label: "Médiathèque" },
    { path: "/contact", label: "Contact" }
  ];

  return (
    <>
      {/* Bismillah Banner */}
      <div className="bg-[#004D33] text-white py-2 text-center border-b-2 border-[#D4AF37]">
        <p className="bismillah-text text-lg md:text-xl" data-testid="bismillah-banner">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50" data-testid="main-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3"
              data-testid="logo-link"
            >
              <div className="w-12 h-12 bg-[#004D33] rounded-full flex items-center justify-center">
                <span className="text-[#D4AF37] text-2xl font-bold">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#004D33]">Tariqa Tidiane</h1>
                <p className="text-xs text-[#4A4A4A]">L'empreinte de Tivaouane</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-6">
              {navLinks.map((link, index) => (
                link.dropdown ? (
                  <div 
                    key={index}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1 text-base font-medium text-[#4A4A4A] hover:text-[#004D33] py-2 transition-colors"
                      data-testid={`nav-dropdown-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {openDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                        {link.dropdown.map((subLink) => (
                          <Link
                            key={subLink.path}
                            to={subLink.path}
                            className="block px-4 py-3 text-sm text-[#4A4A4A] hover:bg-[#E8F5E9] hover:text-[#004D33] transition-colors"
                            data-testid={`nav-sublink-${subLink.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`text-base font-medium transition-colors duration-200 ${
                      isActive(link.path)
                        ? "text-[#004D33] border-b-2 border-[#D4AF37]"
                        : "text-[#4A4A4A] hover:text-[#004D33]"
                    } pb-1`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#E8F5E9] transition-colors"
              data-testid="mobile-menu-button"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-[#004D33]" />
              ) : (
                <Menu className="h-6 w-6 text-[#004D33]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="lg:hidden bg-white border-t border-gray-200 max-h-[80vh] overflow-y-auto"
            data-testid="mobile-menu"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                link.dropdown ? (
                  <div key={index}>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium text-[#4A4A4A] hover:bg-[#E8F5E9] hover:text-[#004D33] transition-colors"
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.label && (
                      <div className="ml-4 mt-1 space-y-1">
                        {link.dropdown.map((subLink) => (
                          <Link
                            key={subLink.path}
                            to={subLink.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 rounded-lg text-sm text-[#4A4A4A] hover:bg-[#E8F5E9] hover:text-[#004D33] transition-colors"
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-[#004D33] text-white"
                        : "text-[#4A4A4A] hover:bg-[#E8F5E9] hover:text-[#004D33]"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
