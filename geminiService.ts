
import { GoogleGenAI } from "@google/genai";
import { Article } from "./types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Utilise Gemini pour analyser un article RÉEL et fournir un résumé intelligent avec contexte.
 * Cette fonction est appelée uniquement lorsqu'un utilisateur ouvre un article.
 */
export const getArticleDeepDive = async (article: Article): Promise<{ text: string; sources: any[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ 
        parts: [{ 
          text: `Agis comme un analyste de presse expert. Analyse cet article réel :
          Titre : ${article.title}
          Source : ${article.source}
          Description : ${article.description}
          Contenu partiel : ${article.content}
          
          Rédige un "Deep Dive" en français d'environ 400 mots qui :
          1. Résume les points clés.
          2. Apporte un éclairage ou un contexte supplémentaire (historique, économique ou technique) via Google Search.
          3. Explique pourquoi cette information est importante aujourd'hui.
          
          Utilise un ton journalistique élégant et structuré.`
        }] 
      }],
      config: {
        tools: [{ googleSearch: {} }] 
      }
    });

    return {
      text: response.text || "L'analyse intelligente est momentanément indisponible.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Deep Dive Error:", error);
    return { 
      text: "Impossible de générer l'analyse approfondie. Voici la description d'origine : " + article.description, 
      sources: [] 
    };
  }
};
