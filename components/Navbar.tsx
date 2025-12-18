
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface NavbarProps {
  onSearch: (query: string) => void;
  onProfileClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onProfileClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer" onClick={() => window.location.hash = ''}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-display font-bold text-2xl shadow-lg shadow-primary/20">
            E
          </div>
          <span className="hidden md:block font-display font-bold text-xl tracking-tight">EpiFlipboard</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
              <ICONS.Search />
            </div>
            <input
              type="text"
              placeholder="Rechercher des articles, sources..."
              className="w-full bg-card/50 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="hidden sm:block px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
            Log in
          </button>
          <button className="hidden sm:block px-5 py-2 text-sm font-semibold bg-primary hover:bg-indigo-600 rounded-full transition-all active:scale-95 shadow-lg shadow-primary/20">
            Sign up
          </button>
          <button 
            onClick={onProfileClick}
            className="p-2 rounded-full bg-card border border-border hover:border-primary transition-colors"
            title="Profile"
          >
            <ICONS.User />
          </button>
          <button className="md:hidden p-2">
            <ICONS.Menu />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
