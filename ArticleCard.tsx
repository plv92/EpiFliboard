
import React, { useState, useEffect, useRef } from 'react';
import { Article } from './types';
import { ICONS } from './constants';
import { useAuth } from './AuthContext';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  index?: number;
  onAuthRequired?: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, index = 0, onAuthRequired }) => {
  const { bookmarks, likes, toggleBookmark, toggleLike, isAuthenticated } = useAuth();
  const [imageState, setImageState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const date = new Date(article.publishedAt);
  const isBookmarked = bookmarks.includes(article.id);
  const isLiked = likes.includes(article.id);
  const displayLikes = article.likes + (isLiked ? 1 : 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setImageState('loading');
          observer.disconnect();
        }
      },
      { rootMargin: '600px' }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    toggleLike(article);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    toggleBookmark(article);
  };

  return (
    <div 
      ref={cardRef}
      className="group bg-white dark:bg-card-dark rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-border-dark transition-all duration-500 flex flex-col cursor-pointer shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] hover:-translate-y-2 opacity-0 animate-fade-up"
      style={{ animationDelay: `${(index % 8) * 0.05}s` }}
      onClick={() => onClick(article)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
        {imageState !== 'loaded' && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
             <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-700 border-t-primary rounded-full animate-spin z-10" />
          </div>
        )}
        
        {isVisible && (
          <img 
            src={article.image} 
            alt={article.title} 
            onLoad={() => setImageState('loaded')}
            onError={() => setImageState('error')}
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${imageState === 'loaded' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'}`}
            loading="lazy"
          />
        )}
        
        <div className="absolute top-5 left-5 z-10 transition-transform duration-500 group-hover:scale-110">
          <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-2xl border border-white/20 dark:border-white/5">
            <img src={article.sourceLogo} className="w-5 h-5 rounded-lg object-cover bg-black" alt="" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{article.source}</span>
          </div>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-5">
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] px-3 py-1 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10">{article.category}</span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            {date.getFullYear()} • {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-display font-black leading-tight mb-4 line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors tracking-tighter">
          {article.title}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-8 flex-1 font-medium">
          {article.description}
        </p>

        <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-border-dark/50">
          <div className="flex items-center gap-6 text-slate-400 dark:text-slate-500">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 text-xs font-black transition-all hover:scale-110 ${isLiked ? 'text-accent' : 'hover:text-accent'}`}
            >
              <ICONS.Heart active={isLiked} /> 
              <span className="tabular-nums font-bold">{displayLikes}</span>
            </button>
            <span className="flex items-center gap-2 text-xs font-black">
              <ICONS.Chat /> <span className="tabular-nums font-bold">{article.commentsCount}</span>
            </span>
          </div>
          <button 
            onClick={handleBookmark}
            className={`p-3 rounded-2xl transition-all hover:scale-110 ${isBookmarked ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-400 hover:text-primary border border-transparent'}`}
          >
            <ICONS.Bookmark active={isBookmarked} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
