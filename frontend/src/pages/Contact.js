import { MapPin, Phone, Mail, Heart, Send } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Contact = () => {
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
    
    // Simulation envoi
    setTimeout(() => {
      toast.success("Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.");
      setFormData({ nom: "", email: "", sujet: "", message: "" });
      setLoading(false);
    }, 1500);
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
      titre: "Adresse",
      contenu: "Grande Mosquée de Tivaouane\nTivaouane, Région de Thiès\nSénégal"
    },
    {
      icon: Phone,
      titre: "Téléphone",
      contenu: "+221 77 338 90 95\n(Disponible 8h-20h)"
    },
    {
      icon: Mail,
      titre: "Email",
      contenu: "seydihadjmalicksy@gmail.com"
    }
  ];

  const raisonsDon = [
    "CRAT (Cadre de Réflexion et d'Action Tidiane)",
    "Soutien aux écoles coraniques (daaras)",
    "Aide aux pèlerins démunis lors du Gamou",
    "Numérisation des archives et manuscrits",
    "Projets sociaux (hôpitaux, écoles)",
    "Distribution d'eau et de nourriture lors des événements"
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="contact-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Contactez-Nous
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              Nous sommes à votre écoute pour toute question ou contribution
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
              Envoyez-nous un Message
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A]">
              Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#004D33] mb-2">
                  Nom complet *
                </label>
                <Input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                  className="h-12 border-gray-300 focus:border-[#004D33] focus:ring-[#004D33]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#004D33] mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="h-12 border-gray-300 focus:border-[#004D33] focus:ring-[#004D33]"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#004D33] mb-2">
                Sujet *
              </label>
              <Input
                type="text"
                name="sujet"
                value={formData.sujet}
                onChange={handleChange}
                required
                placeholder="Objet de votre message"
                className="h-12 border-gray-300 focus:border-[#004D33] focus:ring-[#004D33]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#004D33] mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Écrivez votre message ici..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004D33] focus:ring-1 focus:ring-[#004D33] resize-none"
              ></textarea>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004D33] hover:bg-[#003d29] text-white h-14 text-lg font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                "Envoi en cours..."
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer le message
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
              <span className="text-[#004D33] font-semibold">Soutenez Tivaouane</span>
            </div>
            
            <h2 className="text-4xl font-bold text-[#004D33] mb-4">
              Faire un Don (Hadiya)
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              Votre générosité contribue au rayonnement de la Tariqa et au bien-être de la communauté
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#004D33] mb-6">
                À quoi servent vos dons ?
              </h3>
              
              <div className="space-y-4">
                {raisonsDon.map((raison, index) => (
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
              <h3 className="text-2xl font-bold mb-6">Informations Bancaires</h3>
              
              <div className="space-y-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">Bénéficiaire</p>
                  <p className="font-semibold">Cadre de Réflexion et d'Action Tidiane</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">Banque</p>
                  <p className="font-semibold">Banque Islamique du Sénégal</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-white/70 mb-1">IBAN</p>
                  <p className="font-mono text-sm">SN XX XXXX XXXX XXXX XXXX XXXX</p>
                </div>
              </div>

              <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg p-4">
                <p className="text-sm text-white/90 italic">
                  "Celui qui fait une aumône équivalant à une datte provenant d'un gain licite, 
                  Allah l'accepte de Sa Main droite et la fait fructifier pour son donateur."
                </p>
                <p className="text-xs text-[#D4AF37] mt-2">- Hadith authentique</p>
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
              Comment nous trouver
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A]">
              Tivaouane est située à 90 km à l'est de Dakar, facilement accessible par route
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-[#004D33] mb-4">Depuis Dakar</h3>
                <ul className="space-y-3 text-[#4A4A4A]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>En voiture : 1h30 via l'autoroute à péage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>En bus : Départs réguliers depuis la gare routière Pompiers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>En taxi-brousse : Liaisons fréquentes</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#004D33] mb-4">Une fois sur place</h3>
                <ul className="space-y-3 text-[#4A4A4A]">
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>La Grande Mosquée est au centre-ville, facilement repérable</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Transport local : taxis, calèches, motos-taxis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Hébergement : Nombreuses maisons d'accueil et hôtels</span>
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