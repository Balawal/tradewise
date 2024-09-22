import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

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

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle
  while (currentIndex !== 0) {
    // Pick a remaining element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap it with the current element
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};


export const StockCards = ({ stocks, barData, displayVolume }) => {
    const navigation = useNavigation();

    return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsWrapper}>
      {stocks.map(stock => (
        <TouchableOpacity
          key={stock.symbol}
          style={styles.card}
          onPress={() => {
            // Navigate to the StockDetail screen and pass the stock symbol
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
          <Text style={[styles.cardPrice, { color: stock.isGainer ? 'green' : 'red' }]}>
          {displayVolume ? `${formatNum(stock.volume)}` : `$${stock.price ? stock.price.toFixed(2) : 'N/A'}`}
          </Text>
          <Text style={[styles.cardPercent, { color: stock.isGainer ? 'green' : 'red' }]}>
            {stock.isGainer ? `+${stock.percent_change?.toFixed(2)}` : `${stock.percent_change?.toFixed(2)}`}%
          </Text>
        </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
  
export const CryptoCards = ({ cryptos, barDataCrypto }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsWrapper}>
    {cryptos.map(crypto => (
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
        <Text style={[styles.cardPrice, { color: crypto.isGainer ? 'green' : 'red' }]}>
          ${crypto.price ? crypto.price.toFixed(2) : 'N/A'}
        </Text>
        <Text style={[styles.cardPercent, { color: crypto.isGainer ? 'green' : 'red' }]}>
          {crypto.isGainer ? `+${crypto.percent_change?.toFixed(2)}` : `${crypto.percent_change?.toFixed(2)}`}%
        </Text>
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 12,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#000000',
        padding: 20,
    },
    contentContainer: {
        flexGrow: 1,
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
        marginTop: 40
    },
    subHeader: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 20,
    },
    handleIndicator: {
        backgroundColor: '#888', // Set the handle color to gray
        width: 50, // Adjust the width if needed
        height: 5,  // Adjust the height if needed
        borderRadius: 5,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#313133', // Gray background for the search bar
        borderRadius: 10,
        padding: 8,
        marginBottom: 24
    },
    searchIconBar: {
        marginRight: 10, // Space between the icon and the input
    },
    searchIcon: {
        position: 'absolute',
        top: 63, 
        right: 20,
        zIndex: 1,
    },
    bottomSheetBackground: {
        borderRadius: 30,
        backgroundColor: '#080813', // Black background for the bottom sheet
    },
    searchContainer: {
        backgroundColor: '#080813',
        padding: 18,
        flexDirection: 'column',
        flex: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#fff',  // Set text color to white
    },
    resultsContainer: {
        //marginTop: 10,
        flex: 1,
    },
    resultItem: {
        //padding: 5,
    },
    resultSymbol: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5
    },
    resultName: {
        fontSize: 14,
        color: '#888',
    },
    clearButton: {
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#111',
        marginVertical: 20,
    },
    noResultsText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    }
});