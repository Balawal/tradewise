import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, PanResponder, Animated } from 'react-native';
import axios from 'axios';
import { MotiView } from 'moti';

import { subscribeToStockUpdates, unsubscribeFromStockUpdates, useStockWebSocket } from '../websocket/WebSocketManager';
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../../config/firebase'; 


const LastPrice = ({ stockSymbol, containerStyle, textStyle }) => {
  const [initialPrice, setInitialPrice] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [stockData, setStockData] = useState(null);

  const fetchLatestTradeData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/stock-fundamentals?symbol=${stockSymbol}`);
      const data = await response.json();
      setStockData(data);

      const traderesponse = await fetch(`${process.env.REACT_APP_BASE_URL}/latest-trade?symbols=${stockSymbol}`);
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
      //updatePriceInFirestore(stockSymbol, tradeData.p);
    }
  };

  const updatePriceInFirestore = async (symbol, price) => {
    const docRef = doc(db, "watchList", symbol);
    try {
      await setDoc(docRef, { 
        symbol, 
        price,
        name: stockData.Name,
        type: "stock",
      }, { merge: true }); // Merge to prevent overwriting other fields
      console.log(`Updating price in Firestore for ${symbol}: $${price}`);
    } catch (error) {
      console.error('Error updating Firestore:', error);
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
        from={{ translateY: -10, opacity: 0 }} // Starting position and opacity
        animate={{ translateY: 0, opacity: 1 }} // End position and opacity
        transition={{ type: 'timing', duration: 300 }} // Animation duration
        key={formattedPrice} // Ensure the component re-renders on price change
      >
      <Text style={[styles, textStyle]}>${formattedPrice}</Text>
      </MotiView>
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
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000', 
  },
});

export default LastPrice;