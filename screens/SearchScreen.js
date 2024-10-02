import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../components/calculator/datePicker';


const CalculatorScreen = () => {
    const [investmentAmount, setInvestmentAmount] = useState('');

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-ios" size="25" color='white'  />
                </TouchableOpacity>
            </View>
                <View style={styles.symbolContainer}>
                    <Text style={styles.stock}>Stock: </Text>
                    <Text style={styles.symbol}>AAPL</Text>
                    <Text style={styles.name}> - Apple Inc</Text> 
                </View>
            <Text style={styles.invest}>Invest Amount (USD)</Text>
            <TextInput
                style={styles.input}
                value={investmentAmount}
                onChangeText={setInvestmentAmount}
                placeholder="$ - Enter amount"
                placeholderTextColor="#888"
                keyboardType="numeric" // Only allows numeric input
            />
            <Text style={styles.invest}>Select a Date</Text>
            <DatePicker />
        </View>
        </TouchableWithoutFeedback>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
      },
      header:{
        flexDirection: 'row',    
        justifyContent: 'space-between', 
        paddingHorizontal: 5,    
        paddingTop: 35, 
      },
      symbol: {
        fontSize: 20,
        color: 'white',
      },
      name: {
        fontSize: 20,
        color: 'white',
      },
      stock: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold'
      },
      invest: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10
      },
      goBack: {
        paddingTop: 35
      },
      symbolContainer: {
        flexDirection: 'row',  // Align symbol and name horizontally
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10
      },
      input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
    },
});

export default CalculatorScreen;















// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { subscribeToStockUpdates, unsubscribeFromStockUpdates, useStockWebSocket } from '../components/websocket/WebSocketManager';

// const StockData = () => {
//   const [initialPrice, setInitialPrice] = useState(null);
//   const [currentPrice, setCurrentPrice] = useState(null);
//   const symbol = 'AAPL';

//   const fetchLatestTradeData = async () => {
//     try {
//       const traderesponse = await fetch(`http://192.168.1.118:3000/api/latest-trade?symbols=${symbol}`);
//       const tradeData = await traderesponse.json();
//       console.log('Initial API data:', tradeData);
//       setInitialPrice(tradeData.trade.p);
//       setCurrentPrice(tradeData.trade.p);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchLatestTradeData();
//     subscribeToStockUpdates(symbol);
    
//     return () => {
//       unsubscribeFromStockUpdates(symbol);
//     };
//   }, [symbol]);

//   const onWebSocketMessage = (tradeData) => {
//     if (tradeData.S === symbol) {
//       //console.log('WebSocket data:', tradeData);
//       setCurrentPrice(tradeData.p);
//     }
//   };

//   const { isConnectedLatestTradeStocks } = useStockWebSocket(onWebSocketMessage);

//   if (initialPrice === null) {
//     return <View style={styles.centered}><Text>Loading the data...</Text></View>;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.symbol}>{symbol}</Text>
//       <Text style={styles.latestTrade}>{currentPrice}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   symbol: {
//     fontSize: 35,
//     marginVertical: 8,
//     color: 'white',
//     fontWeight: 'bold',
//     marginTop: 80,
//     marginBottom: 2,
//     marginLeft: 50
//   },
//   latestTrade: {
//     fontSize: 35,
//     marginVertical: 8,
//     color: 'white',
//     fontWeight: 'bold',
//     marginTop: 15,
//     marginBottom: 2,
//     marginLeft: 50
//   },
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     backgroundColor: '#000',
//   },
// });

// export default StockData;
