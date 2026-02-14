import { useState } from "react";

const LogoPreview = () => {
  const [selectedLogo, setSelectedLogo] = useState(1);

  const logos = [
    { id: 1, src: "/logo-option-1.png", name: "Option 1 - Médaillon classique" },
    { id: 2, src: "/logo-option-2.png", name: "Option 2 - Style vertical" },
    { id: 3, src: "/logo-option-3.png", name: "Option 3 - Circulaire" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Preview Navbar with selected logo */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <img 
                src={logos.find(l => l.id === selectedLogo)?.src}
                alt="L'empreinte de Maodo" 
                className="h-16 w-16 rounded-full object-cover shadow-md border-2 border-[#D4AF37]"
              />
              <span className="text-[#004D33] font-bold text-lg hidden md:block">L'empreinte de Maodo</span>
            </div>
            <div className="flex items-center space-x-4 text-[#4A4A4A]">
              <span>Home</span>
              <span>History</span>
              <span>Teachings</span>
              <span>Events</span>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Selection */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-[#004D33] text-center mb-8">
          Prévisualisation des logos
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {logos.map((logo) => (
            <div 
              key={logo.id}
              onClick={() => setSelectedLogo(logo.id)}
              className={`cursor-pointer p-6 rounded-2xl transition-all ${
                selectedLogo === logo.id 
                  ? "bg-[#004D33] shadow-xl scale-105" 
                  : "bg-white shadow-md hover:shadow-lg"
              }`}
            >
              <div className="flex justify-center mb-4">
                <img 
                  src={logo.src} 
                  alt={logo.name}
                  className="h-48 w-48 object-contain rounded-full"
                />
              </div>
              <p className={`text-center font-medium ${
                selectedLogo === logo.id ? "text-white" : "text-[#004D33]"
              }`}>
                {logo.name}
              </p>
              {selectedLogo === logo.id && (
                <p className="text-center text-[#D4AF37] text-sm mt-2">
                  ✓ Sélectionné
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Preview Section - Welcome */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-[#004D33] mb-6 text-center">
            Aperçu sur la page d'accueil
          </h2>
          <div className="text-center">
            <img 
              src={logos.find(l => l.id === selectedLogo)?.src}
              alt="Logo preview"
              className="h-40 w-40 md:h-48 md:w-48 mx-auto rounded-full object-cover shadow-lg border-4 border-[#D4AF37] mb-6"
            />
            <h3 className="text-3xl font-bold text-[#004D33] mb-4" style={{ fontStyle: 'italic' }}>
              Welcome to L'empreinte de Maodo
            </h3>
            <p className="text-[#4A4A4A] max-w-2xl mx-auto">
              This portal is dedicated to the preservation and transmission of the spiritual heritage of El Hadji Malick Sy (1855-1922), founder of the Khadra of Tivaouane and a major figure of the Tijaniyya in West Africa.
            </p>
          </div>
        </div>

        {/* Footer Preview */}
        <div className="bg-[#004D33] rounded-2xl p-8 text-white text-center">
          <img 
            src={logos.find(l => l.id === selectedLogo)?.src}
            alt="Logo footer"
            className="h-24 w-24 mx-auto rounded-full object-cover border-2 border-[#D4AF37] mb-4"
          />
          <p className="text-[#D4AF37] font-bold text-xl">L'empreinte de Maodo</p>
          <p className="text-white/70 text-sm mt-2">© 2026 - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
};

export default LogoPreview;
