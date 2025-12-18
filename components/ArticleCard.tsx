
import React from 'react';
import { Article } from '../types';
import { ICONS } from '../constants';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
  onBookmark: (id: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, onBookmark }) => {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  });

  return (
    <div 
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 flex flex-col cursor-pointer shadow-sm hover:shadow-primary/10"
      onClick={() => onClick(article)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${article.id}/800/450`;
          }}
        />
        <div className="absolute top-3 left-3 z-10">
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
            <img src={article.sourceLogo} alt={article.source} className="w-4 h-4 rounded-full object-cover" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">{article.source}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-accent text-[10px] font-black uppercase tracking-widest">
            {article.category}
          </span>
          <span className="text-textSecondary text-[10px] font-medium">
            {formattedDate}
          </span>
        </div>
        
        <h3 className="text-lg font-bold leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2 font-display">
          {article.title}
        </h3>
        
        <p className="text-textSecondary text-xs leading-relaxed line-clamp-3 mb-6 flex-1 opacity-80">
          {article.description}
        </p>

        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
          <div className="flex items-center gap-4 text-textSecondary">
            <button className="flex items-center gap-1.5 hover:text-accent transition-colors" title="Like">
              <ICONS.Heart />
              <span className="text-[10px] font-bold">{article.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-primary transition-colors" title="Comments">
              <ICONS.Chat />
              <span className="text-[10px] font-bold">{article.comments}</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button 
              className="p-1.5 hover:text-primary transition-colors rounded-full hover:bg-white/5"
              onClick={(e) => { e.stopPropagation(); onBookmark(article.id); }}
              title="Bookmark"
            >
              <ICONS.Bookmark active={article.isBookmarked} />
            </button>
            <button className="p-1.5 hover:text-primary transition-colors rounded-full hover:bg-white/5" title="Share">
              <ICONS.Share />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
