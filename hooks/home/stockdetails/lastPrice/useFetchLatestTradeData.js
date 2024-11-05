import { useState, useEffect } from 'react';
import { REACT_APP_BASE_URL } from '@env';

const useFetchLatestTradeData = (stockSymbol) => {
  const [initialPrice, setInitialPrice] = useState(null);
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const fetchLatestTradeData = async () => {
      try {
        const response = await fetch(`${REACT_APP_BASE_URL}/stock-fundamentals?symbol=${stockSymbol}`);
        const data = await response.json();
        setStockData(data);

        const tradeResponse = await fetch(`${REACT_APP_BASE_URL}/latest-trade?symbols=${stockSymbol}`);
        const tradeData = await tradeResponse.json();
        console.log('Initial API data:', tradeData);

        setInitialPrice(tradeData.trade.p);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLatestTradeData();
  }, [stockSymbol]);

  return { initialPrice, stockData };
};

export default useFetchLatestTradeData;