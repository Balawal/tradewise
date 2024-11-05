import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { subscribeToStockUpdates, unsubscribeFromStockUpdates, useStockWebSocket } from '../../websocket/WebSocketManager';
import { lastPriceStyles as styles } from '../../../styles/homeStyles';
import { REACT_APP_BASE_URL } from '@env';

const LastPrice = ({ stockSymbol, containerStyle, textStyle }) => {
  const [initialPrice, setInitialPrice] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [stockData, setStockData] = useState(null);

  const fetchLatestTradeData = async () => {
    try {
      const response = await fetch(`${REACT_APP_BASE_URL}/stock-fundamentals?symbol=${stockSymbol}`);
      const data = await response.json();
      setStockData(data);

      const traderesponse = await fetch(`${REACT_APP_BASE_URL}/latest-trade?symbols=${stockSymbol}`);
      const tradeData = await traderesponse.json();
      console.log('Initial API data:', tradeData);
      
      setInitialPrice(tradeData.trade.p);
      setCurrentPrice(tradeData.trade.p);
    } catch (error) {
      console.error(`Error fetching data:`, error);
    }
  };

  useEffect(() => {
    fetchLatestTradeData();
    subscribeToStockUpdates(stockSymbol);
    return () => {
      unsubscribeFromStockUpdates(stockSymbol);
    };
  }, [stockSymbol]);

  const onWebSocketMessage = (tradeData) => {
    if (tradeData.S === stockSymbol) {
      setCurrentPrice(tradeData.p);
    }
  };

  const { isConnectedLatestTradeStocks } = useStockWebSocket(onWebSocketMessage);

  if (!initialPrice) {
    return <View style={styles.centered}><Text>Loading the data...</Text></View>;
  }

  const formattedPrice = currentPrice ? currentPrice.toFixed(2) : '';

  return (
    <View style={[styles, containerStyle]}>
      <MotiView
        from={{ translateY: -10, opacity: 0 }} 
        animate={{ translateY: 0, opacity: 1 }} 
        transition={{ type: 'timing', duration: 300 }} 
        key={formattedPrice} 
      >
      <Text style={[styles, textStyle]}>${formattedPrice}</Text>
      </MotiView>
    </View>
  );
};

export default LastPrice;