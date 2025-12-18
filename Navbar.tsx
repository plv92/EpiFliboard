
import React, { useState } from 'react';
import { ICONS } from './constants';

const Navbar: React.FC<{ onSearch: (q: string) => void; onProfileClick: () => void }> = ({ onSearch, onProfileClick }) => {
  const [q, setQ] = useState('');
  return (
    <nav className="sticky top-0 z-50 glass border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-2xl shadow-lg">E</div>
          <span className="hidden md:block font-display font-bold text-xl">EpiFlipboard</span>
        </div>
        <form className="flex-1 max-w-xl" onSubmit={(e) => { e.preventDefault(); onSearch(q); }}>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-textSecondary"><ICONS.Search /></div>
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full bg-card/50 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50" 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
            />
          </div>
        </form>
        <div className="flex items-center gap-4">
          <button onClick={onProfileClick} className="p-2 bg-card border border-border rounded-full"><ICONS.User /></button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
