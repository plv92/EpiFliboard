import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

// Catégories disponibles
export const CATEGORIES = [
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology'
];

/**
 * Récupère les top headlines par catégorie
 * @param {string} category - Catégorie des articles
 * @param {string} country - Code pays (par défaut: 'us')
 * @returns {Promise} Articles
 */
export const getTopHeadlines = async (category = 'general', country = 'us') => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        country,
        category,
        apiKey: API_KEY,
        pageSize: 50
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    throw error;
  }
};

/**
 * Recherche d'articles par mot-clé
 * @param {string} query - Terme de recherche
 * @returns {Promise} Articles
 */
export const searchArticles = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        apiKey: API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 50
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'articles:', error);
    throw error;
  }
};
