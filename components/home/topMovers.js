import React, { useEffect, useState, useRef, useCallback} from 'react';
import { View, Text, StyleSheet, ScrollView} from 'react-native';
import { StockCards, CryptoCards } from './cards';
import SearchStocks from './searchStocks';
import TopMoversStreaming from '../websocket/topMoversStreaming';
import MostActive from './mostActive';

const TopMovers = () => {
  const [marketData, setMarketData] = useState({ gainers: [], losers: [] });
  const [marketDataCrypto, setMarketDataCrypto] = useState({ gainers: [], losers: [] });
  const [barData, setBarData] = useState({});
  const [barDataCrypto, setBarDataCrypto] = useState({});

  const { isStockConnected, isCryptoConnected } = TopMoversStreaming(marketData, setMarketData, marketDataCrypto, setMarketDataCrypto);

  
  // Fetch top 5 movers
  useEffect(() => {
    const fetchTopMoversAndBarData = async () => {
      try {
        console.log('Fetching top movers stocks...');

        const response = await fetch('http://192.168.1.118:3000/api/top-movers');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
    
        const gainers = data.gainers.map(stock => stock.symbol);
        const losers = data.losers.map(stock => stock.symbol);
        const symbolsArray = gainers.concat(losers);
        const symbols = symbolsArray.join(',');
    
        console.log('Fetching historical bars...');
        const barsResponse = await fetch(`http://192.168.1.118:3000/api/historical-bars?symbols=${symbols}`);
        if (!barsResponse.ok) throw new Error(`HTTP error! status: ${barsResponse.status}`);
        const barsData = await barsResponse.json();
    
        const barDataMap = {};
        for (const symbol in barsData.bars) {
          barDataMap[symbol] = barsData.bars[symbol].map(bar => bar.c); // Only closing price
        }
    
        setMarketData({
          gainers: data.gainers || [],
          losers: data.losers || [],

        });
        setBarData(barDataMap);
      } catch (error) {
        console.error('Error fetching market data:', error);
      }
    };

    const fetchTopMoversAndBarDataCrypto = async () => {
      try {
        console.log('Fetching top movers crypto...');

        const responseCrypto = await fetch('http://192.168.1.118:3000/api/top-movers-crypto');
        if (!responseCrypto.ok) throw new Error(`HTTP error! status: ${responseCrypto.status}`);
        const dataCrypto = await responseCrypto.json();
    
        const gainersCrypto = dataCrypto.gainers.map(crypto => crypto.symbol);
        const losersCrypto = dataCrypto.losers.map(crypto => crypto.symbol);
        const symbolsArrayCrypto = gainersCrypto.concat(losersCrypto);
        const symbolsCrypto = symbolsArrayCrypto.join(',');

        console.log('Fetching historical bars crypto...');
        const barsResponseCrypto = await fetch(`http://192.168.1.118:3000/api/historical-bars-crypto?symbols=${symbolsCrypto}`);
        if (!barsResponseCrypto.ok) throw new Error(`HTTP error! status: ${barsResponseCrypto.status}`);
        const barsDataCrypto = await barsResponseCrypto.json();
    
        const barDataMapCrypto = {};
        for (const symbol in barsDataCrypto.bars) {
          barDataMapCrypto[symbol] = barsDataCrypto.bars[symbol].map(bar => bar.c); // Only closing price
        }
    
        setMarketDataCrypto({
          gainers: dataCrypto.gainers || [],
          losers: dataCrypto.losers || [],

        });
        setBarDataCrypto(barDataMapCrypto);
      } catch (error) {
        console.error('Error fetching market data crypto:', error);
      }
    };
  
    fetchTopMoversAndBarData();
    fetchTopMoversAndBarDataCrypto();
  
    return () => {
    };
  }, []);


  const combinedStocks = [
    ...marketData.gainers.map(stock => ({ ...stock, isGainer: true })),
    ...marketData.losers.map(stock => ({ ...stock, isGainer: false }))
  ];
  
  const combinedCrypto = [
    ...marketDataCrypto.gainers.map(crypto => ({ ...crypto, isGainer: true })),
    ...marketDataCrypto.losers.map(crypto => ({ ...crypto, isGainer: false }))
  ];
  
  return (
    // <ScrollView style={styles.contentContainer}>
    //   <View style={{ flex: 0 }}>
    //   <Text style={styles.header}>Top Movers</Text>
    //   <Text style={styles.subHeader}>Stocks making the biggest moves today.</Text>
    //   <StockCards stocks={combinedStocks} barData={barData} />
    //   <Text style={styles.subHeader}>Crypto making the biggest moves today.</Text>
    //   <CryptoCards cryptos={combinedCrypto} barDataCrypto={barDataCrypto} />
    // </View>
    // <SearchStocks />
    // </ScrollView>

// {/* <View style={{ flex: 1 }}>
// <ScrollView style={styles.contentContainer}>
//   <View>
//     <Text style={styles.header}>Top Movers</Text>
//     <Text style={styles.subHeader}>Stocks making the biggest moves today.</Text>
//     <StockCards stocks={combinedStocks} barData={barData} />
//     <Text style={styles.subHeader}>Crypto making the biggest moves today.</Text>
//     <CryptoCards cryptos={combinedCrypto} barDataCrypto={barDataCrypto} />
//   </View>
// </ScrollView>
// {/* Render SearchStocks here */}
// <SearchStocks />
// </View> */}

<View style={{ flex: 1, backgroundColor: '#000000', }}>
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <SearchStocks />
      <View>
        <Text style={styles.header}>Top Movers</Text>
        <Text style={styles.subHeader}>Stocks making the biggest moves today.</Text>
        <StockCards stocks={combinedStocks} barData={barData} />
        <Text style={styles.subHeader}>Crypto making the biggest moves today.</Text>
        <CryptoCards cryptos={combinedCrypto} barDataCrypto={barDataCrypto} />
        <MostActive />
      </View>
    </ScrollView>
  </View>

  );
};
    
const styles = StyleSheet.create({
  searchContainer: {
    position: 'relative', 
    zIndex: 2, 
    backgroundColor: '#000000', 
  },
  container: {
    backgroundColor: '#000000',
    padding: 3,
  },
  contentContainer: {
    backgroundColor: '#000000',
  },
  cardsWrapper: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
    width: 150,
    height: 180, 
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  chartWrapper: {
    width: '50%',
    height: 80, 
    marginBottom: 10,
  },
  chart: {
    marginVertical: 2,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSymbol: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 5
  },
  cardPrice: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardPercent: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  header: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 60,
    marginLeft: 15
  },
  subHeader: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 20,
    marginLeft: 15
  },
});
    
    export default TopMovers;