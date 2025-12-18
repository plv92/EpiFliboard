
import { Article, CategoryType } from "./types";
import { fetchLatestArticles } from "./services/geminiService";

/**
 * NewsAPI Key configurée pour l'utilisateur.
 * Note: NewsAPI (plan gratuit) bloque les requêtes provenant du navigateur 
 * sauf si l'origine est 'localhost' ou '127.0.0.1'.
 */
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
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Récupère des articles. 
 * Stratégie : 
 * 1. Vérifie le cache local.
 * 2. Tente NewsAPI (recommandé pour localhost).
 * 3. En cas de restriction (426) ou erreur, bascule sur Gemini IA pour générer des news fraîches.
 */
export const fetchRealNews = async (
  category: CategoryType, 
  query?: string, 
  page: number = 1,
  onFreshData?: (data: Article[]) => void
): Promise<Article[]> => {
  const cacheKey = `${query ? `q:${query.toLowerCase()}` : `c:${category}`}_p:${page}`;
  const now = Date.now();

  // 1. Retourner le cache si valide (évite les appels inutiles)
  if (memoryCache[cacheKey] && (now - memoryCache[cacheKey].timestamp < CACHE_TTL)) {
    return memoryCache[cacheKey].data;
  }

  try {
    // 2. Tentative avec NewsAPI (Moteur de news réelles)
    let url = '';
    if (query) {
      url = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=12&page=${page}&apiKey=${NEWS_API_KEY}`;    } else {
      const apiCategory = categoryMapping[category];
      url = `${BASE_URL}/top-headlines?country=us&category=${apiCategory}&pageSize=12&page=${page}&apiKey=${NEWS_API_KEY}`;
    }

    const response = await fetch(url);

    // Détection de la restriction "localhost only" du plan Developer NewsAPI
    if (response.status === 426 || response.status === 403) {
      console.warn("NewsAPI : Restriction 'localhost' détectée. Basculement sur Gemini IA...");
      throw new Error("Localhost restriction");
    }

    const data = await response.json();
    if (data.status !== 'ok') throw new Error(data.message);

    const mappedArticles: Article[] = data.articles.map((art: any, index: number) => ({
      id: art.url || `news-${index}-${now}`,
      title: art.title,
      description: art.description || "Description non disponible pour le moment.",
      content: art.content || art.description || "Cliquez sur la source pour voir le contenu complet.",
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
    // 3. Fallback vers Gemini IA (Synthèse de news réalistes)
    // Cela permet à l'application de fonctionner même hors-localhost ou si la clé NewsAPI est expirée/limitée.
    console.log("Utilisation du moteur Gemini pour la génération de news...");
    const aiArticles = await fetchLatestArticles(category);
    
    // Stockage du fallback en cache pour limiter les appels IA
    memoryCache[cacheKey] = { data: aiArticles, timestamp: now };
    if (onFreshData) onFreshData(aiArticles);
    return aiArticles;
  }
};
