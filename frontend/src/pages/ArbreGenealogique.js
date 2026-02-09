import { useState, useEffect } from "react";
import { Users, ChevronDown, ChevronRight, Star, Crown, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ArbreGenealogique = () => {
  const [expandedNodes, setExpandedNodes] = useState(['maodo']);
  const [familyTree, setFamilyTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  // Fetch family tree from API
  useEffect(() => {
    const fetchFamilyTree = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/family-tree/tree`);
        if (response.ok) {
          const data = await response.json();
          if (data && !data.error) {
            setFamilyTree(data);
          }
        }
      } catch (error) {
        console.error('Error fetching family tree:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFamilyTree();
  }, []);

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const renderFamilyMember = (member, level = 0) => {
    if (!member) return null;
    
    const hasChildren = member.enfants && member.enfants.length > 0;
    const isExpanded = expandedNodes.includes(member.id);
    const isRoot = level === 0;
    const titre = typeof member.titre === 'object' ? (member.titre[language] || member.titre.fr) : member.titre;

    return (
      <div key={member.id} className={`${level > 0 ? 'ml-8 mt-4' : ''}`}>
        <div 
          className={`relative flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
            member.current 
              ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]' 
              : isRoot 
                ? 'bg-[#004D33] text-white' 
                : 'bg-white hover:bg-[#E8F5E9] shadow-md'
          }`}
          onClick={() => hasChildren && toggleNode(member.id)}
          data-testid={`family-member-${member.id}`}
        >
          {/* Connection line */}
          {level > 0 && (
            <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-[#D4AF37]"></div>
          )}

          {/* Photo */}
          <div className="relative flex-shrink-0">
            <img 
              src={member.image} 
              alt={member.nom}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
            />
            {member.current && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-[#004D33]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold truncate ${isRoot ? 'text-white' : 'text-[#004D33]'}`}>
                {member.nom}
              </h3>
              {member.surnom && (
                <span className={`text-sm ${isRoot ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`}>
                  "{member.surnom}"
                </span>
              )}
            </div>
            <p className={`text-sm ${isRoot ? 'text-white/80' : 'text-[#888888]'}`}>
              {member.dates}
            </p>
            <p className={`text-xs ${isRoot ? 'text-[#D4AF37]' : 'text-[#004D33]'}`}>
              {titre}
            </p>
          </div>

          {/* Expand indicator */}
          {hasChildren && (
            <div className={`flex-shrink-0 ${isRoot ? 'text-[#D4AF37]' : 'text-[#004D33]'}`}>
              {isExpanded ? (
                <ChevronDown className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="relative ml-8 mt-2 pl-4 border-l-2 border-[#D4AF37]/30">
            {member.enfants.map((child) => renderFamilyMember(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="arbre-loading">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#004D33] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4A4A]">{t('loading') || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="arbre-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-6">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">{t('spiritualLineage')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('familyTreeTitle')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {t('familyTreeSubtitle')}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#4A4A4A]">
            <Star className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
            {t('clickToExpand')}
          </p>
        </div>
      </section>

      {/* Family Tree */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {familyTree ? (
            renderFamilyMember(familyTree)
          ) : (
            <div className="text-center py-12">
              <p className="text-[#888]">{t('noData') || 'Aucune donnée disponible'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Note */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F9F7F2] rounded-2xl p-8 border-l-4 border-[#D4AF37]">
            <h3 className="text-xl font-bold text-[#004D33] mb-4">{t('aboutThisTree')}</h3>
            <p className="text-[#4A4A4A] mb-4">
              {t('treeDescription')}
            </p>
            <p className="text-[#4A4A4A] mb-4">
              {t('extendedFamily')}
            </p>
            <Link 
              to="/histoire/khalifes"
              className="inline-flex items-center gap-2 text-[#004D33] font-semibold hover:text-[#D4AF37] transition-colors"
            >
              {t('viewDetailedPage')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-center font-bold text-[#004D33] mb-4">{t('legend')}</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#004D33] rounded"></div>
              <span className="text-sm text-[#4A4A4A]">{t('founder')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#D4AF37]/30 border-2 border-[#D4AF37] rounded"></div>
              <span className="text-sm text-[#4A4A4A]">{t('currentKhalife')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
              <span className="text-sm text-[#4A4A4A]">{t('familyMembers')}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArbreGenealogique;
