import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image, FlatList, Linking } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { LineChart } from 'react-native-chart-kit';
// import Chart from '../../../components/stockdetails/chart' 
// import LastPrice from '../../../components/stockdetails/lastPrice';
// import WatchList from '../../../components/stockdetails/watchList';
import ChartCrypto from '../../components/cryptodetails/chartCrypto';


const CryptoDetailScreen = () => {
  const  cryptoSymbol  = 'bitcoin';
  const [cryptoData, setCryptoData] = useState(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(`http://192.168.1.118:3000/api/crypto-coin-data?coinName=${cryptoSymbol}`);
        const data = await response.json();
        setCryptoData(data);

      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptoData();
  }, [cryptoSymbol]);

  

//   const renderNewsItem = ({ item, index }) => {
//     // For the first article, use a different layout
//     if (index === 0) {
//       return (
//         <TouchableOpacity
//           style={styles.featuredNewsContainer}
//           onPress={() => navigation.navigate('NewsDetail', { url: item.url })}
//         >
//           {item.banner_image && (
//             <Image
//               source={{ uri: item.banner_image }}
//               style={styles.featuredNewsImage}
//               resizeMode="cover"
//             />
//           )}
//           <Text style={styles.featuredHeadline} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
//           <View style={styles.separator} />
//         </TouchableOpacity>
//       );
//     }
  
//     // For other articles, use the default layout
//     return (
//       <TouchableOpacity
//         style={styles.newsContainer}
//         onPress={() => navigation.navigate('NewsDetail', { url: item.url })}
//       >
//         <View style={styles.newsContent}>
//           <Text style={styles.headline} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
//           {item.banner_image && (
//             <Image
//               source={{ uri: item.banner_image }}
//               style={styles.newsImage}
//               resizeMode="cover"
//             />
//           )}
//         </View>
//         <View style={styles.separator} />
//       </TouchableOpacity>
//     );
//   };

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



  const renderHeader = () => (
    <View>
      <View>
        {cryptoData ? (
          <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-ios" size="25" color="white" />
            </TouchableOpacity>
          </View>
            
            <Text style={styles.name}>{cryptoData.name}</Text>
            <Text style={styles.price}>${cryptoData.market_data.current_price.usd}</Text>
            <ChartCrypto cryptoSymbol={cryptoSymbol} />
            
            <Text style={styles.keystats}>Key Stats</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>TICKER</Text>
                <Text style={styles.under}>{cryptoData.symbol}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>MARKET CAP</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.market_cap.usd)}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>RANK</Text>
                <Text style={styles.under}>{cryptoData.market_data.market_cap_rank}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>BTC CONVERSION</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.current_price.btc)}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>SUPPLY</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.circulating_supply)}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>VOLUME</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.total_volume.usd)}</Text>
              </View>
            </View>
            <View style={styles.separator} />

            <Text style={styles.sentiment}>Sentiment</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>POSITIVE</Text>
                <Text style={styles.under}>{cryptoData.sentiment_votes_up_percentage}%</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>NEGATIVE</Text>
                <Text style={styles.under}>{cryptoData.sentiment_votes_down_percentage}%</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>X FOLLOWERS</Text>
                <Text style={styles.under}>{formatNum(cryptoData.community_data.twitter_followers)}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <Text style={styles.technicals}>Technicals</Text>
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>BLOCK TIME</Text>
                <Text style={styles.under}>{cryptoData.block_time_in_minutes}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>HASHING ALGO</Text>
                <Text style={styles.under}>{cryptoData.hashing_algorithm}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>ALL TIME HIGH</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.ath.usd)}</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <View style={styles.leftColumn}>
                <Text style={styles.descriptor}>VALUATION</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.fully_diluted_valuation.usd)}</Text>
              </View>
              <View style={styles.centerColumn}>
                <Text style={styles.descriptor}>GENESIS DATE</Text>
                <Text style={styles.under}>{cryptoData.genesis_date}</Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={styles.descriptor}>ALL TIME LOW</Text>
                <Text style={styles.under}>{formatNum(cryptoData.market_data.atl.usd)}</Text>
              </View>
            </View>
            <View style={styles.separator} />
  
            <Text style={styles.technicals}>News</Text>
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
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    marginVertical: 20, // Adjust space around the chart
  },
  header:{
    flexDirection: 'row',     // Arrange items in a row
    justifyContent: 'space-between', // Space out items to the edges
    paddingHorizontal: 15,    // Add some horizontal padding
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











// import {View, Text, TouchableOpacity} from 'react-native';
// import React from 'react';
// import { SafeAreaView } from 'react-native';
// import { signOut } from 'firebase/auth';
// import { auth } from '../../config/firebase';

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