import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Button, Animated, Easing } from 'react-native';
import { connectWebSocket, disconnectWebSocket, restartWebSocket } from './marketDataService';

const MarketDataStrip = () => {
  const [stockData, setStockData] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const handleWebSocketMessage = (data) => {
      console.log("Received WebSocket message:", data);
      if (data[0]?.S) {
        setStockData((prevData) => {
          const newData = prevData.filter((item) => item.S !== data[0].S);
          newData.push(data[0]);
          return newData;
        });
      }
    };

    connectWebSocket(handleWebSocketMessage);

    return () => {
      disconnectWebSocket();
    };
  }, []);

  useEffect(() => {
    const scrollWidth = stockData.length * 150;
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -scrollWidth,
        duration: 10000, // Faster speed
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [stockData]);

  const handleDisconnect = () => {
    disconnectWebSocket();
    setIsConnected(false);
  };

  const handleReconnect = () => {
    restartWebSocket((data) => {
      console.log("Received WebSocket message:", data);
      if (data[0]?.S) {
        setStockData((prevData) => {
          const newData = prevData.filter((item) => item.S !== data[0].S);
          newData.push(data[0]);
          return newData;
        });
      }
    });
    setIsConnected(true);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.scrollContainer, { transform: [{ translateX: scrollX }] }]}>
        {stockData.map((stock, index) => (
          <View key={index} style={styles.stockContainer}>
            <Text style={styles.stockSymbol}>{stock.S}</Text>
            <Text style={styles.stockPrice}>{stock.ap ? `Price: $${stock.ap}` : `Price: $${stock.bp}`}</Text>
          </View>
        ))}
      </Animated.View>
      <View style={styles.buttonContainer}>
        {isConnected ? (
          <Button title="Disconnect" onPress={handleDisconnect} />
        ) : (
          <Button title="Reconnect" onPress={handleReconnect} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockContainer: {
    width: 150,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockPrice: {
    fontSize: 14,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    transform: [{ translateX: -75 }],
    width: 150,
  },
});

export default MarketDataStrip;