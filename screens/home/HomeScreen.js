import React from 'react';
import { View, StyleSheet} from 'react-native';
import MostActive from '../../components/home/mostActive';
import TopMovers from '../../components/home/topMovers';

const HomeScreen = () => {
  return (
        <View style={styles.container}>
        <TopMovers />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
    backgroundColor: '#000000', 
    zIndex: 1000,

  },
});

export default HomeScreen;