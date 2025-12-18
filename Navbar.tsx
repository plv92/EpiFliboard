
import React, { useState, useRef } from 'react';
import { ICONS } from './constants';
import { useAuth } from './AuthContext';

interface NavbarProps {
  onSearch: (q: string) => void;
  onHomeClick: () => void;
  onAuthClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onHomeClick, onAuthClick, isDarkMode, onToggleTheme }) => {
  const [q, setQ] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setIsSearching(true);
    onSearch(q);
    setTimeout(() => setIsSearching(false), 1500); // Feedback visuel
    searchInputRef.current?.blur();
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-100 dark:border-border-dark px-4 md:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0" 
          onClick={onHomeClick}
        >
          <div className="w-11 h-11 bg-slate-900 dark:bg-white rounded-[1rem] flex items-center justify-center font-display font-black text-2xl shadow-2xl text-white dark:text-slate-900 transition-all group-hover:bg-primary dark:group-hover:bg-primary group-hover:text-white group-hover:scale-105 group-hover:rotate-3">
            E
          </div>
          <span className="hidden lg:block font-display font-black text-2xl tracking-tighter text-slate-900 dark:text-white transition-colors group-hover:text-primary">
            EpiFlipboard
          </span>
        </div>

        {/* Search Bar - Responsive & Optimized */}
        <form className="flex-1 max-w-2xl relative" onSubmit={handleSearchSubmit}>
          <div className="relative group">
            <div className={`absolute inset-y-0 left-5 flex items-center transition-colors ${isSearching ? 'text-primary' : 'text-slate-400 group-focus-within:text-primary'}`}>
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <ICONS.Search />
              )}
            </div>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Rechercher par sujet, lieu ou intention..." 
              className="w-full bg-slate-50 dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl py-3.5 pl-14 pr-6 text-sm font-bold focus:bg-white dark:focus:bg-card-dark focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-400 dark:text-slate-500 dark:text-white" 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
            />
            {q && (
              <button 
                type="button"
                onClick={() => { setQ(''); onHomeClick(); }}
                className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-slate-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button 
            onClick={onToggleTheme}
            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-card-dark border border-slate-200 dark:border-border-dark text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:border-primary/30 transition-all active:scale-90 flex items-center justify-center shadow-sm"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {!isAuthenticated ? (
            <button 
              onClick={onAuthClick}
              className="bg-slate-900 dark:bg-white px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all active:scale-95"
            >
              S'abonner
            </button>
          ) : (
            <button 
              onClick={onAuthClick}
              className="flex items-center gap-3 p-1.5 pr-5 rounded-2xl bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark hover:border-primary transition-all active:scale-95 group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 dark:border-border-dark group-hover:border-primary/30 transition-colors">
                <img src={user?.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:flex flex-col items-start leading-tight">
                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{user?.name}</span>
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ma Collection</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
