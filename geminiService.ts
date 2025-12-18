
import { GoogleGenAI, Type } from "@google/genai";
import { Article, CategoryType } from "./types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchLatestArticles = async (category: CategoryType = CategoryType.NEWS): Promise<Article[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ 
        parts: [{ 
          text: `Génère 10 articles de presse réalistes en français pour la catégorie : ${category}. 
          Réponds EXCLUSIVEMENT sous forme de tableau JSON. 
          Chaque objet doit contenir: id, title, description, content, image (URL Unsplash), source, author, publishedAt (ISO).` 
        }] 
      }],
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
              image: { type: Type.STRING },
              source: { type: Type.STRING },
              publishedAt: { type: Type.STRING },
              author: { type: Type.STRING },
            },
            required: ["id", "title", "description", "content", "source", "publishedAt", "author"]
          }
        }
      }
    });

    const articlesData = JSON.parse(response.text || '[]');
    return articlesData.map((article: any, index: number) => ({
      ...article,
      id: article.id || `gen-${index}-${Date.now()}`,
      category,
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 30),
      isBookmarked: false,
      image: article.image || `https://picsum.photos/seed/${article.id || index}/800/450`,
      sourceLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(article.source)}&background=random&color=fff`,
      url: article.url || "#"
    }));
  } catch (error) {
    console.error("Erreur generation Gemini:", error);
    return [];
  }
};

export const getArticleDeepDive = async (article: Article): Promise<{ text: string; sources: any[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ 
        parts: [{ 
          text: `Analyse approfondie de l'article suivant en français : "${article.title}". 
          Source originale: ${article.source}. Fournis un contexte historique ou technique de 300 mots.` 
        }] 
      }],
      config: {
        tools: [{ googleSearch: {} }] 
      }
    });

    return {
      text: response.text || "L'analyse n'a pas pu être générée.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Erreur Deep Dive Gemini:", error);
    return { text: article.content || article.description, sources: [] };
  }
};
