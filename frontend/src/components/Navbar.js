import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Accueil" },
    { path: "/gallery", label: "Galerie" },
    { path: "/about", label: "À Propos" },
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
                <p className="text-xs text-[#4A4A4A]">Tivaouane</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
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
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#E8F5E9] transition-colors"
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
            className="md:hidden bg-white border-t border-gray-200"
            data-testid="mobile-menu"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
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
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
