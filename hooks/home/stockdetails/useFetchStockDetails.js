import { useEffect, useState } from 'react';
import { REACT_APP_BASE_URL } from '@env';

const useFetchStockDetails = (stockSymbol) => {
  const [stockData, setStockData] = useState(null);
  const [price, setPrice] = useState(null);
  const [movingAverages, setMovingAverages] = useState(null);
  const [volume, setVolume] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [sixMBarsData, setSixMBarData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`${REACT_APP_BASE_URL}/stock-fundamentals?symbol=${stockSymbol}`);
        const data = await response.json();
        setStockData(data);

        const traderesponse = await fetch(`${REACT_APP_BASE_URL}/latest-trade?symbols=${stockSymbol}`);
        const tradeData = await traderesponse.json();
        setPrice(tradeData);

        const maResponse = await fetch(`${REACT_APP_BASE_URL}/stock-moving-averages?symbol=${stockSymbol}`);
        const maData = await maResponse.json();
        setMovingAverages(maData);

        const volResponse = await fetch(`${REACT_APP_BASE_URL}/stock-volume?symbol=${stockSymbol}`);
        const volData = await volResponse.json();
        setVolume(volData);

        const earningsResponse = await fetch(`${REACT_APP_BASE_URL}/earnings-calendar?symbol=${stockSymbol}`);
        const earningsData = await earningsResponse.json();
        setEarnings(earningsData);

        const sentimentResponse = await fetch(`${REACT_APP_BASE_URL}/stock-sentiment?symbol=${stockSymbol}`);
        const sentimentData = await sentimentResponse.json();
        setSentiment(sentimentData);

        const sixMResponse = await fetch(`${REACT_APP_BASE_URL}/six-month-bars?symbols=${stockSymbol}`);
        const sixMBarData = await sixMResponse.json();
        
        const sixMBarDataMap = {};
        for (const symbol in sixMBarsData.bars) {
          sixMBarDataMap[symbol] = sixMBarsData.bars[symbol].map(bar => bar.c); // Only closing price
        }
        setSixMBarData(sixMBarDataMap);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [stockSymbol]);

  return { stockData, price, movingAverages, volume, earnings, sentiment, sixMBarsData, loading };
};

export default useFetchStockDetails;