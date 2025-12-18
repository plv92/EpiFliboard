import React, { useState, useEffect } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import ArticleGrid from '../components/ArticleGrid';
import { getTopHeadlines } from '../services/newsApi';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('general');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getTopHeadlines(selectedCategory);
        setArticles(data);
      } catch (err) {
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <ArticleGrid 
        articles={articles}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Home;
