
import React, { useState, useEffect } from 'react';
import { Article, Comment } from './types';
import { ICONS } from './constants';
import { getArticleDeepDive } from './geminiService';
import { useAuth } from './AuthContext';

interface ArticleViewProps {
  article: Article;
  onClose: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onClose }) => {
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
    addToHistory(article.id);
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
  }, [article.id]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
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
        
        {/* Progress Bar Top */}
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

          {/* AI Deep Dive Section - Hidden or Collapsed in Reading Mode */}
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
                  <div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-full w-10/12 animate-pulse" />
                </div>
              ) : (
                <div className="relative">
                  <div className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-8">
                    {aiAnalysis.split('\n').map((para, i) => <p key={i} className="mb-6 last:mb-0">{para}</p>)}
                  </div>
                  {sources.length > 0 && (
                    <div className="mt-12 pt-10 border-t border-slate-200/50 dark:border-slate-800/50">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 mb-6">Sources d'approfondissement</h5>
                      <div className="flex flex-wrap gap-3">
                        {sources.map((chunk, idx) => chunk.web && (
                          <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white dark:bg-card-dark text-slate-600 dark:text-slate-400 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-border-dark hover:border-primary dark:hover:border-primary hover:text-primary transition-all font-bold shadow-sm">
                            {chunk.web.title || 'Référence'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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

            {/* Hidden in Reading Mode */}
            {!isReadingMode && (
              <>
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 py-12 border-y border-slate-100 dark:border-border-dark mt-12 bg-slate-50/50 dark:bg-slate-900/50 px-8 rounded-[3rem]">
                  <div className="flex flex-col gap-2">
                    <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Poursuivre la lecture</h5>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-slate-900 dark:text-slate-100 hover:text-primary transition-all">
                      <span className="text-xl font-black underline decoration-primary/20 group-hover:decoration-primary">Consulter la source originale</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l7-7m-7 7H3" />
                      </svg>
                    </a>
                  </div>

                  <div className="flex items-center gap-4">
                     <button onClick={() => toggleLike(article.id)} className={`p-5 rounded-2xl bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark transition-all hover:scale-110 shadow-sm ${isLiked ? 'text-accent border-accent/20 bg-accent/5' : 'hover:text-accent dark:text-slate-400'}`}><ICONS.Heart active={isLiked} /></button>
                     <button onClick={() => toggleBookmark(article.id)} className={`p-5 rounded-2xl bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark transition-all hover:scale-110 shadow-sm ${isBookmarked ? 'text-primary border-primary/20 bg-primary/5' : 'hover:text-primary dark:text-slate-400'}`}><ICONS.Bookmark active={isBookmarked} /></button>
                     <button className="p-5 rounded-2xl bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark transition-all hover:scale-110 shadow-sm hover:text-slate-900 dark:hover:text-white dark:text-slate-400"><ICONS.Share /></button>
                  </div>
                </div>

                {/* Enhanced Comments */}
                <section className="pt-20">
                  <div className="flex items-center justify-between mb-12">
                    <h3 className="text-3xl font-sans font-black text-slate-900 dark:text-slate-100 flex items-center gap-4 tracking-tighter">
                      Discussion <span className="text-primary/40">({comments.length})</span>
                    </h3>
                  </div>

                  {isAuthenticated ? (
                    <form onSubmit={handlePostComment} className="mb-20">
                      <div className="flex gap-6">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 dark:border-border-dark flex-shrink-0 shadow-sm">
                          <img src={user?.avatar} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Qu'en pensez-vous ?"
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-border-dark rounded-[2rem] p-6 text-sm font-semibold focus:bg-white dark:focus:bg-card-dark focus:ring-4 focus:ring-primary/5 outline-none min-h-[120px] resize-none transition-all placeholder:text-slate-400 dark:text-slate-500 dark:text-white"
                          />
                          <div className="flex justify-end">
                            <button type="submit" className="bg-slate-900 dark:bg-slate-100 hover:bg-primary px-10 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-white dark:text-slate-900 transition-all active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-primary/20">Publier mon avis</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-[3rem] border border-slate-100 dark:border-border-dark text-center mb-20 border-dashed">
                      <p className="text-slate-400 dark:text-slate-500 font-bold mb-6">Rejoignez la communauté pour commenter cet article.</p>
                      <button className="text-primary font-black uppercase tracking-widest text-xs hover:underline underline-offset-8">Se connecter maintenant</button>
                    </div>
                  )}

                  <div className="space-y-12">
                    {comments.length > 0 ? (
                      comments.map(c => (
                        <div key={c.id} className="flex gap-6 group animate-fade-up">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 dark:border-border-dark flex-shrink-0 shadow-sm group-hover:border-primary/30 transition-colors">
                            <img src={c.userAvatar} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">{c.userName}</span>
                              <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">{new Date(c.timestamp).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-[2rem] rounded-tl-none border border-slate-100/50 dark:border-border-dark/50">{c.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-slate-300 dark:text-slate-600 py-12 italic font-bold tracking-tight">Soyez le premier à partager votre réflexion.</p>
                    )}
                  </div>
                </section>
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
