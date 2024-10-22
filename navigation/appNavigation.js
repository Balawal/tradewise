import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/home/HomeScreen';
import LoginScreen from '../screens/welcome/LoginScreen';
import SignUpScreen from '../screens/welcome/SignUpScreen';
import WelcomeScreen from '../screens/welcome/WelcomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LottieView from 'lottie-react-native';
import useAuth from '../hooks/useAuth';
import BottomTabNavigation from './bottomTabNavigation';
import { useStockWebSocket, closeStockWebSocket, useCryptoWebSocket, closeCryptoWebSocket, useLatestTradeStocksWebSocket, closeLatestTradeStocksWebSocket } from '../components/websocket/WebSocketManager';
import NewsDetailScreen from '../screens/social/news/NewsDetailScreen';
import StockDetailScreen from '../screens/home/stocks/StockDetailScreen';
import CryptoDetailScreen from '../screens/home/crypto/CryptoDetailScreen';
import WatchListScreen from '../screens/watchlist/WatchListScreen';
import CalculatorScreen from '../screens/calculator/CalculatorScreen';
import DeleteAccountScreen from '../screens/settings/DeleteAccountScreen';
import ChangePasswordScreen from '../screens/settings/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const SplashScreen = () => (
    <View style={styles.container}>
      <LottieView 
        source={require('../assets/icons/lottie-splash-animation.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
);

export default function AppNavigation() {
    const [isReady, setIsReady] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
      setTimeout(() => {
      setIsReady(true);
      }, 10000);

      return () => {
      };
    }, []);

    if (!isReady) {
        return <SplashScreen />;
    }
    
    return (
      <NavigationContainer>
          {user ? (
              // If user is authenticated, show the BottomTabNavigation
          <Stack.Navigator>
            <Stack.Screen name="Done" component={BottomTabNavigation} options={{ headerShown: false }}/>
            <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ headerStyle: {backgroundColor: '#000000', }, headerTintColor: '#ffffff', }} />
            <Stack.Screen name="StockDetail" component={StockDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CryptoDetail" component={CryptoDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WatchList" component={WatchListScreen} options={{headerShown: false}} />
            <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
          ) : (
              // If user is not authenticated, show the Welcome/Login/SignUp screens
              <Stack.Navigator initialRouteName='Welcome'>
                  <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
                  <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
                  <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                  <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ headerTitle: 'News Details' }} />
                  <Stack.Screen name="StockDetail" options={{ headerShown: false }} component={StockDetailScreen} />
                  <Stack.Screen name="CryptoDetail" options={{ headerShown: false }} component={CryptoDetailScreen} />
                  <Stack.Screen name="WatchList" component={WatchListScreen} options={{headerShown: false}} />
                  <Stack.Screen name="Calculator" options={{ headerShown: false }} component={CalculatorScreen} />
                  <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
              </Stack.Navigator>
          )}
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ad93c8',
    },
    animation: {
      width: 150,
      height: 150,
    },
  });