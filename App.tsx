
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import CategoryMenu from './CategoryMenu';
import ArticleCard from './ArticleCard';
import ArticleView from './ArticleView';
import { Article, CategoryType } from './types';
import { fetchRealNews } from './newsService';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>(CategoryType.NEWS);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadArticles = useCallback(async (cat: CategoryType, query?: string) => {
    setIsLoading(true);
    try {
      const data = await fetchRealNews(cat, query);
      setArticles(data || []);
    } catch (err) {
      console.error("App load error:", err);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles(activeCategory, searchQuery);
  }, [activeCategory, searchQuery, loadArticles]);

  const toggleBookmark = (id: string) => {
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, isBookmarked: !a.isBookmarked } : a
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-textPrimary selection:bg-primary/30">
      <Navbar 
        onSearch={(q) => { setSearchQuery(q); setActiveCategory(CategoryType.NEWS); }} 
        onProfileClick={() => alert("Profil bientôt disponible !")} 
      />
      
      {!searchQuery && (
        <CategoryMenu 
          activeCategory={activeCategory} 
          onSelect={(c) => { setActiveCategory(c); setSearchQuery(''); }} 
        />
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight mb-2">
            {searchQuery ? `Recherche : ${searchQuery}` : activeCategory}
          </h2>
          <div className="flex items-center gap-3 text-textSecondary text-sm">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
            {isLoading ? 'Chargement des dernières news...' : `${articles.length} articles trouvés`}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl aspect-[4/5] animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onClick={setSelectedArticle}
                    onBookmark={toggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card/50 rounded-3xl border border-dashed border-border">
                <p className="text-textSecondary">Aucun article trouvé. Essayez une autre catégorie ou recherche.</p>
              </div>
            )}
          </>
        )}
      </main>

      {selectedArticle && (
        <ArticleView 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}

      <footer className="border-t border-border mt-20 py-12 px-4 bg-card/20 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white">E</div>
          <span className="font-display font-bold text-xl">EpiFlipboard</span>
        </div>
        <p className="text-textSecondary text-xs">© 2024 EpiFlipboard Inc. Your news, curated.</p>
      </footer>
    </div>
  );
};

export default App;
