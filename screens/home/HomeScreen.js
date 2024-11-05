import React from 'react';
import { View } from 'react-native';
import TopMovers from '../../components/home/topMovers';
import { homeScreenStyles as styles } from '../../styles/homeStyles';

const HomeScreen = () => {
  return (
        <View style={styles.container}>
        <TopMovers />
      </View>
  );
};

export default HomeScreen;