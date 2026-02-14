import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Hook to fetch dynamic page content by slug
 * @param {string} slug - The page slug (e.g., "histoire/origines")
 * @param {string} language - Current language code
 */
export const useDynamicPage = (slug, language = 'fr') => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/dynamic-pages/by-slug/${slug}`);
        
        if (response.ok) {
          const data = await response.json();
          setPage(data);
          setError(null);
        } else if (response.status === 404) {
          setError('Page not found');
          setPage(null);
        } else {
          throw new Error('Failed to fetch page');
        }
      } catch (err) {
        console.error('Error fetching dynamic page:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  // Helper to get localized text
  const getText = (obj, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    return obj[language] || obj['fr'] || obj['en'] || Object.values(obj)[0] || fallback;
  };

  // Get visible sections sorted by order
  const getSections = () => {
    if (!page?.sections) return [];
    return page.sections
      .filter(s => s.visible !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  return {
    page,
    loading,
    error,
    getText,
    getSections,
    title: getText(page?.titre),
    description: getText(page?.description),
    heroImage: page?.hero_image,
    heroIcon: page?.hero_icon
  };
};

export default useDynamicPage;
