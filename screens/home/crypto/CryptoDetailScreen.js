import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image, FlatList, Linking, } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChartCrypto from '../../../components/cryptodetails/chartCrypto';
import WatchList from '../../../components/stockdetails/watchList';
import EarningsCalendar from '../../../components/stockdetails/calendar';


const CryptoDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { cryptoID, cryptoSymbol } = route.params;
 
  console.log("Crypto ID passed::: ", cryptoID);
  console.log("Crypto symbol passed::: ", cryptoSymbol);
  
  const [cryptoData, setCryptoData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backButtonColor, setBackButtonColor] = useState(''); // Default color for back button

  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [graphColor, setGraphColor] = useState('green');

  // Callback function to handle color change from ChartCrypto
  const handleColorChange = (color) => {
    setGraphColor(color);
    setBackButtonColor(color);
  };

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(`http://192.168.1.118:3000/api/crypto-coin-data?coinName=${cryptoID}`);
        const data = await response.json();
        setCryptoData(data);

        const newsResponse = await fetch(`http://192.168.1.118:3000/api/news-crypto?symbols=${cryptoSymbol}`);
        const newsData = await newsResponse.json();
        setNewsData(newsData);

      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
  }, [cryptoID, cryptoSymbol]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIndicator color="white" />
      </View>
    );
  }

  

  const renderNewsItem = ({ item, index }) => {
    // For the first article, use a different layout
    if (index === 0) {
      return (
        <TouchableOpacity
          style={styles.featuredNewsContainer}
          onPress={() => navigation.navigate('NewsDetail', { url: item.url })}
        >
          {item.images.length > 0 && (
            <Image
              source={{ uri: item.images[0].url }}
              style={styles.featuredNewsImage}
              resizeMode="cover"
            />
          )}
          <Text style={styles.featuredHeadline} numberOfLines={2} ellipsizeMode="tail">{item.headline}</Text>
          <View style={styles.separator} />
        </TouchableOpacity>
      );
    }
  
    // For other articles, use the default layout
    return (
      <TouchableOpacity
        style={styles.newsContainer}
        onPress={() => navigation.navigate('NewsDetail', { url: item.url })}
      >
        <View style={styles.newsContent}>
          <Text style={styles.headline} numberOfLines={2} ellipsizeMode="tail">{item.headline}</Text>
          {item.images.length > 0 && (
            <Image
              source={{ uri: item.images[0].url }}
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
      return (num / 1e12).toFixed(1) + 'T';  // Convert to trillions
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';   // Convert to billions
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';   // Convert to millions
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K'; 
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

  const earning = "2024-10-30";

  const renderHeader = () => (
    <View>
      <View>
        {cryptoData ? (
          <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-ios" size="25" color={backButtonColor} />
            </TouchableOpacity>
            {/* <EarningsCalendar earningsDate={earning} /> */}
            <WatchList symbol={(cryptoData.symbol).toUpperCase()} name={cryptoData.name} price={cryptoData.market_data.current_price.usd.toLocaleString()} type="crypto" color={backButtonColor}/>
          </View>
            <Text style={styles.name}>{cryptoData.name}</Text>
            <Text style={styles.price}>
                ${cryptoData.market_data.current_price.usd.toLocaleString()}
            </Text>
            <ChartCrypto cryptoID={cryptoID} onColorChange={handleColorChange} selectedTimeframe={selectedTimeframe} setSelectedTimeframe={setSelectedTimeframe} graphColor={graphColor} />
            
            <Text style={styles.keystats}>Key Stats</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>TICKER</Text>
                <Text style={styles.under}>{(cryptoData.symbol || "None").toUpperCase()}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>MARKET CAP</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.market_cap.usd) || "None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>RANK</Text>
                <Text style={styles.under}>{cryptoData.market_data.market_cap_rank || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>BTC CONVERSION</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.current_price.btc) || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>SUPPLY</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.circulating_supply.toFixed(2))|| "None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>VOLUME</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.total_volume.usd) || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />

            <Text style={styles.sentiment}>Sentiment</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>POSITIVE</Text>
                <Text style={styles.under}>{cryptoData.sentiment_votes_up_percentage || "0"}%</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>NEGATIVE</Text>
                <Text style={styles.under}>{cryptoData.sentiment_votes_down_percentage || "0"}%</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>X FOLLOWERS</Text>
                <Text style={styles.under}>{formatNum(cryptoData.community_data.twitter_followers) || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <Text style={styles.technicals}>Technicals</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>BLOCK TIME</Text>
                <Text style={styles.under}>{cryptoData.block_time_in_minutes || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>HASHING ALGO</Text>
                <Text style={styles.under}>{cryptoData.hashing_algorithm || "None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>ALL TIME HIGH</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.ath.usd) || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>VALUATION</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.fully_diluted_valuation.usd) || "None"}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>GENESIS DATE</Text>
                <Text style={styles.under}>{cryptoData.genesis_date || "None"}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>ALL TIME LOW</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.atl.usd) || "None"}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <Text style={styles.technicals}>News</Text>
            <FlatList
              data={newsData?.news || []} 
              renderItem={renderNewsItem}
              keyExtractor={(item) => item.url}
              contentContainerStyle={styles.newsListContainer}
            />
          </>
        ) : (
          <Text>Crypto data not available</Text>
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
          data={newsData}
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
    marginVertical: 20, // Adjust space around the chart
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
  price: {
    fontSize: 40,
    marginVertical: 2,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 1,
    marginBottom: 10,
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

export default CryptoDetailScreen;