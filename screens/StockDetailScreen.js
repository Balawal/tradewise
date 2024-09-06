import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image, FlatList, Linking } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';

const StockDetailScreen = ({ route, navigation }) => {
  const { stockSymbol } = route.params;
  const [stockData, setStockData] = useState(null);
  const [movingAverages, setMovingAverages] = useState(null);
  const [volume, setVolume] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`http://192.168.1.118:3000/api/stock-fundamentals?symbol=${stockSymbol}`);
        const data = await response.json();
        setStockData(data);

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

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity style={styles.newsContainer} onPress={() => navigation.navigate('NewsDetail', { url: item.url })}>
      
      <View style={styles.newsContent}>
        <Text style={styles.headline}>{item.title}</Text>
        {item.banner_image && (
          <Image
            source={{ uri: item.banner_image }}
            style={styles.newsImage}
            resizeMode="cover"
          />
        )}
      </View>
        <View style={styles.sourceContainer}>
            <View key={index} style={styles.symbolInfo}>
              <Text style={styles.sourceText}>
                {source}
              </Text>
            </View>
        </View>
     
      <View style={styles.separator} />
    </TouchableOpacity>
  );

  const formatNum = (num) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(1) + 'T';  // Convert to trillions
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';   // Convert to billions
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';   // Convert to millions
    } else {
      return num.toString();  // Return as is if less than 1 million
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
          <Text style={styles.name}>{stockData.Name}</Text>
          
          <Text style={styles.keystats}>Key Stats</Text>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.descriptor}>TICKER</Text>
              <Text style={styles.under}>{stockData.Symbol}</Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.descriptor}>MARKET CAP</Text>
              <Text style={styles.under}>{formatNum(stockData.MarketCapitalization)}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.descriptor}>VOLUME</Text>
              <Text style={styles.under}>{formatNum(volume['mostRecent']['volume'])}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.descriptor}>OPEN</Text>
              <Text style={styles.under}>{formatDecimal(volume['mostRecent']['open'])}</Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.descriptor}>PE RATIO</Text>
              <Text style={styles.under}>{stockData.PERatio}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.descriptor}>AVG VOLUME</Text>
              <Text style={styles.under}>{formatNum(volume['averageVolumes']['avgVolume365'])}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.descriptor}>CLOSE</Text>
              <Text style={styles.under}>{formatDecimal(volume['mostRecent']['close'])}</Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.descriptor}>YTD CHANGE</Text>
              <Text style={styles.under}>{formatDecimal(volume['ytdChange'])}%</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.descriptor}>EARNING DATE</Text>
              <Text style={styles.under}>{earnings.annualEarnings[0].fiscalDateEnding}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          <Text style={styles.sentiment}>Sentiment</Text>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.descriptor}>SCORE</Text>
              <Text style={styles.under}>{sentiment?.tickerSentimentScore}</Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.descriptor}>POSITIVE</Text>
              <Text style={styles.under}>{sentiment?.positiveCount}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.descriptor}>NEGATIVE</Text>
              <Text style={styles.under}>{sentiment?.negativeCount}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          <Text style={styles.dividend}>Dividend</Text>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.descriptor}>DIV YIELD</Text>
              <Text style={styles.under}>{stockData.DividendYield}</Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.descriptor}>DIV DATE</Text>
              <Text style={styles.under}>{stockData.DividendDate}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.descriptor}>PREV DIV DATE</Text>
              <Text style={styles.under}>{stockData.ExDividendDate}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          <Text style={styles.technicals}>Technicals</Text>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.descriptor}>50 DAY MA</Text>
              <Text style={styles.under}>{formatDecimal(movingAverages['50_day_SMA'])}</Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.descriptor}>FLOAT</Text>
              <Text style={styles.under}></Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.descriptor}>10D AVG VOL</Text>
              <Text style={styles.under}>{formatNum(volume['averageVolumes']['avgVolume10'])}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.descriptor}>200 DAY MA</Text>
              <Text style={styles.under}>{formatDecimal(movingAverages['200_day_SMA'])}</Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.descriptor}>BETA</Text>
              <Text style={styles.under}>{stockData.Beta}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text style={styles.descriptor}>30D AVG VOL</Text>
              <Text style={styles.under}>{formatNum(volume['averageVolumes']['avgVolume10'])}</Text>
            </View>
          </View>
          <View style={styles.separator} />

          <Text style={styles.technicals}>News</Text>
          <FlatList
              data={sentiment?.articles || []} // Ensure articles is an array
              renderItem={renderNewsItem}
              keyExtractor={(item) => item.url}
              contentContainerStyle={styles.newsListContainer} // Add this line
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
    fontSize: 35,
    marginVertical: 8,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 200,
  },
  keystats: {
    fontSize: 23,
    marginVertical: 20,
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
    marginTop: 30,
    marginBottom: 30,
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
});

export default StockDetailScreen;