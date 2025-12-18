
import React, { useState, useEffect } from 'react';
import { Article, Comment } from './types';
import { ICONS } from './constants';
import { getArticleDeepDive } from './geminiService';
import { useAuth } from './AuthContext';

interface ArticleViewProps {
  article: Article;
  onClose: () => void;
  onAuthRequired?: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onClose, onAuthRequired }) => {
  const { user, addToHistory, toggleBookmark, toggleLike, bookmarks, likes, isAuthenticated } = useAuth();
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [sources, setSources] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [comments, setComments] = useState<Comment[]>(article.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isReadingMode, setIsReadingMode] = useState(false);

  const isBookmarked = bookmarks.includes(article.id);
  const isLiked = likes.includes(article.id);

  useEffect(() => {
    // On n'ajoute à l'historique que si connecté
    if (isAuthenticated) {
      addToHistory(article);
    }
    
    const fetchAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const result = await getArticleDeepDive(article);
        setAiAnalysis(result.text);
        setSources(result.sources || []);
      } catch (err) {
        setAiAnalysis(article.content || article.description);
      } finally {
        setIsAnalyzing(false);
      }
    };
    fetchAnalysis();
  }, [article.id, isAuthenticated]);

  const handleLike = () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    toggleLike(article);
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    toggleBookmark(article);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    if (!newComment.trim() || !user) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || '',
      text: newComment,
      timestamp: new Date().toISOString()
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div className={`fixed inset-0 z-[60] overflow-y-auto animate-in fade-in duration-300 transition-colors duration-500 ${isReadingMode ? 'bg-white dark:bg-[#0f1115]' : 'bg-slate-50 dark:bg-background-dark'}`}>
      <div className={`max-w-5xl mx-auto min-h-screen relative shadow-[0_0_100px_rgba(0,0,0,0.1)] flex flex-col transition-all duration-500 ${isReadingMode ? 'bg-white dark:bg-[#0f1115] border-none max-w-3xl' : 'bg-white dark:bg-card-dark border-x border-slate-100 dark:border-border-dark'}`}>
        
        <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 z-[70]">
          <div className="h-full bg-primary animate-[shimmer_2s_infinite]" style={{ width: isAnalyzing ? '30%' : '100%', transition: 'width 1s' }} />
        </div>

        <div className={`sticky top-0 z-20 glass border-b border-slate-100 dark:border-border-dark flex justify-between items-center px-8 py-4 transition-all ${isReadingMode ? 'bg-transparent border-transparent' : ''}`}>
          <div className="flex items-center gap-4">
            {!isReadingMode && (
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-border-dark p-2">
                <img src={article.sourceLogo} alt={article.source} className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary">{article.source}</div>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-bold">{article.author}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsReadingMode(!isReadingMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isReadingMode ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-primary/10 hover:text-primary'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              {isReadingMode ? 'Quitter le mode lecture' : 'Mode Lecture'}
            </button>
            <button 
              onClick={onClose} 
              className="group p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-border-dark rounded-2xl hover:bg-slate-900 dark:hover:bg-slate-100 hover:text-white dark:hover:text-slate-900 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {!isReadingMode && (
          <div className="w-full aspect-video md:aspect-[21/9] relative overflow-hidden group">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-card-dark via-transparent to-transparent opacity-80" />
          </div>
        )}

        <div className={`px-8 transition-all duration-500 ${isReadingMode ? 'md:px-12 py-10' : 'md:px-24 py-16'}`}>
          <div className={`flex items-center gap-4 mb-10 transition-opacity ${isReadingMode ? 'opacity-60' : ''}`}>
            <span className="bg-primary/5 dark:bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/10 dark:border-primary/20">{article.category}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider">{new Date(article.publishedAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</span>
          </div>

          <h1 className={`font-sans font-black leading-tight mb-12 tracking-tighter text-slate-900 dark:text-slate-100 transition-all ${isReadingMode ? 'text-3xl md:text-5xl border-b pb-8 border-slate-100 dark:border-slate-800' : 'text-4xl md:text-6xl'}`}>
            {article.title}
          </h1>

          {!isReadingMode && (
            <div className="mb-16 p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-border-dark relative overflow-hidden group/ai">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl transition-transform group-hover/ai:scale-150 duration-700" />
              <h4 className="flex items-center gap-3 text-primary font-black text-xs mb-8 uppercase tracking-[0.3em]">
                <span className="text-xl">✨</span> Gemini IA Deep Dive
              </h4>
              {isAnalyzing ? (
                <div className="space-y-6">
                  <div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-full w-full animate-pulse" />
                  <div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-full w-11/12 animate-pulse" />
                </div>
              ) : (
                <div className="relative">
                  <div className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-8">
                    {aiAnalysis.split('\n').map((para, i) => <p key={i} className="mb-6 last:mb-0">{para}</p>)}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-16">
            <article className={`prose prose-slate dark:prose-invert max-w-none transition-all duration-500 ${isReadingMode ? 'prose-lg' : ''}`}>
              <p className={`font-bold text-slate-900 dark:text-slate-100 mb-12 leading-relaxed tracking-tight ${isReadingMode ? 'text-xl' : 'text-2xl'}`}>
                {article.description}
              </p>
              <div className={`text-slate-600 dark:text-slate-400 leading-loose space-y-8 whitespace-pre-line ${isReadingMode ? 'font-serif text-xl' : 'text-lg'}`}>
                {article.content}
              </div>
            </article>

            {!isReadingMode && (
              <>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 py-12 border-y border-slate-100 dark:border-border-dark mt-12 bg-slate-50/50 dark:bg-slate-900/50 px-8 rounded-[3rem]">
                  <div className="flex items-center gap-4">
                     <button onClick={handleLike} className={`p-5 rounded-2xl bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark transition-all hover:scale-110 shadow-sm ${isLiked ? 'text-accent border-accent/20 bg-accent/5' : 'hover:text-accent dark:text-slate-400'}`}><ICONS.Heart active={isLiked} /></button>
                     <button onClick={handleBookmark} className={`p-5 rounded-2xl bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark transition-all hover:scale-110 shadow-sm ${isBookmarked ? 'text-primary border-primary/20 bg-primary/5' : 'hover:text-primary dark:text-slate-400'}`}><ICONS.Bookmark active={isBookmarked} /></button>
                     <button className="p-5 rounded-2xl bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark transition-all hover:scale-110 shadow-sm hover:text-slate-900 dark:hover:text-white dark:text-slate-400"><ICONS.Share /></button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="h-32" />
      </div>
    </div>
  );
};

export default ArticleView;
