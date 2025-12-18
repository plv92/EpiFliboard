import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import FlippableCard from '../components/FlippableCard';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            ❤️ Mes Articles Favoris
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun favori pour le moment
            </h3>
            <p className="text-gray-500">
              Commencez à sauvegarder vos articles préférés en cliquant sur le cœur !
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <Heart className="w-8 h-8 text-red-500 mr-3 fill-current" />
            Mes Articles Favoris
          </h2>
          <p className="text-gray-600 mt-2">
            {favorites.length} article{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((article, index) => (
            <FlippableCard key={`${article.url}-${index}`} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
