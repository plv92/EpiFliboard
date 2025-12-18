
import React, { useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Article } from './types';
import CompactArticleCard from './CompactArticleCard';
import { ICONS } from './constants';

interface ProfilePageProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ articles, onArticleClick, onBack }) => {
  const { user, bookmarks, likes, history, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'saved' | 'history' | 'liked'>('saved');

  const filteredArticles = useMemo(() => {
    // Dans un vrai cas, on devrait filtrer parmi TOUS les articles déjà chargés ou mis en cache
    // Ici on filtre sur les articles actuellement présents dans le feed pour la démo
    const saved = articles.filter(a => bookmarks.includes(a.id));
    const liked = articles.filter(a => likes.includes(a.id));
    const hist = articles.filter(a => history.includes(a.id));
    return { saved, liked, hist };
  }, [articles, bookmarks, likes, history]);

  const currentList = activeTab === 'saved' ? filteredArticles.saved : 
                      activeTab === 'liked' ? filteredArticles.liked : 
                      filteredArticles.hist;

  return (
    <div className="min-h-screen pb-24 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Navigation */}
        <div className="pt-12 pb-10 flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="group flex items-center gap-3 text-slate-400 dark:text-slate-500 hover:text-primary font-bold text-sm tracking-tight transition-all"
          >
            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-border-dark flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            Retour au magazine
          </button>
          
          <button 
            onClick={logout}
            className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-border-dark text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
          >
            Déconnexion
          </button>
        </div>

        {/* Profile Info Card */}
        <div className="relative mb-16">
          <div className="bg-white dark:bg-card-dark rounded-[3rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-border-dark flex flex-col md:flex-row items-center gap-10 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl border-4 border-slate-50 dark:border-slate-800 shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-card-dark rounded-full" />
            </div>

            <div className="flex-1 text-center md:text-left z-10">
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                Membre Premium
              </div>
              <h1 className="text-4xl font-display font-black text-slate-900 dark:text-slate-100 mb-1 tracking-tight">
                {user?.name}
              </h1>
              <p className="text-slate-400 dark:text-slate-500 font-medium text-base mb-6">{user?.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-display font-black text-slate-900 dark:text-slate-100">{history.length}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">Lectures</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-display font-black text-slate-900 dark:text-slate-100">{bookmarks.length}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">Sauvegardes</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-display font-black text-slate-900 dark:text-slate-100">{likes.length}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600">J'aime</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="sticky top-24 z-30 mb-12 flex justify-center">
          <div className="bg-white/80 dark:bg-card-dark/80 backdrop-blur-xl border border-slate-100 dark:border-border-dark p-1.5 rounded-2xl shadow-xl dark:shadow-none flex gap-1">
            {(['saved', 'history', 'liked'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md' 
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tab === 'saved' ? 'Mes Favoris' : tab === 'history' ? 'Historique' : 'J\'aime'}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid - Compact Mode */}
        {currentList.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up">
            {currentList.map((article) => (
              <CompactArticleCard 
                key={article.id} 
                article={article} 
                onClick={onArticleClick} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50/50 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
              <span className="text-3xl">📭</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">Liste vide</h3>
            <p className="text-slate-400 dark:text-slate-500 max-w-xs mx-auto mb-10 text-xs leading-relaxed font-medium">
              Explorez le magazine pour alimenter votre bibliothèque personnelle.
            </p>
            <button 
              onClick={onBack} 
              className="px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
              Découvrir le feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
