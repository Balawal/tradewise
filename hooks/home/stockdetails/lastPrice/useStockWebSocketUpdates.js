import { useEffect, useState } from 'react';
import { subscribeToStockUpdates, unsubscribeFromStockUpdates } from '../../../../components/websocket/WebSocketManager';

const useStockWebSocketUpdates = (stockSymbol, initialPrice) => {
  const [currentPrice, setCurrentPrice] = useState(initialPrice);

  useEffect(() => {
    const onWebSocketMessage = (tradeData) => {
      if (tradeData.S === stockSymbol) {
        console.log(`Updating market data for stock symbol: ${stockSymbol} with price: ${tradeData.p}`);
        setCurrentPrice(tradeData.p);
      }
    };

    subscribeToStockUpdates(stockSymbol, onWebSocketMessage);

    return () => {
      unsubscribeFromStockUpdates(stockSymbol);
    };
  }, [stockSymbol, initialPrice]);

  return currentPrice;
};

export default useStockWebSocketUpdates;