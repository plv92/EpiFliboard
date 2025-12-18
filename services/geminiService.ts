
import { GoogleGenAI, Type } from "@google/genai";
import { Article, CategoryType } from "../types";

export const fetchLatestArticles = async (category: CategoryType = CategoryType.NEWS): Promise<Article[]> => {
  // Initialize GoogleGenAI inside the call as per recommended best practices
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Génère 10 articles de presse réalistes et captivants pour la catégorie : ${category}. 
      Les articles doivent sembler provenir de vrais journaux (Le Monde, TechCrunch, etc.).
      Format de réponse attendu : JSON.
      Chaque article doit avoir un titre percutant, une description de 150 caractères et un contenu d'environ 1000 caractères en français.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              content: { type: Type.STRING },
              image: { type: Type.STRING, description: "URL d'image Unsplash réaliste liée au sujet" },
              source: { type: Type.STRING },
              sourceLogo: { type: Type.STRING },
              publishedAt: { type: Type.STRING },
              author: { type: Type.STRING },
              likes: { type: Type.NUMBER },
              commentsCount: { type: Type.NUMBER },
              url: { type: Type.STRING, description: "Lien fictif ou vers une source réelle" }
            },
            required: ["id", "title", "description", "content", "image", "source", "publishedAt", "author", "url", "likes", "commentsCount"]
          }
        }
      }
    });

    const articlesData = JSON.parse(response.text || '[]');
    return articlesData.map((article: any) => ({
      ...article,
      category,
      isBookmarked: false,
      // Fix: Added missing property required by Article interface
      isLiked: false, 
      image: article.image || `https://picsum.photos/seed/${article.id}/800/450`,
      sourceLogo: article.sourceLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.source)}&background=random`
    }));
  } catch (error) {
    console.error("Error generating articles with Gemini:", error);
    return [];
  }
};

/**
 * Utilise Gemini pour générer une analyse approfondie d'un article
 */
export const getArticleDeepDive = async (article: Article): Promise<{ text: string; sources: any[] }> => {
  // Initialize GoogleGenAI inside the call as per recommended best practices
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyse cet article de presse et propose un résumé enrichi avec du contexte historique ou technique.
      Titre: ${article.title}
      Source: ${article.source}
      Description: ${article.description}
      
      Rédige une analyse captivante en français de environ 300 mots, structurée en paragraphes clairs.`,
      config: {
        tools: [{ googleSearch: {} }] 
      }
    });

    const text = response.text || "Désolé, l'IA n'a pas pu générer d'analyse pour le moment.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, sources };
  } catch (error) {
    console.error("Erreur Gemini Deep Dive:", error);
    return { text: article.content, sources: [] };
  }
};
