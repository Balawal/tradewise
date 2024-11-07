import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';
import { formatNum } from '../../utils/utils';
import { cardsStyles as styles } from '../../styles/homeStyles';

export const StockCards = ({ stocks, barData, displayVolume }) => {
  const navigation = useNavigation();
    
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsWrapper}>
      {stocks.map(stock => (
        <TouchableOpacity
          key={stock.symbol}
          style={styles.card}
          onPress={() => {
            navigation.navigate('StockDetail', { stockSymbol: stock.symbol });
          }}
        >
        <View key={stock.symbol} style={styles.card}>
          <Text style={[styles.cardSymbol, { color: stock.isGainer ? 'white' : 'white' }]}>
            {stock.symbol}
          </Text>
          {barData[stock.symbol] && (
            <View style={styles.chartWrapper}>
              <LineChart
                data={{
                  labels: [],
                  datasets: [
                    {
                      data: barData[stock.symbol],
                      color: () => (stock.isGainer ? 'green' : 'red'),
                    },
                  ],
                }}
                width={140}
                height={80}
                chartConfig={{
                  backgroundColor: '#000000',
                  backgroundGradientFrom: '#000000',
                  backgroundGradientTo: '#000000',
                  color: () => 'white',
                  strokeWidth: 2,
                  propsForDots: { r: '0' },
                  propsForBackgroundLines: { strokeWidth: 0 },
                }}
                withHorizontalLabels={false}
                withVerticalLabels={false}
                withInnerLines={false}
                withOuterLines={false}
                withShadow={false}
                bezier
                style={styles.chart}
              />
            </View>
          )}
          <MotiView
              from={{ translateY: -10, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300 }}
              key={stock.price} 
            >
            <Text style={[styles.cardPrice, { color: stock.isGainer ? 'green' : 'red' }]}>
            {displayVolume ? `${formatNum(stock.volume)}` : `$${stock.price ? stock.price.toFixed(2) : 'N/A'}`}
            </Text>
          </MotiView>
          <Text style={[styles.cardPercent, { color: stock.isGainer ? 'green' : 'red' }]}>
            {stock.isGainer ? `+${stock.percent_change?.toFixed(2)}` : `${stock.percent_change?.toFixed(2)}`}%
          </Text>
        </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
  
export const CryptoCards = ({ cryptos, barDataCrypto, displayVolume }) => {
  const navigation = useNavigation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsWrapper}>
    {cryptos.map(crypto => (
      <TouchableOpacity
      key={crypto.symbol}
      style={styles.card}
      onPress={() => {
        const cryptoID = crypto.symbol.split('/')[0];
        console.log('symbol:::', crypto.symbol);
        console.log('ID:::', cryptoID);
        navigation.navigate('CryptoDetail', { cryptoID, cryptoSymbol: cryptoID });
      }}
    >
      <View key={crypto.symbol} style={styles.card}>
        <Text style={[styles.cardSymbol, { color: crypto.isGainer ? 'white' : 'white' }]}>
          {crypto.symbol}
        </Text>
        {barDataCrypto[crypto.symbol] && (
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: [],
                datasets: [
                  {
                    data: barDataCrypto[crypto.symbol],
                    color: () => (crypto.isGainer ? 'green' : 'red'),
                  },
                ],
              }}
              width={140}
              height={80}
              chartConfig={{
                backgroundColor: '#000000',
                backgroundGradientFrom: '#000000',
                backgroundGradientTo: '#000000',
                color: () => 'white',
                strokeWidth: 2,
                propsForDots: { r: '0' },
                propsForBackgroundLines: { strokeWidth: 0 },
              }}
              withHorizontalLabels={false}
              withVerticalLabels={false}
              withInnerLines={false}
              withOuterLines={false}
              withShadow={false}
              bezier
              style={styles.chart}
            />
          </View>
        )}
          <MotiView
              from={{ translateY: -10, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ type: 'timing', duration: 300 }}
              key={crypto.price}
              >
            <Text style={[styles.cardPrice, { color: crypto.isGainer ? 'green' : 'red' }]}>
              {displayVolume ? `${formatNum(crypto.volume)}` : `$${crypto.price ? crypto.price.toFixed(2) : 'N/A'}`}
            </Text>
          </MotiView>
          <Text style={[styles.cardPercent, { color: crypto.isGainer ? 'green' : 'red' }]}>
            {crypto.isGainer ? `+${crypto.percent_change?.toFixed(2)}` : `${crypto.percent_change?.toFixed(2)}`}%
          </Text>
      </View>
      </TouchableOpacity>
    ))}
    </ScrollView>
  ); 
};