import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const StockTicker = ({ stocks }) => {
  const renderItem = ({ item }) => (
    <View style={styles.stockItem}>
      <Text style={styles.symbol}>{item.symbol}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );

  return (
    <FlatList
      data={stocks}
      horizontal
      keyExtractor={(item) => item.symbol}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  stockItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  symbol: {
    fontWeight: 'bold',
  },
  price: {
    color: 'green',
  },
});

export default StockTicker;