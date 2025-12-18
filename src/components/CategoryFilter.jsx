import React from 'react';
import { CATEGORIES } from '../services/newsApi';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categoryLabels = {
    business: '💼 Business',
    entertainment: '🎬 Entertainment',
    health: '🏥 Santé',
    science: '🔬 Science',
    sports: '⚽ Sports',
    technology: '💻 Tech'
  };

  return (
    <div className="bg-white shadow-sm py-4 mb-6 sticky top-[72px] z-40">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto space-x-2 md:space-x-3 pb-2 scrollbar-hide">
          <button
            onClick={() => onCategoryChange('general')}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              selectedCategory === 'general'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌍 Toutes
          </button>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
