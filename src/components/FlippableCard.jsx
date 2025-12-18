import React, { useState } from 'react';
import { Heart, ExternalLink, Calendar, User } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

const FlippableCard = ({ article }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(article);
  };

  const handleReadMore = (e) => {
    e.stopPropagation();
    window.open(article.url, '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Image par défaut si pas d'image
  const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div 
      className="flip-card h-96 cursor-pointer perspective"
      onClick={handleFlip}
    >
      <div className={`flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Face avant */}
        <div className="flip-card-face flip-card-front absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg bg-white">
          <div className="relative h-full">
            <img 
              src={imageUrl}
              alt={article.title}
              className="w-full h-2/3 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isFavorite(article.url)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite(article.url) ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="p-4 h-1/3 flex flex-col justify-between">
              <h3 className="font-bold text-lg line-clamp-2 text-gray-800">
                {article.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Face arrière */}
        <div className="flip-card-face flip-card-back absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 rotate-y-180">
          <div className="p-6 h-full flex flex-col justify-between text-white">
            <div>
              <h3 className="font-bold text-xl mb-3">
                {article.title}
              </h3>
              <p className="text-sm mb-4 line-clamp-6 text-white/90">
                {article.description || 'Aucune description disponible.'}
              </p>
              {article.author && (
                <div className="flex items-center text-sm mb-2">
                  <User className="w-4 h-4 mr-2" />
                  <span className="line-clamp-1">{article.author}</span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleReadMore}
                className="flex-1 bg-white text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Lire l'article</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite(article.url)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite(article.url) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
