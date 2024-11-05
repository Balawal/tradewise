import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChartCrypto from '../../components/home/cryptodetails/chartCrypto';
import WatchList from '../../components/watchlist/watchList';
import { LoadingIndicator } from '../../styles/components/loadingIndicator';
import NewsItem from '../../components/home/cryptodetails/newsCrypto';
import { formatNum } from '../../utils/utils';
import useFetchCryptoDetails from '../../hooks/home/cryptodetails/useFetchCryptoDetails';
import { cryptoDetailScreenStyles as styles } from '../../styles/homeStyles';

const CryptoDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { cryptoID, cryptoSymbol } = route.params;
  const [backButtonColor, setBackButtonColor] = useState(''); 
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [graphColor, setGraphColor] = useState('green');

  const handleColorChange = (color) => {
    setGraphColor(color);
    setBackButtonColor(color);
  };

  const { cryptoData, newsData, loading } = useFetchCryptoDetails(cryptoID, cryptoSymbol);

  if (loading) {
    return <LoadingIndicator color="white" />;
  }

  const renderNewsList = () => (
    <FlatList
      data={newsData?.news || []}
      renderItem={({ item, index }) => (
        <NewsItem item={item} index={index} onPress={() => navigation.navigate('NewsDetail', { url: item.url })}/>
      )}
      keyExtractor={(item) => item.url}
      contentContainerStyle={styles.newsListContainer}
    />
  );

  const renderHeader = () => (
    <View>
      <View>
        {cryptoData ? (
          <>
          <View style={styles.header}>
            
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-ios" size={25} color={backButtonColor} style={{ fontSize: 25 }} />
            </TouchableOpacity>
            
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
            {renderNewsList()}
          </>
        ) : (
          Alert.alert('Error', 'Details are not loading right now. Please try again later')
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

export default CryptoDetailScreen;