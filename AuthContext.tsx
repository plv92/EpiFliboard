
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CategoryType } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  bookmarks: string[];
  likes: string[];
  history: string[];
  toggleBookmark: (articleId: string) => void;
  toggleLike: (articleId: string) => void;
  addToHistory: (articleId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('epiflipboard_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedBookmarks = localStorage.getItem('epiflipboard_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    const savedLikes = localStorage.getItem('epiflipboard_likes');
    if (savedLikes) setLikes(JSON.parse(savedLikes));

    const savedHistory = localStorage.getItem('epiflipboard_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const login = (email: string, name: string) => {
    // Utilisation d'un avatar plus élégant par défaut
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`
    };
    setUser(newUser);
    localStorage.setItem('epiflipboard_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('epiflipboard_user');
  };

  const toggleBookmark = (id: string) => {
    const newBookmarks = bookmarks.includes(id) 
      ? bookmarks.filter(b => b !== id) 
      : [id, ...bookmarks];
    setBookmarks(newBookmarks);
    localStorage.setItem('epiflipboard_bookmarks', JSON.stringify(newBookmarks));
  };

  const toggleLike = (id: string) => {
    const newLikes = likes.includes(id) 
      ? likes.filter(l => l !== id) 
      : [id, ...likes];
    setLikes(newLikes);
    localStorage.setItem('epiflipboard_likes', JSON.stringify(newLikes));
  };

  const addToHistory = (id: string) => {
    const newHistory = [id, ...history.filter(h => h !== id)].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('epiflipboard_history', JSON.stringify(newHistory));
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, isAuthenticated: !!user,
      bookmarks, likes, history,
      toggleBookmark, toggleLike, addToHistory
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
