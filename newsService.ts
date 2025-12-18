
import { Article, CategoryType } from "./types";
import { fetchLatestArticles } from "./services/geminiService";

const NEWS_API_KEY = '1d14f912da1745dba722ccf889155368';
const BASE_URL = 'https://newsapi.org/v2';

const categoryMapping: Record<CategoryType, string> = {
  [CategoryType.NEWS]: 'general',
  [CategoryType.TECH]: 'technology',
  [CategoryType.ENTERTAINMENT]: 'entertainment',
  [CategoryType.SPORTS]: 'sports',
  [CategoryType.TRAVEL]: 'general',
  [CategoryType.FOOD]: 'health',
  [CategoryType.BUSINESS]: 'business',
  [CategoryType.SCIENCE]: 'science'
};

const memoryCache: Record<string, { data: Article[], timestamp: number }> = {};
const CACHE_TTL = 15 * 60 * 1000;

/**
 * Crée un ID stable à partir de l'URL ou du titre
 */
const generateStableId = (url: string, title: string) => {
  if (url && url !== "null") return url;
  // Fallback sur un hash simple du titre si l'URL est manquante
  return btoa(unescape(encodeURIComponent(title))).substring(0, 32);
};

export const fetchRealNews = async (
  category: CategoryType, 
  query?: string, 
  page: number = 1,
  onFreshData?: (data: Article[]) => void
): Promise<Article[]> => {
  const cacheKey = `${query ? `q:${query.toLowerCase()}` : `c:${category}`}_p:${page}`;
  const now = Date.now();

  if (memoryCache[cacheKey] && (now - memoryCache[cacheKey].timestamp < CACHE_TTL)) {
    return memoryCache[cacheKey].data;
  }

  try {
    let url = '';
    if (query) {
      // Recherche en français
      url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&language=fr&sortBy=publishedAt&pageSize=12&page=${page}&apiKey=${NEWS_API_KEY}`;
    } else {
      const apiCategory = categoryMapping[category];
      // Utiliser 'everything' avec des mots-clés français pour avoir plus de résultats
      // car top-headlines avec country=fr retourne peu d'articles
      const frenchKeywords: Record<string, string> = {
        'general': 'actualités france monde',
        'technology': 'technologie innovation numérique',
        'entertainment': 'divertissement cinéma musique',
        'sports': 'sport football rugby',
        'health': 'santé alimentation bien-être',
        'business': 'économie entreprise finance',
        'science': 'science découverte recherche'
      };
      const keywords = frenchKeywords[apiCategory] || 'actualités';
      url = `${BASE_URL}/everything?q=${encodeURIComponent(keywords)}&language=fr&sortBy=publishedAt&pageSize=12&page=${page}&apiKey=${NEWS_API_KEY}`;
    }

    const response = await fetch(url);

    if (response.status === 426 || response.status === 403) {
      throw new Error("Localhost restriction");
    }

    const data = await response.json();
    if (data.status !== 'ok') throw new Error(data.message);

    const mappedArticles: Article[] = data.articles.map((art: any) => ({
      id: generateStableId(art.url, art.title),
      title: art.title,
      description: art.description || "Description non disponible.",
      content: art.content || art.description || "Contenu complet disponible via la source.",
      image: art.urlToImage || `https://images.unsplash.com/photo-1504711432869-5d39a110fdd7?auto=format&fit=crop&q=80&w=800`,
      source: art.source.name,
      sourceLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(art.source.name)}&background=000&color=fff&size=128&bold=true`,
      category: category,
      publishedAt: art.publishedAt,
      author: art.author || art.source.name,
      likes: Math.floor(Math.random() * 450),
      commentsCount: Math.floor(Math.random() * 30),
      isBookmarked: false,
      isLiked: false,
      url: art.url
    }));

    memoryCache[cacheKey] = { data: mappedArticles, timestamp: now };
    if (onFreshData) onFreshData(mappedArticles);
    return mappedArticles;

  } catch (error) {
    const aiArticles = await fetchLatestArticles(category);
    memoryCache[cacheKey] = { data: aiArticles, timestamp: now };
    if (onFreshData) onFreshData(aiArticles);
    return aiArticles;
  }
};
