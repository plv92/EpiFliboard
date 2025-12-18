
import React, { useState, useEffect } from 'react';
import { Article } from './types';
import { ICONS } from './constants';
import { getArticleDeepDive } from './geminiService';

interface ArticleViewProps {
  article: Article;
  onClose: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onClose }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  // Added sources state to store grounding data from Gemini
  const [sources, setSources] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const result = await getArticleDeepDive(article);
        // Fix: result is an object { text: string; sources: any[] }, set state accordingly
        setAiAnalysis(result.text);
        setSources(result.sources || []);
      } catch (err) {
        console.error("Analysis error:", err);
        setAiAnalysis(article.content || article.description);
      } finally {
        setIsAnalyzing(false);
      }
    };
    fetchAnalysis();
  }, [article]);

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-background/98 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto min-h-screen relative shadow-2xl bg-background border-x border-border flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 glass border-b border-border flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={article.sourceLogo} alt={article.source} className="w-8 h-8 rounded-full border border-white/10" />
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-primary">{article.source}</div>
              <div className="text-[10px] text-textSecondary">{article.author}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-card border border-border rounded-full hover:bg-white/10 transition-all hover:rotate-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Hero Section */}
        <div className="w-full aspect-video md:aspect-[21/9] relative overflow-hidden">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="px-6 md:px-16 py-10 flex-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {article.category}
            </span>
            <span className="text-textSecondary text-xs">
              Publié le {new Date(article.publishedAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-extrabold leading-tight mb-8">
            {article.title}
          </h1>

          {/* AI Insights Banner */}
          <div className="mb-10 p-6 rounded-2xl bg-indigo-500/5 border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <div className="w-16 h-16 bg-primary rounded-full blur-2xl" />
            </div>
            <h4 className="flex items-center gap-2 text-primary font-bold text-sm mb-4 uppercase tracking-tighter">
              <span className="animate-pulse">✨</span> IA Deep Dive - Analyse par Gemini
            </h4>
            
            {isAnalyzing ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-4/6 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="text-lg text-gray-200 leading-relaxed font-medium">
                  {aiAnalysis.split('\n').map((para, i) => (
                    <p key={i} className="mb-4 last:mb-0">{para}</p>
                  ))}
                </div>
                {/* Display grounding sources if available to comply with Gemini API guidelines */}
                {sources.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-primary/10">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Sources & Références</h5>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((chunk, idx) => chunk.web && (
                        <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full border border-primary/20 transition-all">
                          {chunk.web.title || 'Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div className="prose prose-invert max-w-none text-textSecondary text-lg leading-relaxed">
              <p className="font-semibold text-white mb-6 text-xl">{article.description}</p>
              <p>{article.content}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 py-8 border-t border-border mt-8">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-8 py-4 bg-primary hover:bg-indigo-600 rounded-full font-bold text-white transition-all shadow-lg shadow-primary/30"
              >
                Lire l'article original sur {article.source}
              </a>
              <div className="flex items-center gap-4">
                 <button className="p-3 rounded-full bg-card border border-border hover:text-accent transition-colors">
                  <ICONS.Heart />
                </button>
                <button className="p-3 rounded-full bg-card border border-border hover:text-primary transition-colors">
                  <ICONS.Bookmark active={article.isBookmarked} />
                </button>
                <button className="p-3 rounded-full bg-card border border-border hover:text-white transition-colors">
                  <ICONS.Share />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer padding */}
        <div className="h-10" />
      </div>
    </div>
  );
};

export default ArticleView;
