
import React from 'react';
import { Article } from './types';
import { ICONS } from './constants';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  onBookmark: (id: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, onBookmark }) => {
  const date = new Date(article.publishedAt);
  
  return (
    <div 
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 flex flex-col cursor-pointer shadow-sm"
      onClick={() => onClick(article)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711432869-5d593f5f203e?auto=format&fit=crop&q=80&w=800'; }}
        />
        <div className="absolute top-2 left-2 px-2 py-1 glass rounded-md flex items-center gap-2 border border-white/10">
          <img src={article.sourceLogo} className="w-4 h-4 rounded-full" alt="" />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-white">{article.source}</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{article.category}</span>
          <span className="text-[10px] text-textSecondary uppercase">{date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
        </div>
        <h3 className="text-base font-bold leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-textSecondary line-clamp-3 mb-4 flex-1">
          {article.description}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-border/50">
          <div className="flex items-center gap-3 text-textSecondary">
            <span className="flex items-center gap-1 text-[10px]"><ICONS.Heart /> {article.likes}</span>
            <span className="flex items-center gap-1 text-[10px]"><ICONS.Chat /> {article.comments}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onBookmark(article.id); }}
            className={`p-1 rounded-md hover:bg-white/5 transition-colors ${article.isBookmarked ? 'text-accent' : 'text-textSecondary'}`}
          >
            <ICONS.Bookmark active={article.isBookmarked} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
