import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WatchlistScreen from '../screens/watchlist/WatchListScreen';
import CalculatorScreen from '../screens/calculator/CalculatorScreen';

const Stack = createNativeStackNavigator();

const WatchListStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WatchList" component={WatchlistScreen} />
      <Stack.Screen name="Calculator" component={CalculatorScreen} />
    </Stack.Navigator>
  );
};

export default WatchListStackNavigator;