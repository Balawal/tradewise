import { useEffect, useState } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env';

export const useFetchNewsArticles = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsArticles = async () => {
      try {
        const response = await axios.get(`${REACT_APP_BASE_URL}/news-articles`);
        const filteredArticles = response.data.news.filter(
          article => article.images.length > 0 && article.symbols.length > 0
        );
        setNewsArticles(filteredArticles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsArticles();
  }, []);

  return { newsArticles, loading, error };
};