import { MapPin, Home, Church, Heart } from "lucide-react";

const GeographieSacree = () => {
  const lieux = [
    {
      icon: Church,
      title: "La Grande Mosquée",
      description: "Cœur spirituel de Tivaouane, édifiée progressivement depuis 1902. Ses dômes dorés dominent la ville et accueillent des millions de fidèles lors du Gamou.",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      icon: Home,
      title: "La Zawiya (Daara)",
      description: "L'école coranique fondée par El Hadji Malick Sy, où des milliers d'étudiants ont été formés aux sciences islamiques et à la spiritualité.",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      icon: Heart,
      title: "Le Mausolée de Maodo",
      description: "Lieu de recueillement où repose El Hadji Malick Sy. C'est le site de pèlerinage le plus visité après la Grande Mosquée.",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      icon: MapPin,
      title: "Les Champs de Courses",
      description: "Vaste esplanade qui accueille les millions de pèlerins durant le Gamou. C'est là que se tiennent les grandes causeries nocturnes.",
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="geographie-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
            alt="Tivaouane - Vue aérienne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/90 via-[#004D33]/80 to-[#004D33]/70"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Géographie Sacrée
                <br />
                <span className="text-[#D4AF37]">Tivaouane, la Cité Sainte</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Pourquoi Tivaouane est devenue le centre névralgique de la Tidjanidya
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-[#004D33] mb-6">
              Tivaouane : D'un Village à une Métropole Spirituelle
            </h2>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              Tivaouane (ou Tivawaan en wolof) est une ville du centre-ouest du Sénégal, située à environ 
              90 km à l'est de Dakar, dans la région de Thiès. Avant l'arrivée d'El Hadji Malick Sy en 1902, 
              ce n'était qu'une <strong className="text-[#004D33]">bourgade agricole tranquille</strong>, 
              peuplée principalement de Sérères et de Wolofs.
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold text-[#004D33] mb-3">Pourquoi Tivaouane ?</h3>
              <p className="text-[#4A4A4A] mb-3">
                Le choix de Tivaouane par Maodo n'était pas le fruit du hasard. Plusieurs facteurs stratégiques 
                ont guidé cette décision :
              </p>
              <ul className="space-y-2 text-[#4A4A4A]">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span><strong>Distance vis-à-vis du pouvoir colonial :</strong> Contrairement à Saint-Louis, 
                  capitale coloniale où il enseignait, Tivaouane offrait plus d'autonomie</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span><strong>Position géographique centrale :</strong> Carrefour entre plusieurs régions, 
                  facilitant l'afflux de disciples</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span><strong>Terre fertile et paisible :</strong> Propice à l'étude et à la méditation</span>
                </li>
              </ul>
            </div>

            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              En l'espace de quelques années, Tivaouane se transforma en <strong className="text-[#004D33]">
              pôle intellectuel et spirituel</strong>. Des étudiants affluèrent de tout le Sénégal, de la Gambie, 
              de la Mauritanie et même de la Guinée pour étudier auprès de Maodo.
            </p>
          </div>
        </div>
      </section>

      {/* Les Lieux Sacrés */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Les Lieux Emblématiques
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lieux.map((lieu, index) => {
              const Icon = lieu.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={lieu.image}
                      alt={lieu.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="w-16 h-16 bg-[#004D33]/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-[#D4AF37]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-[#004D33] mb-4">
                      {lieu.title}
                    </h3>
                    <p className="text-[#4A4A4A] leading-relaxed">
                      {lieu.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Organisation Urbaine */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-6">
                L'Organisation de la Cité
              </h2>
              
              <div className="space-y-6 text-lg text-[#4A4A4A] leading-relaxed">
                <p>
                  Tivaouane s'organise aujourd'hui autour de <strong className="text-[#004D33]">
                  trois pôles principaux</strong> :
                </p>

                <div className="space-y-4">
                  <div className="bg-[#F9F7F2] p-6 rounded-xl border-l-4 border-[#D4AF37]">
                    <h4 className="font-bold text-[#004D33] mb-2">Le Centre Religieux</h4>
                    <p className="text-base">
                      Autour de la Grande Mosquée et du mausolée de Maodo, c'est le cœur spirituel 
                      où se concentrent les activités religieuses quotidiennes.
                    </p>
                  </div>

                  <div className="bg-[#F9F7F2] p-6 rounded-xl border-l-4 border-[#D4AF37]">
                    <h4 className="font-bold text-[#004D33] mb-2">Le Quartier des Daaras</h4>
                    <p className="text-base">
                      Zone résidentielle où sont implantées les nombreuses écoles coraniques qui 
                      perpétuent l'enseignement de Maodo.
                    </p>
                  </div>

                  <div className="bg-[#F9F7F2] p-6 rounded-xl border-l-4 border-[#D4AF37]">
                    <h4 className="font-bold text-[#004D33] mb-2">Le Centre Urbain Moderne</h4>
                    <p className="text-base">
                      Développement récent avec commerces, écoles françaises, hôpitaux, qui coexiste 
                      harmonieusement avec le pôle religieux.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
                  alt="Organisation urbaine de Tivaouane"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-[#D4AF37] rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Démographique */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 lg:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-[#004D33] mb-6">
              Une Métamorphose Démographique
            </h2>
            
            <div className="space-y-6 text-lg text-[#4A4A4A] leading-relaxed">
              <p>
                L'impact d'El Hadji Malick Sy sur Tivaouane fut spectaculaire. D'un village de quelques 
                centaines d'habitants au début du 20e siècle, Tivaouane compte aujourd'hui 
                <strong className="text-[#004D33]"> plus de 50 000 habitants permanents</strong>.
              </p>

              <p>
                Mais c'est lors du <strong className="text-[#004D33]">Gamou annuel</strong> que la ville 
                révèle sa vraie dimension : pendant 10 jours, la population peut dépasser 
                <strong className="text-[#004D33]"> 2 millions de personnes</strong>, faisant de Tivaouane 
                temporairement la deuxième ville du Sénégal après Dakar.
              </p>

              <div className="bg-[#E8F5E9] p-6 rounded-lg my-6">
                <p className="text-[#004D33] font-semibold mb-0">
                  Cette transformation fait de Tivaouane un cas unique en Afrique de l'Ouest : 
                  une ville dont l'identité et la prospérité sont entièrement liées à sa dimension spirituelle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Tivaouane : Plus qu'une Ville, un État d'Esprit
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            Tivaouane n'est pas seulement un lieu géographique. C'est un projet spirituel, 
            une utopie réalisée où le savoir et la piété cohabitent, où les disciples de tous horizons 
            se retrouvent dans l'amour du Prophète (PSL) et l'enseignement de Maodo.
          </p>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              تواون - مدينة النور
              <br />
              Tivaouane - Cité de la Lumière
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeographieSacree;