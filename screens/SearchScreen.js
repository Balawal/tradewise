import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { subscribeToStockUpdates, unsubscribeFromStockUpdates, useStockWebSocket } from '../components/websocket/WebSocketManager';

const StockData = () => {
  const [initialPrice, setInitialPrice] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const symbol = 'AAPL';

  const fetchLatestTradeData = async () => {
    try {
      const traderesponse = await fetch(`http://192.168.1.118:3000/api/latest-trade?symbols=${symbol}`);
      const tradeData = await traderesponse.json();
      console.log('Initial API data:', tradeData);
      setInitialPrice(tradeData.trade.p);
      setCurrentPrice(tradeData.trade.p);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchLatestTradeData();
    subscribeToStockUpdates(symbol);
    
    return () => {
      unsubscribeFromStockUpdates(symbol);
    };
  }, [symbol]);

  const onWebSocketMessage = (tradeData) => {
    if (tradeData.S === symbol) {
      //console.log('WebSocket data:', tradeData);
      setCurrentPrice(tradeData.p);
    }
  };

  const { isConnectedLatestTradeStocks } = useStockWebSocket(onWebSocketMessage);

  if (initialPrice === null) {
    return <View style={styles.centered}><Text>Loading the data...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.latestTrade}>{currentPrice}</Text>
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
    fontSize: 35,
    marginVertical: 8,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 2,
    marginLeft: 50
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
});

export default StockData;


// export default function HomeScreen() {
//     const handleLogout = async() =>{
//         await signOut(auth);
//     }
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} className="flex-1 justify-center items-center">
//           <Text style={{ color: '#fff' }} className="text-lg">Settings Page</Text>
//           <TouchableOpacity onPress={handleLogout} className="p-1 bg-red-400 rounded-lg mt-4">
//               <Text className="text-white text-lg font-bold">Logout</Text>
//           </TouchableOpacity>
//       </SafeAreaView>
//   )
// }