# 📰 EpiFlipboard

Clone moderne de Flipboard - Application web de lecture d'articles d'actualité en format magazine avec animations de flip 3D.

![EpiFlipboard](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-06B6D4?style=flat&logo=tailwindcss)

## ✨ Features

- 🎴 **Cartes Flip 3D** - Animation immersive pour explorer les articles
- 📱 **Design Responsive** - Optimisé mobile-first
- 💾 **Système de Favoris** - Sauvegarde locale avec LocalStorage
- 🎯 **Filtrage par Catégories** - Business, Tech, Sports, Science, etc.
- 🔄 **API en temps réel** - Articles actualisés via News API
- ⚡ **Performance** - Build optimisé avec Vite

## 🚀 Quick Start

### Prérequis

- Node.js 20+ 
- npm ou yarn
- Clé API News API (gratuite)

### Installation

```bash
# Cloner le repository
git clone https://github.com/plv92/EpiFliboard.git
cd EpiFliboard

# Installer les dépendances
npm install

# Configurer la clé API
# 1. Aller sur https://newsapi.org/register
# 2. Créer un compte gratuit
# 3. Copier votre clé API
# 4. Créer le fichier .env et ajouter:
echo "VITE_NEWS_API_KEY=votre_clé_api_ici" > .env

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📦 Structure du Projet

```
epiflipboard/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ArticleGrid.jsx  # Grille d'articles
│   │   ├── FlippableCard.jsx # Carte avec animation flip
│   │   ├── CategoryFilter.jsx # Filtres de catégories
│   │   ├── Header.jsx       # En-tête de navigation
│   │   └── LoadingSpinner.jsx # Indicateur de chargement
│   ├── pages/               # Pages de l'application
│   │   ├── Home.jsx         # Page d'accueil
│   │   └── Favorites.jsx    # Page des favoris
│   ├── services/            # Services API
│   │   └── newsApi.js       # Intégration News API
│   ├── hooks/               # Custom hooks
│   │   └── useFavorites.js  # Gestion des favoris
│   ├── App.jsx              # Composant racine
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles globaux
├── .env                     # Variables d'environnement
├── .env.example             # Template pour .env
└── package.json
```

## 🛠️ Technologies

- **React 19** - Framework UI
- **Vite 7** - Build tool ultra-rapide
- **Tailwind CSS 4** - Framework CSS utility-first
- **React Router** - Navigation SPA
- **Axios** - Client HTTP
- **Lucide React** - Icônes modernes
- **News API** - Source d'articles d'actualité

## 🎨 Fonctionnalités Détaillées

### Animation Flip 3D

Les cartes utilisent des transformations CSS 3D pour créer un effet de flip réaliste :
- Face avant : Image + titre
- Face arrière : Description + actions
- Transition fluide de 700ms

### Catégories Disponibles

- 🌍 Toutes les actualités
- 💼 Business
- 🎬 Entertainment
- 🏥 Santé
- 🔬 Science
- ⚽ Sports
- 💻 Technologie

### Système de Favoris

- Sauvegarde locale avec LocalStorage
- Persistance entre les sessions
- Toggle rapide avec animation
- Page dédiée aux favoris

## 📝 Scripts Disponibles

```bash
npm run dev      # Lancer le serveur de développement
npm run build    # Build de production
npm run preview  # Preview du build de production
npm run lint     # Linter le code
```

## 🌐 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Netlify

```bash
# Build
npm run build

# Déployer le dossier dist/
```

⚠️ **Important** : N'oubliez pas d'ajouter votre `VITE_NEWS_API_KEY` dans les variables d'environnement de votre plateforme de déploiement !

## 🔑 Obtenir une Clé API

1. Aller sur [newsapi.org](https://newsapi.org/register)
2. Créer un compte gratuit
3. Copier votre clé API
4. Ajouter dans `.env` : `VITE_NEWS_API_KEY=votre_clé`

⚠️ Le plan gratuit limite à 100 requêtes/jour

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changes (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

**plv92**

- GitHub: [@plv92](https://github.com/plv92)

## 🙏 Remerciements

- [News API](https://newsapi.org/) pour l'API d'actualités
- [Lucide](https://lucide.dev/) pour les icônes
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS

---

⭐ N'hésitez pas à mettre une étoile si ce projet vous plaît !

