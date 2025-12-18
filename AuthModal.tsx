
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, isLogin ? name || 'Utilisateur' : name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-display font-black text-slate-900 dark:text-slate-100">
            {isLogin ? 'Bon retour !' : 'Bienvenue'}
          </h2>
          <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Nom complet</label>
              <input 
                type="text" 
                required 
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-border-dark rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-card-dark focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Jean Dupont"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Email</label>
            <input 
              type="email" 
              required 
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-border-dark rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-card-dark focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-2">Mot de passe</label>
            <input 
              type="password" 
              required 
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-border-dark rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-card-dark focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 dark:bg-slate-100 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white dark:text-slate-900 transition-all shadow-xl shadow-slate-200 dark:shadow-none mt-4 active:scale-95"
          >
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400 font-medium">
            {isLogin ? "Nouveau ici ?" : "Déjà membre ?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-primary font-bold hover:underline"
            >
              {isLogin ? "Créer un compte" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
