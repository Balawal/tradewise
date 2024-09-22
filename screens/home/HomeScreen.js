// import React, { useEffect, useState, useRef, useCallback} from 'react';
// import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, Easing, TouchableOpacity, Modal, TextInput, Keyboard} from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { subscribeToStockUpdates, unsubscribeFromStockUpdates, useStockWebSocket, useCryptoWebSocket, subscribeToCryptoUpdates, unsubscribeFromCryptoUpdates } from '../../components/websocket/WebSocketManager';
// import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { GestureHandlerRootView } from "react-native-gesture-handler";


// const HomeScreen = ({ navigation }) => {
//   const [marketData, setMarketData] = useState({ gainers: [], losers: [] });
//   const [marketDataCrypto, setMarketDataCrypto] = useState({ gainers: [], losers: [] });
//   const [barData, setBarData] = useState({});
//   const [barDataCrypto, setBarDataCrypto] = useState({});

  
//   const bottomSheetModalRef = useRef(null);
//   const snapPoints = ["83%"];
//   const [searchTerm, setSearchTerm] = useState('');
//   const searchInputRef = useRef(null);

//   const [searchResult, setSearchResult] = useState(null);
//   const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

//   const handlePresentModal = () => {
//     bottomSheetModalRef.current?.present();
//     setTimeout(() => {
//       searchInputRef.current?.focus(); // Focus the search bar after the modal appears
//     }, 100); // Adjust delay as needed to ensure proper rendering
//   };

//   const clearInput = () => {
//     setSearchTerm('');
//     setSearchResult('');
//   };

//   const handleSearchChange = (text) => {
//     setSearchTerm(text); // Update search term on input change
//     setIsSearchSubmitted(false);
//   };


//   const handleSearchSubmit = async () => {
//     if (searchTerm.trim() === '') return;
  
//     try {
//       const response = await fetch(`http://192.168.1.118:3000/api/search-query?keywords=${searchTerm}`); 
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       console.log(data);
  
//       // Navigate to the StockDetailScreen with the stock symbol as a parameter
//       setSearchResult(data.bestMatches);
//       setIsSearchSubmitted(true);
//     } catch (error) {
//       console.error('Error fetching search data:', error);
//     }
//   };
  
  
//   // Fetch top 5 movers: stocks
//   useEffect(() => {
//     const fetchTopMoversAndBarData = async () => {
//       try {
//         console.log('Fetching top movers stocks...');

//         const response = await fetch('http://192.168.1.118:3000/api/top-movers');
//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
    
//         const gainers = data.gainers.map(stock => stock.symbol);
//         const losers = data.losers.map(stock => stock.symbol);
//         const symbolsArray = gainers.concat(losers);
//         const symbols = symbolsArray.join(',');
    
//         subscribeToStockUpdates(symbols);
//         console.log('subscribing stocks');
    
//         console.log('Fetching historical bars...');
//         const barsResponse = await fetch(`http://192.168.1.118:3000/api/historical-bars?symbols=${symbols}`);
//         if (!barsResponse.ok) throw new Error(`HTTP error! status: ${barsResponse.status}`);
//         const barsData = await barsResponse.json();
    
//         const barDataMap = {};
//         for (const symbol in barsData.bars) {
//           barDataMap[symbol] = barsData.bars[symbol].map(bar => bar.c); // Only closing price
//         }
    
//         setMarketData({
//           gainers: data.gainers || [],
//           losers: data.losers || [],

//         });
//         setBarData(barDataMap);
//       } catch (error) {
//         console.error('Error fetching market data:', error);
//       }
//     };
  
//     fetchTopMoversAndBarData();
  
//     return () => {
//       unsubscribeFromStockUpdates(marketData.gainers.concat(marketData.losers).map(stock => stock.symbol));
//     };
//   }, []);

//   useEffect(() => {
//     const fetchTopMoversAndBarDataCrypto = async () => {
//       try {
//         console.log('Fetching top movers crypto...');

//         const responseCrypto = await fetch('http://192.168.1.118:3000/api/top-movers-crypto');
//         if (!responseCrypto.ok) throw new Error(`HTTP error! status: ${responseCrypto.status}`);
//         const dataCrypto = await responseCrypto.json();
    
//         const gainersCrypto = dataCrypto.gainers.map(crypto => crypto.symbol);
//         const losersCrypto = dataCrypto.losers.map(crypto => crypto.symbol);
//         const symbolsArrayCrypto = gainersCrypto.concat(losersCrypto);
//         const symbolsCrypto = symbolsArrayCrypto.join(',');

//         subscribeToCryptoUpdates(symbolsCrypto);
//         console.log('subscribing crypto');

//         console.log('Fetching historical bars crypto...');
//         const barsResponseCrypto = await fetch(`http://192.168.1.118:3000/api/historical-bars-crypto?symbols=${symbolsCrypto}`);
//         if (!barsResponseCrypto.ok) throw new Error(`HTTP error! status: ${barsResponseCrypto.status}`);
//         const barsDataCrypto = await barsResponseCrypto.json();
    
//         const barDataMapCrypto = {};
//         for (const symbol in barsDataCrypto.bars) {
//           barDataMapCrypto[symbol] = barsDataCrypto.bars[symbol].map(bar => bar.c); // Only closing price
//         }
    
//         setMarketDataCrypto({
//           gainers: dataCrypto.gainers || [],
//           losers: dataCrypto.losers || [],

//         });
//         setBarDataCrypto(barDataMapCrypto);
//       } catch (error) {
//         console.error('Error fetching market data crypto:', error);
//       }
//     };

//     fetchTopMoversAndBarDataCrypto();

//     return () => {
//       unsubscribeFromCryptoUpdates(marketDataCrypto.gainers.concat(marketDataCrypto.losers).map(crypto => crypto.symbol));
//     };
//   }, []);

//   useEffect(() => {
//     const symbols = marketData.gainers.concat(marketData.losers).map(stock => stock.symbol);
//     subscribeToStockUpdates(symbols.join(','));
  
//     return () => {
//       unsubscribeFromStockUpdates(symbols.join(','));
//     };
//   }, [marketData]);
  
//   useEffect(() => {
//     const symbolsCrypto = marketDataCrypto.gainers.concat(marketDataCrypto.losers).map(crypto => crypto.symbol);
//     subscribeToCryptoUpdates(symbolsCrypto.join(','));
  
//     return () => {
//       unsubscribeFromCryptoUpdates(symbolsCrypto.join(','));
//     };
//   }, [marketDataCrypto]);


//   const handleWebSocketMessage = (data) => {
//     if (data && data.S) {
//       setMarketData(prevMarketData => {
//         const updatedGainers = prevMarketData.gainers.map(stock => (
//           data.S === stock.symbol ? { ...stock, price: data.p } : stock
//         ));
//         const updatedLosers = prevMarketData.losers.map(stock => (
//           data.S === stock.symbol ? { ...stock, price: data.p } : stock
//         ));
//         return { ...prevMarketData, gainers: updatedGainers, losers: updatedLosers };
//       });
//     }
//   };

//   const handleCryptoWebSocketMessage = (data) => {
//     if (data && data.S) {
//       setMarketDataCrypto(prevMarketData => {
//         const updatedGainers = prevMarketData.gainers.map(crypto => (
//           data.S === crypto.symbol ? { ...crypto, price: data.p } : crypto
//         ));
//         const updatedLosers = prevMarketData.losers.map(crypto => (
//           data.S === crypto.symbol ? { ...crypto, price: data.p } : crypto
//         ));
//         return { ...prevMarketData, gainers: updatedGainers, losers: updatedLosers };
//       });
//     }
//   };

//   const { isConnected } = useStockWebSocket(handleWebSocketMessage);
//   const { isConnectedCrypto } = useCryptoWebSocket(handleCryptoWebSocketMessage);

//   const renderStockCards = (stocks) => {
//     return (
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsWrapper}>
//          {stocks.map(stock => (
//           <View key={stock.symbol} style={styles.card}>
//             <Text style={[styles.cardSymbol, { color: stock.isGainer ? 'white' : 'white' }]}>
//               {stock.symbol}
//             </Text>
//             {barData[stock.symbol] && (
//               <View style={styles.chartWrapper}>
//                 <LineChart
//                   data={{
//                     labels: [], 
//                     datasets: [
//                       {
//                         data: barData[stock.symbol],
//                         color: () => stock.isGainer ? 'green' : 'red', 
//                       },
//                     ],
//                   }}
//                   width={140} 
//                   height={80} 
//                   chartConfig={{
//                     backgroundColor: '#000000',
//                     backgroundGradientFrom: '#000000',
//                     backgroundGradientTo: '#000000',
//                     color: () => 'white', 
//                     strokeWidth: 2,
//                     propsForDots: {
//                       r: '0', 
//                     },
//                     propsForBackgroundLines: {
//                       strokeWidth: 0, 
//                     },
//                   }}
//                   withHorizontalLabels={false} 
//                   withVerticalLabels={false} 
//                   withInnerLines={false} 
//                   withOuterLines={false} 
//                   withShadow={false} 
//                   bezier
//                   style={styles.chart}
//                 />
//               </View>
//             )}
//             <Text style={[styles.cardPrice, { color: stock.isGainer ? 'green' : 'red' }]}>
//               ${stock.price ? stock.price.toFixed(2) : 'N/A'}
//             </Text>
//             <Text style={[styles.cardPercent, { color: stock.isGainer ? 'green' : 'red' }]}>
//             {stock.isGainer ? `+${stock.percent_change?.toFixed(2)}` : `${stock.percent_change?.toFixed(2)}`}%
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//     );
//   };

//   const renderCryptoCards = (cryptos) => {
//     return (
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsWrapper}>
//          {cryptos.map(crypto => (
//           <View key={crypto.symbol} style={styles.card}>
//             <Text style={[styles.cardSymbol, { color: crypto.isGainer ? 'white' : 'white' }]}>
//               {crypto.symbol}
//             </Text>
//             {barDataCrypto[crypto.symbol] && (
//               <View style={styles.chartWrapper}>
//                 <LineChart
//                   data={{
//                     labels: [], 
//                     datasets: [
//                       {
//                         data: barDataCrypto[crypto.symbol],
//                         color: () => crypto.isGainer ? 'green' : 'red', 
//                       },
//                     ],
//                   }}
//                   width={140} 
//                   height={80} 
//                   chartConfig={{
//                     backgroundColor: '#000000',
//                     backgroundGradientFrom: '#000000',
//                     backgroundGradientTo: '#000000',
//                     color: () => 'white', 
//                     strokeWidth: 2,
//                     propsForDots: {
//                       r: '0', 
//                     },
//                     propsForBackgroundLines: {
//                       strokeWidth: 0, 
//                     },
//                   }}
//                   withHorizontalLabels={false} 
//                   withVerticalLabels={false} 
//                   withInnerLines={false} 
//                   withOuterLines={false} 
//                   withShadow={false} 
//                   bezier
//                   style={styles.chart}
//                 />
//               </View>
//             )}
//             <Text style={[styles.cardPrice, { color: crypto.isGainer ? 'green' : 'red' }]}>
//               ${crypto.price ? crypto.price.toFixed(2) : 'N/A'}
//             </Text>
//             <Text style={[styles.cardPercent, { color: crypto.isGainer ? 'green' : 'red' }]}>
//             {crypto.isGainer ? `+${crypto.percent_change?.toFixed(2)}` : `${crypto.percent_change?.toFixed(2)}`}%
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//     );
//   }



//   const combinedStocks = [
//         ...marketData.gainers.map(stock => ({ ...stock, isGainer: true })),
//         ...marketData.losers.map(stock => ({ ...stock, isGainer: false }))
//       ];
  
//       const combinedCrypto = [
//         ...marketDataCrypto.gainers.map(crypto => ({ ...crypto, isGainer: true })),
//         ...marketDataCrypto.losers.map(crypto => ({ ...crypto, isGainer: false }))
//       ];
//       const renderSearchResults = () => {
//         if (!searchTerm.trim()) {
//           return null;
//         }

//         if (isSearchSubmitted && (!searchResult || searchResult.length === 0)) {
//           return <Text style={styles.noResultsText}>No results for '{searchTerm}'</Text>;
//         }
      
//         if (searchResult) {
//           return (
//             <ScrollView style={styles.resultsContainer}>
//               {searchResult.map((match, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.resultItem}
//                   onPress={() => {
//                     // Handle item press, e.g., navigate to stock detail screen
//                     navigation.navigate('StockDetail', { stockSymbol: match['1. symbol'] });
//                     {clearInput}
//                     bottomSheetModalRef.current?.dismiss(); // Close the modal
//                   }}
//                 >
//                   <Text style={styles.resultSymbol}>{match['1. symbol']}</Text>
//                   <Text style={styles.resultName}>{match['2. name']}</Text>
//                   <View style={styles.separator} />
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           );
//         }
//       };
  
      
    
      // return (
      //   <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
      //     <View style={styles.container}>
      //       {/* Search Icon */}
      //       <BottomSheetModalProvider>
      //         <TouchableOpacity style={styles.searchIcon} onPress={handlePresentModal}>
      //           <Icon name="search" size={24} color="white" />
      //         </TouchableOpacity>
      //         <BottomSheetModal
      //           ref={bottomSheetModalRef}
      //           index={0}
      //           snapPoints={snapPoints}
      //           handleIndicatorStyle={styles.handleIndicator}
      //           onDismiss={() => setSearchResult(null)}
      //           backgroundStyle={styles.bottomSheetBackground}
      //         >
      //           <View style={styles.searchContainer}>
      //             <View style={styles.searchInputWrapper}>
      //               <Icon name="search" size={20} color="#888" style={styles.searchIconBar} />
      //               <TextInput
      //                 ref={searchInputRef}
      //                 style={styles.searchInput}
      //                 placeholder="Company or ticker"
      //                 placeholderTextColor="#888"
      //                 value={searchTerm}
      //                 onChangeText={handleSearchChange}
      //                 onSubmitEditing={handleSearchSubmit}
      //               />
      //               {searchTerm.length > 0 && (
      //                 <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
      //                   <Icon name="cancel" size={20} color="#fff" />
      //                 </TouchableOpacity>
      //               )}
      //               </View>
      //               {renderSearchResults()}
      //           </View>
      //         </BottomSheetModal>
      //         <ScrollView style={styles.contentContainer}>
      //         <View>
      //         <Text style={styles.header}>Top Movers</Text>
      //         <Text style={styles.subHeader}>Stocks making the biggest moves today.</Text>
      //         {renderStockCards(combinedStocks)}
      //         <Text style={styles.subHeader}>Crypto making the biggest moves today.</Text>
      //         {renderCryptoCards(combinedCrypto)}
      //       </View>
      //         </ScrollView>
      //       </BottomSheetModalProvider>
      //     </View>
      //   </GestureHandlerRootView>
      // );
// };
    
//     const styles = StyleSheet.create({
//       header: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginVertical: 12,
//       },
//       container: {
//         flexGrow: 1,
//         backgroundColor: '#000000',
//         padding: 20,
//       },
//       contentContainer: {
//         flexGrow: 1,
//         backgroundColor: '#000000',
//       },
//       cardsWrapper: {
//         flexDirection: 'row',
//       },
//       card: {
//         backgroundColor: '#000000',
//         borderRadius: 8,
//         padding: 10,
//         marginRight: 15,
//         width: 150,
//         height: 180, 
//         justifyContent: 'flex-start',
//         alignItems: 'flex-start',
//       },
//       chartWrapper: {
//         width: '50%',
//         height: 80, 
//         marginBottom: 10,
//       },
//       chart: {
//         marginVertical: 2,
//         borderRadius: 0,
//         alignItems: 'center',
//         justifyContent: 'center',
//       },
//       cardSymbol: {
//         fontSize: 15,
//         fontWeight: 'bold',
//         marginLeft: 10,
//         marginTop: 5
//       },
//       cardPrice: {
//         fontSize: 20,
//         marginBottom: 5,
//         fontWeight: 'bold',
//         marginLeft: 10,
//       },
//       cardPercent: {
//         fontSize: 11,
//         fontWeight: 'bold',
//         marginLeft: 10,
//       },
//       header: {
//         fontSize: 24,
//         color: 'white',
//         fontWeight: 'bold',
//         marginBottom: 5,
//         marginTop: 40
//       },
//       subHeader: {
//         fontSize: 14,
//         color: 'grey',
//         marginBottom: 20,
//       },
//       handleIndicator: {
//         backgroundColor: '#888', // Set the handle color to gray
//         width: 50, // Adjust the width if needed
//         height: 5,  // Adjust the height if needed
//         borderRadius: 5,
//       },
//       searchInputWrapper: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#313133', // Gray background for the search bar
//         borderRadius: 10,
//         padding: 8,
//         marginBottom: 24
//       },
//       searchIconBar: {
//         marginRight: 10, // Space between the icon and the input
//       },
//       searchIcon: {
//         position: 'absolute',
//         top: 63, 
//         right: 20,
//         zIndex: 1,
//       },
//       bottomSheetBackground: {
//         borderRadius: 30,
//         backgroundColor: '#080813', // Black background for the bottom sheet
//       },
//       searchContainer: {
//         backgroundColor: '#080813',
//         padding: 18,
//         flexDirection: 'column',
//         flex: 1,
//       },
//       searchInput: {
//         flex: 1,
//         fontSize: 14,
//         color: '#fff',  // Set text color to white
//       },
//       resultsContainer: {
//         //marginTop: 10,
//         flex: 1,
//       },
//       resultItem: {
//         //padding: 5,
//       },
//       resultSymbol: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: 'white',
//         marginBottom: 5
//       },
//       resultName: {
//         fontSize: 14,
//         color: '#888',
//       },
//       clearButton: {
//         marginLeft: 10,
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
//       separator: {
//         height: 1,
//         backgroundColor: '#111',
//         marginVertical: 20,
//       },
//       noResultsText: {
//         color: 'white',
//         textAlign: 'center',
//         fontWeight: 'bold'
//       }
//     });
    
//     export default HomeScreen;


import React from 'react';
import { View, StyleSheet} from 'react-native';
import MostActive from '../../components/home/mostActive';
import TopMovers from '../../components/home/topMovers';

const HomeScreen = () => {
  return (
        <View style={styles.container}>
        <TopMovers />
        {/* <MostActive /> */}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
    backgroundColor: '#000000', // Set a background color or use your theme
    zIndex: 1000,

  },
});

export default HomeScreen;