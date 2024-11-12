import React from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useWatchList from '../../hooks/watchlist/useWatchList';
import { WatchListItem } from '../../components/watchlist/watchListItem';
import { EmptyMessage } from '../../styles/components/emptyMessage';
import { watchListScreenStyles as styles } from '../../styles/watchListStyles';
import useAuth from '../../hooks/firebase/useAuth';

const WatchlistScreen = () => {
  const watchList = useWatchList();
  const navigation = useNavigation();
  const { user: authUser } = useAuth();

  const renderWatchListItem = ({ item }) => {
    return(
      <WatchListItem
        item={item}
        onPress={() => {
          if (item.type === 'stock') {
            console.log('Navigating to Calculator with:', item.symbol, item.name);
            navigation.navigate('Calculator', { symbol: item.symbol, name: item.name });
          } else {
            Alert.alert('Oops!', 'The calculator is not available for cryptos yet. Keep checking back for more updates!');
          }
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Watchlist</Text>
      <FlatList
        data={watchList}
        keyExtractor={(item) => item.symbol}
        renderItem={renderWatchListItem}
        ListEmptyComponent={
          <EmptyMessage 
            message={authUser ? "Explore stocks and crypto to create your own personalized watchlist!" : "Sign up to explore stocks and crypto and create your own personalized watchlist!"} 
          />
        }
        contentContainerStyle={watchList.length === 0 ? styles.emptyListContainer : styles.listContainer}
      />
    </View>
  );
};

export default WatchlistScreen;