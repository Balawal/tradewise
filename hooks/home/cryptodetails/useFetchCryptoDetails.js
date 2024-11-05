import { useEffect, useState } from 'react';
import { REACT_APP_BASE_URL } from '@env';

const useFetchCryptoDetails = (cryptoID, cryptoSymbol) => {
  const [cryptoData, setCryptoData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(`${REACT_APP_BASE_URL}/crypto-coin-data?coinName=${cryptoID}`);
        const data = await response.json();
        setCryptoData(data);

        const newsResponse = await fetch(`${REACT_APP_BASE_URL}/news-crypto?symbols=${cryptoSymbol}`);
        const newsData = await newsResponse.json();
        setNewsData(newsData);

      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, [cryptoID, cryptoSymbol]);

  return { cryptoData, newsData, loading };
};

export default useFetchCryptoDetails;