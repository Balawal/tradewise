import axios from 'axios';
import { REACT_APP_BASE_URL } from '@env';

export const useFetchChartCrypto = async (timeframe, cryptoID, onColorChange) => {
  const endpointMap = {
    '1D': '/crypto-one-day-bars',
    '1W': '/crypto-one-week-bars',
    '1M': '/crypto-one-month-bars',
    '3M': '/crypto-three-month-bars',
    '6M': '/crypto-six-month-bars',
    '1Y': '/crypto-one-year-bars',
  };

  try {
    const response = await axios.get(`${REACT_APP_BASE_URL}${endpointMap[timeframe]}`, {
      params: { coinName: cryptoID },
    });

    const data = response.data.prices;
    const change = parseFloat(response.data.percentChange);
    const priceDiff = parseFloat(response.data.priceDifference);
    const color = change >= 0 ? 'green' : 'red';

    if (onColorChange) {
      onColorChange(color);
    }

    return {
      chartData: { datasets: [{ data }] },
      percentChange: change,
      priceDifference: priceDiff,
    };
  } catch (error) {
    console.error(`Error fetching ${timeframe} bars data:`, error);
    return null;
  }
};