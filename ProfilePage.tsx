
import React, { useState, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { Article } from './types';
import CompactArticleCard from './CompactArticleCard';

interface ProfilePageProps {
  onArticleClick: (article: Article) => void;
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onArticleClick, onBack }) => {
  const { user, bookmarks, likes, history, savedArticles, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'saved' | 'history' | 'liked'>('saved');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Correction : On utilise savedArticles (le cache global) au lieu du flux d'articles filtré
  const filteredArticles = useMemo(() => {
    const getItems = (ids: string[]) => ids.map(id => savedArticles[id]).filter(Boolean);
    
    return {
      saved: getItems(bookmarks),
      liked: getItems(likes),
      hist: getItems(history)
    };
  }, [bookmarks, likes, history, savedArticles]);

  const currentList = activeTab === 'saved' ? filteredArticles.saved : 
                      activeTab === 'liked' ? filteredArticles.liked : 
                      filteredArticles.hist;

  const handleLogout = () => {
    logout();
    onBack();
  };

  return (
    <div className="min-h-screen pb-24 bg-background-light dark:bg-background-dark animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto px-6">
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
            onClick={() => setShowLogoutConfirm(true)}
            className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-border-dark text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-accent/10 hover:text-accent hover:border-accent/20 transition-all active:scale-95"
          >
            Déconnexion
          </button>
        </div>

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
              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest mb-3">Membre Premium</div>
              <h1 className="text-4xl font-display font-black text-slate-900 dark:text-slate-100 mb-1 tracking-tight">{user?.name}</h1>
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
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Liste vide</h3>
            <p className="text-slate-400 dark:text-slate-500 mb-10 text-xs">Explorez le magazine pour alimenter votre bibliothèque.</p>
            <button onClick={onBack} className="px-10 py-4 bg-primary text-white font-bold rounded-2xl">Découvrir le feed</button>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-[2.5rem] p-10 shadow-2xl">
            <div className="text-center">
              <h3 className="text-2xl font-display font-black mb-3">Déconnexion</h3>
              <p className="text-slate-400 text-sm mb-8">Êtes-vous sûr ?</p>
              <div className="space-y-3">
                <button onClick={handleLogout} className="w-full bg-accent py-4 rounded-2xl font-black text-[10px] uppercase text-white">Confirmer</button>
                <button onClick={() => setShowLogoutConfirm(false)} className="w-full bg-slate-50 dark:bg-slate-900/50 py-4 rounded-2xl font-black text-[10px] uppercase">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
