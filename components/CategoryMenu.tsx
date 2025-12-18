
import React from 'react';
import { CATEGORIES } from '../constants';
import { CategoryType } from '../types';

interface CategoryMenuProps {
  activeCategory: CategoryType;
  onSelect: (category: CategoryType) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ activeCategory, onSelect }) => {
  return (
    <div className="sticky top-[65px] z-40 glass border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-6 py-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`whitespace-nowrap text-xs font-bold uppercase tracking-widest transition-all relative ${
                activeCategory === cat.id ? 'text-primary' : 'text-textSecondary hover:text-white'
              }`}
            >
              {cat.label}
              {activeCategory === cat.id && (
                <span className="absolute -bottom-4 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
