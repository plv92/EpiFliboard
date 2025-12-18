
import React from 'react';
import { CATEGORIES } from './constants';
import { CategoryType } from './types';

const CategoryMenu: React.FC<{ activeCategory: CategoryType; onSelect: (c: CategoryType) => void }> = ({ activeCategory, onSelect }) => (
  <div className="sticky top-[77px] z-40 glass border-b border-slate-100 dark:border-border-dark transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-6 flex gap-10 py-5 overflow-x-auto no-scrollbar scroll-smooth">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] transition-all relative py-1 ${
            activeCategory === cat.id ? 'text-primary' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          {cat.label}
          {activeCategory === cat.id && (
            <span className="absolute -bottom-5 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_8px_rgba(79,70,229,0.4)]" />
          )}
        </button>
      ))}
    </div>
  </div>
);
export default CategoryMenu;
