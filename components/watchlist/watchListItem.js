import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import LastPrice from '../home/stockdetails/lastPrice';
import { watchListItemStyles as styles } from '../../styles/watchListStyles';

export const WatchListItem = ({ item, onPress }) => {
  const shortName = item.name.length > 25 ? `${item.name.slice(0, 25)}...` : item.name;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.name}>{shortName}</Text>
        </View>
        {item.type === 'stock' ? (
          <LastPrice stockSymbol={item.symbol} containerStyle={styles.priceContainer} textStyle={styles.price}/>
        ) : (
          <MotiView
            from={{ translateY: -10, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{ type: 'timing', duration: 300 }}
            key={item.price} 
          >
            <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
          </MotiView>
        )}
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );
};

export default WatchListItem;