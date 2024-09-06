// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// const HomeScreen = () => {
//   const [marketData, setMarketData] = useState([]);
//   const [barData, setBarData] = useState({});
//   const [stockSymbols, setStockSymbols] = useState(['CING', 'BHACW', 'NTRBW', 'ASTSW', 'ZCARW', 'LLAP.WS', 'TSBX', 'SVREW', 'SING', 'LLAP']); // Example symbols

//   useEffect(() => {
//     fetchMarketData();
//   }, []);

//   const fetchMarketData = async () => {
//     try {
//       const symbols = stockSymbols.join(',');
//       const endDate = new Date().toISOString().split('T')[0]; // Today's date
//       const startDate = new Date();
//       startDate.setMonth(startDate.getMonth() - 1); // One month ago
//       const formattedStartDate = startDate.toISOString().split('T')[0];

//       console.log('Fetching bar data for symbols:', symbols); 

//       const response = await fetch(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=1Day&feed=iex`, {
//         headers: {
//           'APCA-API-KEY-ID': 'PKH9EBVMYSPWD2P7CN1F',
//           'APCA-API-SECRET-KEY': 'Rj6GHHhlEauKnnsyk6QN8JNczpZacRZbwdnnZ4a5',
//         },
//       });

//       const data = await response.json();

//       console.log('Bar data:', data);
//       setBarData(data.bars);
//     } catch (error) {
//       console.error('Error fetching market data:', error);
//     }
//   };

//   const renderStockCards = () => {
//     return (
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsWrapper}>
//         {stockSymbols.map(symbol => (
//           <View key={symbol} style={styles.card}>
//             <Text style={styles.cardSymbol}>{symbol}</Text>
//             {barData[symbol] && barData[symbol].length > 0 ? (
//               <>
//                 <LineChart
//                   data={{
//                     labels: [], // Removed labels for a cleaner look
//                     datasets: [
//                       {
//                         data: barData[symbol].map(bar => bar.c), // Close prices
//                       },
//                     ],
//                   }}
//                   width={screenWidth * 0.8}
//                   height={160}
//                   withDots={false} // Remove dots on the line
//                   withInnerLines={false} // Remove inner grid lines
//                   withOuterLines={false} // Remove outer grid lines
//                   withVerticalLabels={false} // Remove vertical labels
//                   withHorizontalLabels={false} // Remove horizontal labels
//                   chartConfig={{
//                     backgroundColor: '#000000',
//                     backgroundGradientFrom: '#000000',
//                     backgroundGradientTo: '#000000',
//                     decimalPlaces: 2,
//                     color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green line
//                     labelColor: () => `rgba(255, 255, 255, 0)`, // Transparent labels (not visible)
//                     fillShadowGradient: '#000000', // Black gradient (same as background)
//                     fillShadowGradientOpacity: 0,
//                     style: {
//                       borderRadius: 8,
//                     },
//                     propsForBackgroundLines: {
//                       strokeWidth: 0,
//                     },
//                   }}
//                   bezier
//                   style={styles.lineChart}
//                 />
//               </>
//             ) : (
//               <Text style={{ color: 'white' }}>No data available</Text>
//             )}
//           </View>
//         ))}
//       </ScrollView>
//     );
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//       <Text style={styles.header}>Stock Prices Over the Past Month</Text>
//       {renderStockCards()}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#212529',
//     padding: 20,
//   },
//   contentContainer: {
//     flexGrow: 1,
//     backgroundColor: '#212529',
//   },
//   cardsWrapper: {
//     flexDirection: 'row',
//   },
//   card: {
//     backgroundColor: '#333333',
//     borderRadius: 8,
//     padding: 10,
//     marginRight: 15,
//     width: screenWidth * 0.8,
//     height: 250,
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//   },
//   cardSymbol: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 10,
//   },
//   lineChart: {
//     marginTop: 20,
//     borderRadius: 8,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     marginBottom: 20,
//   },
// });

// export default HomeScreen;











// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, Animated, Easing, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';

// const HomeScreen = () => {
//   const [marketData, setMarketData] = useState({ gainers: [], losers: [] });
//   const [webSocket, setWebSocket] = useState(null);
//   const [barData, setBarData] = useState({});

//   // Fetch top 5 movers
//   useEffect(() => {
//     const fetchTopMoversAndBarData = async () => {
//       const options = {
//         method: 'GET',
//         headers: {
//           accept: 'application/json',
//           'APCA-API-KEY-ID': 'PKH9EBVMYSPWD2P7CN1F',
//           'APCA-API-SECRET-KEY': 'Rj6GHHhlEauKnnsyk6QN8JNczpZacRZbwdnnZ4a5'
//         }
//       };
  
//       try {
//         const response = await fetch('https://data.alpaca.markets/v1beta1/screener/stocks/movers?top=5', options);
//         const data = await response.json();
//         console.log('API Data: ', data);
  
//         const symbols = data.gainers.concat(data.losers).map(stock => stock.symbol).join(',');
//         const endDate = new Date().toISOString().split('T')[0]; // Today's date
//         const startDate = new Date();
//         startDate.setMonth(startDate.getMonth() - 1); // One month ago
//         const formattedStartDate = startDate.toISOString().split('T')[0];
  
//         const barsResponse = await fetch(https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=1Day&feed=iex, options);
//         const barsData = await barsResponse.json();
//         console.log('Bars Data: ', barsData)
  
//         const barDataMap = {};
//         for (const symbol in barsData.bars) {
//           barDataMap[symbol] = barsData.bars[symbol].map(bar => bar.c); // Only closing prices
//         }
  
//         setMarketData({
//           gainers: data.gainers || [],
//           losers: data.losers || []
//         });
//         setBarData(barDataMap);
//       } catch (error) {
//         console.error('Error fetching market data:', error);
//       }
//     };
  
//     fetchTopMoversAndBarData();
//   }, []);

//   const updateMarketData = (data) => {
//     setMarketData(prevMarketData => ({
//       ...prevMarketData, // Spread existing data
//       gainers: prevMarketData.gainers.map(stock => (
//         data.S === stock.symbol ? { ...stock, price: data.p } : stock
//       )),
//       losers: prevMarketData.losers.map(stock => (
//         data.S === stock.symbol ? { ...stock, price: data.p } : stock
//       )),
//     }));
//   };

//   // Create WebSocket connection
//   useEffect(() => {
//     if (marketData.gainers.length === 0 && marketData.losers.length === 0) {
//       return; // No data to subscribe to
//     }

//     const topMovers = [...marketData.gainers, ...marketData.losers].map(stock => stock.symbol);

//     const ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');

//     console.log('bout to open connection');
//     console.log('hey whats going on, wheres the connection');

//     ws.onopen = () => {
//       console.log('WebSocket connection opened.');
//       ws.send(JSON.stringify({
//         action: 'auth',
//         key: 'PKH9EBVMYSPWD2P7CN1F',
//         secret: 'Rj6GHHhlEauKnnsyk6QN8JNczpZacRZbwdnnZ4a5'
//       }));
//       ws.send(JSON.stringify({
//         action: 'subscribe',
//         trades: topMovers,
//       }));
//     };

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       // If data is an array, loop through it
//       if (Array.isArray(data)) {
//         data.forEach(item => {
//           console.log('WebSocket data:', item);
//           if (item && item.S) {
//             console.log('Updating market data for symbol:', item.S, 'with price:', item.p);
//             updateMarketData(item);
//           }
//         });
//       } else {
//         console.log('Unexpected WebSocket data format:', data);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket error:', error.message);
//     };

//     ws.onclose = (event) => {
//       console.log('WebSocket connection closed:', event.code, event.reason);
//     };

//     setWebSocket(ws);

//     // Cleanup function to close WebSocket connection when component unmounts
//     return () => {
//       if (ws) ws.close();
//     };
//   }, []); // Trigger WebSocket connection when gainers or losers change

//   useEffect(() => {
//     // This effect will run after every render
//     //console.log('marketData changed:', marketData); // Log to verify
//   }, [marketData]);

//   const renderStockCards = (stocks) => {
//     const allStocks = [...stocks, ...stocks];
//     return (
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsWrapper}>
//         {stocks.map(stock => (
//           <View key={stock.symbol} style={styles.card}>
//             <Text style={[styles.cardSymbol, { color: stock.isGainer ? 'white' : 'white' }]}>
//               {stock.symbol}
//             </Text>
//             {barData[stock.symbol] && (
//               <View style={styles.chartWrapper}>
//                 <LineChart
//                   data={{
//                     labels: [], // No labels
//                     datasets: [
//                       {
//                         data: barData[stock.symbol],
//                         color: () => stock.isGainer ? 'green' : 'red', // Green for gainers, red for losers
//                       },
//                     ],
//                   }}
//                   width={140} // Width of the chart
//                   height={80} // Height of the chart
//                   chartConfig={{
//                     backgroundColor: '#000000',
//                     backgroundGradientFrom: '#000000',
//                     backgroundGradientTo: '#000000',
//                     color: () => 'white', // White for axis text
//                     strokeWidth: 2,
//                     propsForDots: {
//                       r: '0', // Hide dots
//                     },
//                     propsForBackgroundLines: {
//                       strokeWidth: 0, // Hide grid lines
//                     },
//                   }}
//                   withHorizontalLabels={false} // No horizontal labels
//                   withVerticalLabels={false} // No vertical labels
//                   withInnerLines={false} // No inner grid lines
//                   withOuterLines={false} // No outer grid lines
//                   withShadow={false} // No shadow under the line
//                   bezier
//                   style={styles.chart}
//                 />
//               </View>
//             )}
//             <Text style={[styles.cardPrice, { color: stock.isGainer ? 'green' : 'red' }]}>
//               ${stock.price ? stock.price.toFixed(2) : 'N/A'}
//             </Text>
//             <Text style={[styles.cardPercent, { color: stock.isGainer ? 'green' : 'red' }]}>
//               {stock.isGainer ? +${stock.percent_change?.toFixed(2)} : ${stock.percent_change?.toFixed(2)}}%
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//     );
//   };

//   const combinedStocks = [
//     ...marketData.gainers.map(stock => ({ ...stock, isGainer: true })),
//     ...marketData.losers.map(stock => ({ ...stock, isGainer: false }))
//   ];

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//       <Text style={styles.header}>Top Movers</Text>
//       <Text style={styles.subHeader}>Stocks making the biggest moves today.</Text>
//       {renderStockCards(combinedStocks)}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: '#000000',
//     padding: 20,
//   },
//   contentContainer: {
//     flexGrow: 1,
//     backgroundColor: '#000000',
//   },
//   cardsWrapper: {
//     flexDirection: 'row',
//     paddingVertical: 10,
//   },
//   card: {
//     backgroundColor: '#000000',
//     borderRadius: 8,
//     padding: 10,
//     marginRight: 15,
//     width: 150,
//     height: 180, // Increased height to fit the chart and text
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//   },
//   chartWrapper: {
//     width: '50%',
//     height: 80, // Adjusted height for the chart
//     marginBottom: 10,
//   },
//   chart: {
//     marginVertical: 2,
//     borderRadius: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardSymbol: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     marginLeft: 10,
//     marginTop: 5
//   },
//   cardPrice: {
//     fontSize: 20,
//     marginBottom: 5,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   cardPercent: {
//     fontSize: 11,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   header: {
//     fontSize: 24,
//     color: 'white',
//     fontWeight: 'bold',
//     marginBottom: 10,
//     marginTop: 40
//   },
//   subHeader: {
//     fontSize: 16,
//     color: 'white',
//     marginBottom: 20,
//   },
// });

// export default HomeScreen;