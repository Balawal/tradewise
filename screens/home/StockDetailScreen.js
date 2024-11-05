import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Chart from '../../components/home/stockdetails/chart';
import LastPrice from '../../components/home/stockdetails/lastPrice';
import WatchList from '../../components/watchlist/watchList';
import EarningsCalendar from '../../components/home/stockdetails/calendar';
import useFetchStockDetails from '../../hooks/home/stockdetails/useFetchStockDetails';
import { formatNum, formatDecimal } from '../../utils/utils';
import { LoadingIndicator } from '../../styles/components/loadingIndicator';
import NewsItem from '../../components/home/stockdetails/news';
import { stockDetailScreenStyles as styles } from '../../styles/homeStyles';

const StockDetailScreen = ({ route, navigation }) => {
  const { stockSymbol } = route.params;
  const [backButtonColor, setBackButtonColor] = useState(''); 
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [graphColor, setGraphColor] = useState('green');

  const handleColorChange = (color) => {
    setGraphColor(color);
    setBackButtonColor(color);
  };

  const { stockData, price, movingAverages, volume, earnings, sentiment, sixMBarsData, loading } = useFetchStockDetails(stockSymbol);

  if (loading) {
    return <LoadingIndicator color="white" />;
  }

  const renderNewsList = () => (
    <FlatList
      data={sentiment?.articles || []} 
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
        {stockData ? (
          <>
          <View style={styles.header}>
            
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back-ios" size={25} color={backButtonColor} style={{ fontSize: 25 }} />
            </TouchableOpacity>
           
            <View style={{ marginLeft: 260 }}>
              <TouchableOpacity >
                <EarningsCalendar earningsDate={earnings?.firstEarningsDate || "None"} stockSymbol={stockSymbol} color={backButtonColor}/>
              </TouchableOpacity>
            </View>
            
            <View style={{ marginTop: -3, marginRight: 15 }}>
            <WatchList symbol={stockSymbol} name={stockData.Name} price={price.trade.p} type="stock" color={backButtonColor} />
            </View>
          
          </View>
            <Text style={styles.name}>{stockData.Name || "None"}</Text>
            <LastPrice stockSymbol={stockSymbol} containerStyle={styles.containerLP} textStyle={styles.latestTrade} />
            <Chart stockSymbol={stockSymbol} onColorChange={handleColorChange} selectedTimeframe={selectedTimeframe} setSelectedTimeframe={setSelectedTimeframe} graphColor={graphColor}/>
            
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
                <Text style={styles.under}>{earnings?.firstEarningsDate || "None"}</Text>
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
            {renderNewsList()}
          </>
        ) : (
          Alert.alert('Error', 'Details are not loading right now. Please try again later')
        )}
      </View>
    </View>
  );

  return (
    <FlatList 
      style={styles.container}
      data={[]}
      ListHeaderComponent={renderHeader}
      keyExtractor={(item) => item.id}
    />
  );
};

export default StockDetailScreen;