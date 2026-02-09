import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";

const ComingSoon = ({ title }) => {
  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="coming-soon-page">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-[#004D33]" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
            {title}
          </h1>
          
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
          
          <p className="text-xl text-[#4A4A4A] mb-8">
            Cette section est actuellement en cours de développement
          </p>
          
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 mb-8">
            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              Nous travaillons avec soin pour vous offrir un contenu riche et authentique 
              qui honore l'héritage spirituel de L'empreinte de Maodo.
            </p>
          </div>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;