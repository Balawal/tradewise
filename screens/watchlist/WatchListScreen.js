import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../../config/firebase'; 

const WatchlistScreen = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const querySnapshot = await getDocs(collection(db, "watchList"));
      const favorites = [];
      querySnapshot.forEach((doc) => {
        favorites.push(doc.data());
      });
      setFavorites(favorites);
    };

    fetchFavorites();
  }, []);

  const renderFavoriteItem = ({ item }) => (
    <View>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <View style={styles.separator} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.symbol}
        renderItem={renderFavoriteItem}
        ListHeaderComponent={() => (
          <Text style={styles.header}>Watchlist</Text>
        )}
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
        marginBottom: 20,
        marginTop: 40,
        marginLeft: 15
      },
      subHeader: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 30,
        marginLeft: 15
      },
      card: {
        flexDirection: 'row', // Align items in a row
        justifyContent: 'space-between', // Push price to the other end
        alignItems: 'center', // Center align vertically
        padding: 8,
        marginHorizontal: 15,
        borderRadius: 8,  
      },
      info: {
        flexDirection: 'column', // Stack symbol and name vertically
      },
      symbol: {
        color: 'white',          
        fontSize: 20,     
      },
      name: {
        color: 'grey',         
        fontSize: 13,
      },
      price: {
        color: 'white',         
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