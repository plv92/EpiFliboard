
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './Navbar';
import CategoryMenu from './CategoryMenu';
import ArticleCard from './ArticleCard';
import ArticleView from './ArticleView';
import AuthModal from './AuthModal';
import ProfilePage from './ProfilePage';
import { AuthProvider } from './AuthContext';
import { Article, CategoryType } from './types';
import { fetchRealNews } from './newsService';

const MainApp: React.FC = () => {
  const [view, setView] = useState<'feed' | 'profile'>('feed');
  const [activeCategory, setActiveCategory] = useState<CategoryType>(CategoryType.NEWS);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('epiflipboard_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('epiflipboard_theme', !isDarkMode ? 'dark' : 'light');
  };

  // Chargement initial d'une catégorie ou recherche
  const loadInitialContent = useCallback(async (cat: CategoryType, q?: string) => {
    setIsLoading(true);
    setPage(1);
    
    try {
      const data = await fetchRealNews(cat, q, 1, (fresh) => {
        setArticles(fresh);
        setIsLoading(false);
      });
      setArticles(data);
      if (data.length > 0) setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, []);

  // Chargement supplémentaire pour l'infinite scroll
  const loadMoreContent = useCallback(async () => {
    if (isMoreLoading || isLoading) return;
    setIsMoreLoading(true);
    const nextPage = page + 1;
    
    try {
      const newData = await fetchRealNews(activeCategory, searchQuery, nextPage);
      if (newData.length > 0) {
        setArticles(prev => {
          // Filtrer les doublons éventuels
          const existingIds = new Set(prev.map(a => a.id));
          const uniqueNew = newData.filter(a => !existingIds.has(a.id));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
      }
    } finally {
      setIsMoreLoading(false);
    }
  }, [activeCategory, searchQuery, page, isMoreLoading, isLoading]);

  useEffect(() => {
    loadInitialContent(activeCategory, searchQuery);
  }, [activeCategory, searchQuery, loadInitialContent]);

  // Observer pour l'Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && articles.length > 0 && !isLoading) {
          loadMoreContent();
        }
      },
      { rootMargin: '400px' }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMoreContent, articles.length, isLoading]);

  const handleHomeClick = () => {
    setView('feed');
    setSearchQuery('');
    setActiveCategory(CategoryType.NEWS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-textPrimary-light dark:text-textPrimary-dark font-sans transition-colors duration-500">
      <Navbar 
        onSearch={(q) => { 
          setSearchQuery(q); 
          setView('feed');
        }} 
        onHomeClick={handleHomeClick}
        onAuthClick={() => setView(view === 'profile' ? 'feed' : 'profile')} 
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
      
      <div className="flex-1 relative">
        {view === 'feed' ? (
          <div className="animate-slide-in-left">
            <CategoryMenu 
              activeCategory={activeCategory} 
              onSelect={(c) => { 
                if (c !== activeCategory) {
                  setActiveCategory(c); 
                  setSearchQuery(''); 
                }
              }} 
            />

            <main className="max-w-7xl mx-auto px-6 py-12 w-full">
              <header className="mb-12 animate-fade-up">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                    {searchQuery ? 'RÉSULTATS IA' : 'FLUX EN DIRECT'}
                  </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-4 capitalize">
                  {searchQuery ? `"${searchQuery}"` : activeCategory.toLowerCase()}
                </h2>
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`} />
                  {isLoading ? 'Synchronisation Gemini...' : 'Propulsé par Gemini 3.0 • 2025'}
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {articles.map((article, i) => (
                  <ArticleCard 
                    key={`${article.id}-${i}`} 
                    article={article} 
                    index={i}
                    onClick={setSelectedArticle}
                  />
                ))}
                
                {isLoading && articles.length === 0 && (
                  [...Array(12)].map((_, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-card-dark rounded-[2.5rem] aspect-[3/4] animate-pulse border border-slate-100 dark:border-border-dark" />
                  ))
                )}
              </div>
              
              {/* Sentinelle de scroll infini */}
              <div ref={loaderRef} className="py-24 flex flex-col items-center justify-center gap-4">
                {isMoreLoading && (
                  <>
                    <div className="w-10 h-10 border-4 border-slate-200 dark:border-border-dark border-t-primary rounded-full animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Chargement de la suite...</span>
                  </>
                )}
              </div>
            </main>
          </div>
        ) : (
          <ProfilePage articles={articles} onArticleClick={setSelectedArticle} onBack={() => setView('feed')} />
        )}
      </div>

      {selectedArticle && (
        <ArticleView article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}

      <footer className="border-t border-slate-100 dark:border-border-dark py-20 px-6 bg-white dark:bg-card-dark text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center font-bold text-white dark:text-slate-900 text-xl shadow-xl">E</div>
          <span className="font-display font-black text-2xl tracking-tighter">EpiFlipboard</span>
        </div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">Curatelle Intelligente • 2025</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;
