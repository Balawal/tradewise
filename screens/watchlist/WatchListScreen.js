import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from "firebase/firestore"; 
import { db } from '../../config/firebase'; 
import LastPrice from '../../components/stockdetails/lastPrice';
import { useNavigation } from '@react-navigation/native';

const WatchlistScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "watchList"), (snapshot) => {
      const updatedFavorites = snapshot.docs.map(doc => doc.data());
      setFavorites(updatedFavorites);
      console.log("Real-time watchlist data::: ", updatedFavorites);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
            console.log('Navigating to Calculator with:', item.symbol, item.name);
            navigation.navigate('Calculator', { symbol: item.symbol, name: item.name })}}>
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        {item.type === 'stock' ? (
          // Render the LastPrice component for stocks
          <LastPrice stockSymbol={item.symbol} containerStyle={styles.priceContainer} textStyle={styles.price}/>
        ) : (
          // Render static price for crypto
          <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
        )}
      </View>
      <View style={styles.separator} />
      </TouchableOpacity>
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
      priceContainer: {
        alignItems: 'flex-end', // Align the price to the end
        width: 100, // Optional: adjust this width based on your design
      },
  });  

export default WatchlistScreen;