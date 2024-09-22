import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, PanResponder, Animated } from 'react-native';
import axios from 'axios';
import { subscribeToStockUpdates, unsubscribeFromStockUpdates, useStockWebSocket } from '../websocket/WebSocketManager';


const LastPrice = ({ stockSymbol }) => {
  const [initialPrice, setInitialPrice] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);

  const fetchLatestTradeData = async () => {
    try {
      const traderesponse = await fetch(`http://192.168.1.118:3000/api/latest-trade?symbols=${stockSymbol}`);
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
    <View style={styles.container}>
      <Text style={styles.latestTrade}>${formattedPrice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  symbol: {
    fontSize: 35,
    marginVertical: 8,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 80,
    marginBottom: 2,
    marginLeft: 50
  },
  latestTrade: {
    fontSize: 40,
    marginVertical: 2,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 1,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000', 
  },
});

export default LastPrice;