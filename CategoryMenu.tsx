
import React from 'react';
import { CATEGORIES } from './constants';
import { CategoryType } from './types';

const CategoryMenu: React.FC<{ activeCategory: CategoryType; onSelect: (c: CategoryType) => void }> = ({ activeCategory, onSelect }) => (
  <div className="sticky top-[65px] z-40 glass border-b border-border">
    <div className="max-w-7xl mx-auto px-4 flex gap-6 py-4 overflow-x-auto no-scrollbar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-all relative ${
            activeCategory === cat.id ? 'text-primary' : 'text-textSecondary hover:text-white'
          }`}
        >
          {cat.label}
          {activeCategory === cat.id && <span className="absolute -bottom-4 left-0 right-0 h-1 bg-primary rounded-t-full shadow-lg" />}
        </button>
      ))}
    </div>
  </div>
);
export default CategoryMenu;
