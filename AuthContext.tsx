import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserData, Article } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (email: string, name: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  bookmarks: string[];
  likes: string[];
  history: string[];
  savedArticles: Record<string, Article>; // Cache global des articles sauvegardés/aimés
  toggleBookmark: (article: Article) => void;
  toggleLike: (article: Article) => void;
  addToHistory: (article: Article) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'epiflipboard_current_user',
  USERS_DB: 'epiflipboard_users_database',
  USER_DATA_PREFIX: 'epiflipboard_userdata_',
  ARTICLE_CACHE: 'epiflipboard_article_cache'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>({ bookmarks: [], likes: [], history: [] });
  const [savedArticles, setSavedArticles] = useState<Record<string, Article>>({});

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const globalCache = localStorage.getItem(STORAGE_KEYS.ARTICLE_CACHE);
    
    if (globalCache) {
      setSavedArticles(JSON.parse(globalCache));
    }

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.id);
    }
  }, []);

  const loadUserData = (userId: string) => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA_PREFIX + userId);
    if (data) {
      setUserData(JSON.parse(data));
    } else {
      setUserData({ bookmarks: [], likes: [], history: [] });
    }
  };

  const persistData = (userId: string, newData: UserData, newCache?: Record<string, Article>) => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA_PREFIX + userId, JSON.stringify(newData));
    setUserData(newData);
    
    if (newCache) {
      localStorage.setItem(STORAGE_KEYS.ARTICLE_CACHE, JSON.stringify(newCache));
      setSavedArticles(newCache);
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const db = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    const users = db ? JSON.parse(db) : [];

    if (users.find((u: any) => u.email === email)) {
      return { success: false, message: "Email déjà utilisé." };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email, name, password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    loadUserData(newUser.id);
    return { success: true, message: "Succès" };
  };

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const db = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    const users = db ? JSON.parse(db) : [];
    const found = users.find((u: any) => u.email === email && u.password === password);

    if (found) {
      setUser(found);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));
      loadUserData(found.id);
      return { success: true, message: "Succès" };
    }
    return { success: false, message: "Identifiants incorrects." };
  };

  const logout = () => {
    setUser(null);
    setUserData({ bookmarks: [], likes: [], history: [] });
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const updateCacheAndData = (article: Article, type: 'bookmarks' | 'likes' | 'history') => {
    if (!user) return;
    
    const isRemoving = type !== 'history' && userData[type].includes(article.id);
    
    const newList = isRemoving 
      ? userData[type].filter(id => id !== article.id)
      : type === 'history' 
        ? [article.id, ...userData.history.filter(id => id !== article.id)].slice(0, 50)
        : [article.id, ...userData[type]];

    const newCache = { ...savedArticles };
    if (!isRemoving) {
      newCache[article.id] = article;
    } else {
      // On ne supprime du cache que si l'article n'est plus ni liké, ni bookmarké, ni dans l'historique
      const isStillNeeded = userData.bookmarks.includes(article.id) || 
                            userData.likes.includes(article.id) || 
                            userData.history.includes(article.id);
      // Fix: Removed redundant check 'type !== "history"' which caused TS error because isRemoving=true 
      // already guarantees 'type' is narrowed to '"bookmarks" | "likes"'.
      if (!isStillNeeded) delete newCache[article.id];
    }

    persistData(user.id, { ...userData, [type]: newList }, newCache);
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, signup, logout, isAuthenticated: !!user,
      bookmarks: userData.bookmarks, 
      likes: userData.likes, 
      history: userData.history,
      savedArticles,
      toggleBookmark: (article) => updateCacheAndData(article, 'bookmarks'),
      toggleLike: (article) => updateCacheAndData(article, 'likes'),
      addToHistory: (article) => updateCacheAndData(article, 'history')
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
