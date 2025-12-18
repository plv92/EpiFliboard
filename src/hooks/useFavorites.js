import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'epiflipboard_favorites';

/**
 * Hook personnalisé pour gérer les articles favoris dans LocalStorage
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Charger les favoris au montage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      }
    };
    loadFavorites();
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }, [favorites]);

  /**
   * Ajoute un article aux favoris
   */
  const addFavorite = (article) => {
    setFavorites(prev => {
      // Éviter les doublons
      if (prev.some(fav => fav.url === article.url)) {
        return prev;
      }
      return [...prev, { ...article, savedAt: new Date().toISOString() }];
    });
  };

  /**
   * Retire un article des favoris
   */
  const removeFavorite = (articleUrl) => {
    setFavorites(prev => prev.filter(fav => fav.url !== articleUrl));
  };

  /**
   * Vérifie si un article est dans les favoris
   */
  const isFavorite = (articleUrl) => {
    return favorites.some(fav => fav.url === articleUrl);
  };

  /**
   * Toggle le statut favori d'un article
   */
  const toggleFavorite = (article) => {
    if (isFavorite(article.url)) {
      removeFavorite(article.url);
    } else {
      addFavorite(article);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
};
