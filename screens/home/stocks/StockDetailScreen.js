import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image, FlatList, Linking } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-chart-kit';
import Chart from '../../../components/stockdetails/chart' 
import LastPrice from '../../../components/stockdetails/lastPrice';
import WatchList from '../../../components/stockdetails/watchList';


const StockDetailScreen = ({ route, navigation }) => {
  const { stockSymbol } = route.params;
  const [stockData, setStockData] = useState(null);
  const [price, setPrice] = useState(null);
  const [movingAverages, setMovingAverages] = useState(null);
  const [volume, setVolume] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sixMBarsData, setSixMBarData] = useState({});

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://192.168.1.118:3000/api/stock-fundamentals?symbol=${stockSymbol}`);
        const data = await response.json();
        setStockData(data);

        const traderesponse = await fetch(`http://192.168.1.118:3000/api/latest-trade?symbols=${stockSymbol}`);
        const tradeData = await traderesponse.json();
        setPrice(tradeData);

        const maResponse = await fetch(`http://192.168.1.118:3000/api/stock-moving-averages?symbol=${stockSymbol}`);
        const maData = await maResponse.json();
        setMovingAverages(maData);

        const volResponse = await fetch(`http://192.168.1.118:3000/api/stock-volume?symbol=${stockSymbol}`);
        const volData = await volResponse.json();
        setVolume(volData);

        const earningsResponse = await fetch(`http://192.168.1.118:3000/api/stock-earnings?symbol=${stockSymbol}`);
        const earningsData = await earningsResponse.json();
        setEarnings(earningsData);

        const sentimentResponse = await fetch(`http://192.168.1.118:3000/api/stock-sentiment?symbol=${stockSymbol}`);
        const sentimentData = await sentimentResponse.json();
        setSentiment(sentimentData);

        const sixMResponse = await fetch(`http://192.168.1.118:3000/api/six-month-bars?symbols=${stockSymbol}`);
        const sixMBarData = await sixMResponse.json();

        const sixMBarDataMap = {};
        for (const symbol in sixMBarsData.bars) {
          sixMBarDataMap[symbol] = sixMBarsData.bars[symbol].map(bar => bar.c); // Only closing price
        }
        setSixMBarData(sixMBarDataMap);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [stockSymbol]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIndicator color="white" />
      </View>
    );
  }

  const renderNewsItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity
          style={styles.featuredNewsContainer}
          onPress={() => navigation.navigate('NewsDetail', { url: item.url })}
        >
          {item.banner_image && (
            <Image
              source={{ uri: item.banner_image }}
              style={styles.featuredNewsImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.featuredHeadline} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <View style={styles.separator} />
        </TouchableOpacity>
      );
    }
  

    return (
      <TouchableOpacity
        style={styles.newsContainer}
        onPress={() => navigation.navigate('NewsDetail', { url: item.url })}
      >
        <View style={styles.newsContent}>
          <Text style={styles.headline} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          {item.banner_image && (
            <Image
              source={{ uri: item.banner_image }}
              style={styles.newsImage}
              resizeMode="cover"
            />
          )}
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  };

  const formatNum = (num) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(1) + 'T';  
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';  
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M'; 
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K'; 
    } else{
      return num.toString();  
    }
  };

  const formatDecimal = (num, decimalPlaces = 2) => {

    const number = typeof num === 'string' ? parseFloat(num) : num;
    // Check if num is a number
    if (typeof number === 'number' && !isNaN(number)) {
      return number.toFixed(decimalPlaces);
    } else {
      return 'N/A'; // or any default value you'd like to show
    }
  };



  const renderHeader = () => (
    <View>
      <View>
        {stockData ? (
          <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-ios" size="25" color="white" />
            </TouchableOpacity>
            <WatchList symbol={stockSymbol} name={stockData.Name} price={price.trade.p} type="stock" />
          </View>
            <Text style={styles.name}>{stockData.Name || "None"}</Text>
            <LastPrice stockSymbol={stockSymbol} />
            <Chart stockSymbol={stockSymbol} />
            
            <Text style={styles.keystats}>Key Stats</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>TICKER</Text>
                <Text style={styles.under}>{stockData.Symbol || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>MARKET CAP</Text>
                <Text style={styles.under}>{formatNum(stockData.MarketCapitalization) || "None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>VOLUME</Text>
                <Text style={styles.under}>{formatNum(volume?.mostRecent?.volume) || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>OPEN</Text>
                <Text style={styles.under}>{formatDecimal(volume?.mostRecent?.open) || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>PE RATIO</Text>
                <Text style={styles.under}>{stockData.PERatio || "None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>AVG VOLUME</Text>
                <Text style={styles.under}>{formatNum(volume?.averageVolumes?.avgVolume365) || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>CLOSE</Text>
                <Text style={styles.under}>{formatDecimal(volume?.mostRecent?.close) || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>YTD CHANGE</Text>
                <Text style={styles.under}>{formatDecimal(volume?.ytdChange) || "None"}%</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>EARNING DATE</Text>
                <Text style={styles.under}>{earnings?.annualEarnings?.[0]?.fiscalDateEnding || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <Text style={styles.sentiment}>Sentiment</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>SCORE</Text>
                <Text style={styles.under}>{sentiment?.tickerSentimentScore || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>POSITIVE</Text>
                <Text style={styles.under}>{sentiment?.positiveCount || "None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>NEGATIVE</Text>
                <Text style={styles.under}>{sentiment?.negativeCount || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <Text style={styles.dividend}>Dividend</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>DIV YIELD</Text>
                <Text style={styles.under}>{stockData.DividendYield || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>DIV DATE</Text>
                <Text style={styles.under}>{stockData.DividendDate || "None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>PREV DIV DATE</Text>
                <Text style={styles.under}>{stockData.ExDividendDate || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <Text style={styles.technicals}>Technicals</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>50 DAY MA</Text>
                <Text style={styles.under}>{formatDecimal(movingAverages?.['50_day_SMA']) || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>FLOAT</Text>
                <Text style={styles.under}>{"None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>10D AVG VOL</Text>
                <Text style={styles.under}>{formatNum(volume?.averageVolumes?.avgVolume10) || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>200 DAY MA</Text>
                <Text style={styles.under}>{formatDecimal(movingAverages?.['200_day_SMA']) || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>BETA</Text>
                <Text style={styles.under}>{stockData.Beta || "None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>30D AVG VOL</Text>
                <Text style={styles.under}>{formatNum(volume?.averageVolumes?.avgVolume30) || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <Text style={styles.technicals}>News</Text>
            <FlatList
              data={sentiment?.articles || []} 
              renderItem={renderNewsItem}
              keyExtractor={(item) => item.url}
              contentContainerStyle={styles.newsListContainer}
            />
          </>
        ) : (
          <Text>Stock data not available</Text>
        )}
      </View>
    </View>
  );

  return (
    <FlatList style={styles.container}
      data={[]}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={
        <FlatList
          data={sentiment}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.url}
        />
      }
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    marginVertical: 20, 
  },
  header:{
    flexDirection: 'row',    
    justifyContent: 'space-between', 
    paddingHorizontal: 10,    
    paddingTop: 35, 
  },
  goBack: {
    paddingTop: 35
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  name: {
    fontSize: 25,
    marginVertical: 8,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 8,
  },
  keystats: {
    fontSize: 23,
    marginVertical: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  sentiment: {
    fontSize: 23,
    marginVertical: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  dividend: {
    fontSize: 23,
    marginVertical: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  technicals: {
    fontSize: 23,
    marginVertical: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  descriptor: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 8,
    marginTop: 8
  },
  under: {
    fontSize: 13,
    color: 'white',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#111',
    marginVertical: 10,
  },
  newsListContainer: {
    maxHeight: 100, // Adjust the height as needed
    overflow: 'scroll', // Enable scrolling within the FlatList
  },
  newsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsContainer: {
    marginTop: 15,
    marginBottom: 15,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  headline: {
    fontSize: 12,
    color: '#ffffff',
    flex: 1,
    marginRight: 10,
    marginLeft: 12,
  },
  newsImage: {
    width: 50,
    height: 50,
    borderRadius: 0,
    marginHorizontal: 12
  },
  sourceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 5
  },
  sourceText: {
    fontSize: 12,
    color: '#ffffff',
    marginRight: 10,
    marginLeft: 12,
    fontWeight: 'bold'
  },
  featuredNewsContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  featuredNewsImage: {
    width: '100%',
    height: 250,  // Make the first image large
    borderRadius: 10,
  },
  featuredHeadline: {
    fontSize: 24,  // Larger font for the first title
    marginTop: 10,
    color: '#ffffff',
  },
});

export default StockDetailScreen;