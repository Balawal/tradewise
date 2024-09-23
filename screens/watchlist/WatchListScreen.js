import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../../config/firebase'; 

const WatchlistScreen = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const querySnapshot = await getDocs(collection(db, "favorites"));
      const favoriteStocks = [];
      querySnapshot.forEach((doc) => {
        favoriteStocks.push(doc.data());
      });
      setFavorites(favoriteStocks);
    };

    fetchFavorites();
  }, []);

  const renderStockItem = ({ item }) => (
    <View>
      <View style={styles.stockCard}>
        <Text style={styles.stockSymbol}>{item.stockSymbol}</Text>
        <Text style={styles.stockName}>{item.stockName}</Text>
        <Text style={styles.stockPrice}>{item.stockPrice}</Text>
      </View>
      <View style={styles.separator} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Watchlist</Text>
      <Text style={styles.subHeader}>Your personalized stocks and crypto at a glance.</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.stockSymbol}
        renderItem={renderStockItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', 
        paddingTop: 20,
      },
      header: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 40,
        marginLeft: 15
      },
      subHeader: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 20,
        marginLeft: 15
      },
      stockCard: {
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 8,         
      },
      stockSymbol: {
        color: 'white',          
        fontSize: 18,
        fontWeight: 'bold',      
      },
      stockName: {
        color: 'grey',         
        fontSize: 16,
      },
      stockPrice: {
        color: 'green',         
        fontSize: 16,
      },
      separator: {
        height: 1,
        backgroundColor: '#111', 
        marginVertical: 10,
        marginHorizontal: 15,
      },
  });  

export default WatchlistScreen;