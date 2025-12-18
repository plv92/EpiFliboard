
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
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = isLogin 
        ? await login(email, password)
        : await signup(email, name, password);

      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-10">
          <div className="space-y-1">
            <h2 className="text-3xl font-display font-black text-slate-900 dark:text-slate-100 leading-tight">
              {isLogin ? 'Bon retour !' : 'Créer un compte'}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              {isLogin ? 'Accédez à votre collection' : 'Rejoignez la révolution news'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl text-accent text-xs font-bold text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Nom complet</label>
              <input 
                type="text" 
                required 
                disabled={isLoading}
                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-border-dark rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-card-dark focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Jean Dupont"
              />
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Adresse Email</label>
            <input 
              type="email" 
              required 
              disabled={isLoading}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-border-dark rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-card-dark focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-2">Mot de passe</label>
            <input 
              type="password" 
              required 
              disabled={isLoading}
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-border-dark rounded-2xl px-6 py-4 focus:bg-white dark:focus:bg-card-dark focus:ring-4 focus:ring-primary/5 outline-none transition-all dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 dark:bg-slate-100 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white dark:text-slate-900 transition-all shadow-xl shadow-slate-200 dark:shadow-none mt-4 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            {isLogin ? 'Se connecter' : "Créer mon compte"}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-slate-50 dark:border-border-dark pt-8">
          <p className="text-sm text-slate-400 font-medium">
            {isLogin ? "Nouveau sur EpiFlipboard ?" : "Vous avez déjà un compte ?"}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="ml-2 text-primary font-black uppercase tracking-widest text-[10px] hover:underline underline-offset-4"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
