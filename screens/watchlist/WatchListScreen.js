import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { collection, onSnapshot } from "firebase/firestore"; 
import { db } from '../../config/firebase'; 
import LastPrice from '../../components/stockdetails/lastPrice';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

const WatchlistScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/watchList`), (snapshot) => {
      const updatedFavorites = snapshot.docs.map(doc => doc.data());
      setFavorites(updatedFavorites);
      console.log("Real-time watchlist data::: ", updatedFavorites);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  const renderFavoriteItem = ({ item }) => {

    const shortName = item.name.length > 25 ? `${item.name.slice(0, 25)}...` : item.name;

    return(
      <TouchableOpacity onPress={() => {
        console.log('Navigating to Calculator with:', item.symbol, item.name);
        navigation.navigate('Calculator', { symbol: item.symbol, name: item.name })}}>
        <View style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.symbol}>{item.symbol}</Text>
            <Text style={styles.name}>{shortName}</Text>
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
  };

  const renderEmptyMessage = () => (
    <View style={styles.emptyMessageContainer}>
      <Text style={styles.emptyMessage}>Explore stocks and crypto to create your own personalized watchlist!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Watchlist</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.symbol}
        renderItem={renderFavoriteItem}
        ListEmptyComponent={renderEmptyMessage}
        contentContainerStyle={favorites.length === 0 ? styles.emptyListContainer : styles.listContainer}
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
      emptyListContainer: {
        flexGrow: 1, // Allows the container to expand and center content
        justifyContent: 'center', // Centers the empty message vertically
        alignItems: 'center', // Centers the empty message horizontally
    },
    listContainer: {
        paddingBottom: 50, // Add some padding to the bottom of the list
    },
    emptyMessageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    emptyMessage: {
        color: '#ab9db8',
        fontSize: 15,
        textAlign: 'center',
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