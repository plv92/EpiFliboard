
import React, { useState, useEffect, useRef } from 'react';
import { Article } from './types';
import { ICONS } from './constants';
import { useAuth } from './AuthContext';

interface CompactArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

const CompactArticleCard: React.FC<CompactArticleCardProps> = ({ article, onClick }) => {
  const { toggleBookmark, bookmarks, isAuthenticated } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const date = new Date(article.publishedAt);
  const isBookmarked = bookmarks.includes(article.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group bg-white dark:bg-card-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-border-dark flex flex-col sm:flex-row cursor-pointer transition-all hover:shadow-xl dark:hover:shadow-primary/5 hover:border-primary/20"
      onClick={() => onClick(article)}
    >
      {/* Image Section */}
      <div className="w-full sm:w-48 h-32 flex-shrink-0 relative overflow-hidden bg-slate-100 dark:bg-slate-900">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 animate-shimmer bg-shimmer" />
        )}
        
        {isVisible && (
          <img 
            src={article.image} 
            alt={article.title} 
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter text-slate-800 dark:text-slate-200 border border-white/20">
            {article.source}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[9px] font-black text-primary uppercase tracking-widest">{article.category}</span>
          <span className="text-[9px] text-slate-400 font-bold">{date.toLocaleDateString('fr-FR')}</span>
        </div>
        
        <h3 className="text-sm font-bold leading-tight mb-2 text-slate-900 dark:text-slate-100 line-clamp-2 font-sans group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {article.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <button 
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary flex items-center gap-1 transition-all"
            onClick={(e) => { e.stopPropagation(); onClick(article); }}
          >
            Lire l'article
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (isAuthenticated) toggleBookmark(article); 
              }}
              className={`p-1.5 rounded-lg transition-all ${isBookmarked ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <ICONS.Bookmark active={isBookmarked} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactArticleCard;
