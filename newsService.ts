
import { Article, CategoryType } from "./types";
import { fetchLatestArticles } from "./geminiService";

// Récupération de la clé depuis le .env (VITE_NEWS_API_KEY)
// Note: En local avec Vite, utilisez import.meta.env.VITE_NEWS_API_KEY 
// ou process.env.VITE_NEWS_API_KEY selon votre config.
const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY || '1d14f912da1745dba722ccf889155368';

export const fetchRealNews = async (category: CategoryType, query?: string): Promise<Article[]> => {
  const categoryMap: Record<string, string> = {
    [CategoryType.NEWS]: 'general',
    [CategoryType.TECH]: 'technology',
    [CategoryType.ENTERTAINMENT]: 'entertainment',
    [CategoryType.SPORTS]: 'sports',
    [CategoryType.BUSINESS]: 'business',
    [CategoryType.SCIENCE]: 'science',
    [CategoryType.TRAVEL]: 'general',
    [CategoryType.FOOD]: 'general',
  };

  // Paramètres de recherche spécifiques pour les catégories qui n'existent pas nativement dans NewsAPI
  const qParam = (category === CategoryType.TRAVEL) ? 'voyage' : (category === CategoryType.FOOD) ? 'cuisine' : '';
  
  let apiUrl = query 
    ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=fr&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    : `https://newsapi.org/v2/top-headlines?country=fr&category=${categoryMap[category]}${qParam ? `&q=${qParam}` : ''}&apiKey=${NEWS_API_KEY}`;

  // Utilisation d'un proxy pour éviter les erreurs CORS en développement local
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Erreur réseau NewsAPI");
    
    const wrapper = await response.json();
    const data = JSON.parse(wrapper.contents);

    if (data.status !== 'ok') {
      console.error("NewsAPI Error:", data.message);
      throw new Error(data.message || "Erreur NewsAPI");
    }

    if (!data.articles || data.articles.length === 0) {
      console.warn("Aucun article trouvé sur NewsAPI, repli sur Gemini...");
      return await fetchLatestArticles(category);
    }

    return data.articles
      .filter((a: any) => a.title && a.title !== '[Removed]' && a.urlToImage)
      .map((a: any, index: number) => ({
        id: a.url || `news-${index}-${Date.now()}`,
        title: a.title,
        description: a.description || "Pas de description disponible.",
        content: a.content || a.description || "Le contenu complet n'est pas disponible.",
        image: a.urlToImage,
        source: a.source.name || "Source",
        sourceLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(a.source.name || 'N')}&background=random&color=fff`,
        category,
        publishedAt: a.publishedAt || new Date().toISOString(),
        author: a.author || a.source.name || "Rédaction",
        likes: Math.floor(Math.random() * 300),
        comments: Math.floor(Math.random() * 40),
        isBookmarked: false,
        url: a.url
      }));
  } catch (error) {
    console.warn("NewsAPI a échoué (clé invalide ou quota), utilisation de Gemini en secours:", error);
    return await fetchLatestArticles(category);
  }
};
