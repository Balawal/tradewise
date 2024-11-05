import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env';

export const useFetchChart = async (timeframe, stockSymbol, onColorChange) => {
    const endpointMap = {
      '1D': '/latest-bars',
      '1W': '/one-week-bars',
      '1M': '/one-month-bars',
      '6M': '/six-month-bars',
      '1Y': '/one-year-bars',
      '5Y': '/five-years-bars',
    };
  
    try {
      const response = await axios.get(`${REACT_APP_BASE_URL}${endpointMap[timeframe]}`, {
        params: { symbols: stockSymbol },
      });
  
      const data = response.data.bars;
      const change = parseFloat(response.data.percentChange);
      const priceDiff = parseFloat(response.data.priceDifference);
      const color = change >= 0 ? 'green' : 'red';
  
      if (onColorChange) {
        onColorChange(color);
      }

      const closingPrices = data.map(bar => bar.c);
  
      return {
        chartData: { datasets: [{ data:closingPrices }] },
        percentChange: change,
        priceDifference: priceDiff,
      };
    } catch (error) {
      console.error(`Error fetching ${timeframe} bars data:`, error);
      return null;
    }
  };