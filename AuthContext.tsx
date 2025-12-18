
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserData } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (email: string, name: string, password: string) => Promise<{ success: boolean; message: string }>;
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

// Clés pour le localStorage
const STORAGE_KEYS = {
  CURRENT_USER: 'epiflipboard_current_user',
  USERS_DB: 'epiflipboard_users_database',
  USER_DATA_PREFIX: 'epiflipboard_userdata_'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>({ bookmarks: [], likes: [], history: [] });

  // Initialisation : charger l'utilisateur connecté
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.id);
    }
  }, []);

  // Charger les données spécifiques d'un utilisateur
  const loadUserData = (userId: string) => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA_PREFIX + userId);
    if (data) {
      setUserData(JSON.parse(data));
    } else {
      setUserData({ bookmarks: [], likes: [], history: [] });
    }
  };

  // Sauvegarder les données spécifiques d'un utilisateur
  const saveUserData = (userId: string, newData: UserData) => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA_PREFIX + userId, JSON.stringify(newData));
    setUserData(newData);
  };

  const getAllUsers = (): User[] => {
    const db = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    return db ? JSON.parse(db) : [];
  };

  const signup = async (email: string, name: string, password: string) => {
    // Simulation délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getAllUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: "Cet email est déjà utilisé." };
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      password, // Dans un vrai projet, on hacherait le mot de passe côté serveur
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    
    // Auto-login
    setUser(newUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    loadUserData(newUser.id);

    return { success: true, message: "Compte créé avec succès." };
  };

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const users = getAllUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(foundUser));
      loadUserData(foundUser.id);
      return { success: true, message: "Connexion réussie." };
    }

    return { success: false, message: "Email ou mot de passe incorrect." };
  };

  const logout = () => {
    setUser(null);
    setUserData({ bookmarks: [], likes: [], history: [] });
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const toggleBookmark = (articleId: string) => {
    if (!user) return;
    const newBookmarks = userData.bookmarks.includes(articleId) 
      ? userData.bookmarks.filter(b => b !== articleId) 
      : [articleId, ...userData.bookmarks];
    
    saveUserData(user.id, { ...userData, bookmarks: newBookmarks });
  };

  const toggleLike = (articleId: string) => {
    if (!user) return;
    const newLikes = userData.likes.includes(articleId) 
      ? userData.likes.filter(l => l !== articleId) 
      : [articleId, ...userData.likes];
    
    saveUserData(user.id, { ...userData, likes: newLikes });
  };

  const addToHistory = (articleId: string) => {
    if (!user) return;
    const newHistory = [articleId, ...userData.history.filter(h => h !== articleId)].slice(0, 50);
    saveUserData(user.id, { ...userData, history: newHistory });
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, signup, logout, isAuthenticated: !!user,
      bookmarks: userData.bookmarks, 
      likes: userData.likes, 
      history: userData.history,
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
