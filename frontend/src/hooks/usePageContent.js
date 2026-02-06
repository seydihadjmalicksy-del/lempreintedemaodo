import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Hook to fetch page content from the API
 * @param {string} slug - Page identifier (e.g., 'maodo', 'gamou', 'ecole')
 * @param {string} language - Language code ('fr', 'en', 'ar', 'wo')
 * @returns {Object} { content, loading, error, refetch }
 */
export const usePageContent = (slug, language = 'fr') => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API}/content/${slug}?lang=${language}`);
      
      // Transform the response to a more usable format
      const sections = response.data.sections || {};
      const formattedContent = {};
      
      for (const [sectionKey, sectionData] of Object.entries(sections)) {
        formattedContent[sectionKey] = {
          text: sectionData.text,
          allLanguages: sectionData.all_languages,
          metadata: sectionData.metadata,
          id: sectionData.id
        };
      }
      
      setContent(formattedContent);
    } catch (err) {
      console.error(`Error fetching content for ${slug}:`, err);
      setError(err.response?.data?.detail || 'Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [slug, language]);

  return { content, loading, error, refetch: fetchContent };
};

/**
 * Hook to fetch a specific section of a page
 * @param {string} slug - Page identifier
 * @param {string} section - Section identifier
 * @param {string} language - Language code
 * @returns {Object} { text, metadata, loading, error }
 */
export const usePageSection = (slug, section, language = 'fr') => {
  const [data, setData] = useState({ text: '', metadata: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSection = async () => {
      if (!slug || !section) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`${API}/content/${slug}/${section}?lang=${language}`);
        setData({
          text: response.data.text,
          allLanguages: response.data.all_languages,
          metadata: response.data.metadata,
          id: response.data.id
        });
      } catch (err) {
        console.error(`Error fetching ${slug}/${section}:`, err);
        setError(err.response?.data?.detail || 'Section non trouvée');
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [slug, section, language]);

  return { ...data, loading, error };
};

/**
 * Helper function to get text with fallback
 * @param {Object} content - Content object from usePageContent
 * @param {string} section - Section key
 * @param {string} fallback - Fallback text if content not found
 * @returns {string} Text content or fallback
 */
export const getContentText = (content, section, fallback = '') => {
  return content?.[section]?.text || fallback;
};

/**
 * Helper function to get metadata
 * @param {Object} content - Content object from usePageContent
 * @param {string} section - Section key
 * @returns {Object|null} Metadata or null
 */
export const getContentMetadata = (content, section) => {
  return content?.[section]?.metadata || null;
};

export default usePageContent;
