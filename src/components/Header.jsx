import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Heart } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Newspaper className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Epi<span className="text-blue-600">Flipboard</span>
            </h1>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link 
              to="/favorites" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden md:inline">Favoris</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
