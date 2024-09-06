import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useState, useEffect } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SearchScreen from '../screens/SearchScreen';
import LottieView from 'lottie-react-native';
import useAuth from '../hooks/useAuth';
import BottomTabNavigation from './bottomTabNavigation';
import { useStockWebSocket, closeStockWebSocket, useCryptoWebSocket, closeCryptoWebSocket } from '../components/WebSocketManager';
import NewsDetailScreen from '../screens/NewsDetailScreen';
import StockDetailScreen from '../screens/StockDetailScreen';

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
    const { isConnected } = useStockWebSocket();
    const { isConnectedCrypto } = useCryptoWebSocket();
    

    useEffect(() => {
      setTimeout(() => {
      setIsReady(true);
      }, 10000);

      return () => {
        closeStockWebSocket(); 
        closeCryptoWebSocket();
      };
    }, []);

    /*
    if (!isReady) {
        return <SplashScreen />;
    }
    */

    return (
      <NavigationContainer>
          {user ? (
              // If user is authenticated, show the BottomTabNavigation
          <Stack.Navigator>
            <Stack.Screen name="Done" component={BottomTabNavigation} options={{ headerShown: false }}/>
            <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ headerStyle: {backgroundColor: '#000000', }, headerTintColor: '#ffffff', }} />
            <Stack.Screen name="StockDetail" component={StockDetailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
          ) : (
              // If user is not authenticated, show the Welcome/Login/SignUp screens
              <Stack.Navigator initialRouteName='Welcome'>
                  <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
                  <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
                  <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                  <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ headerTitle: 'News Details' }} />
                  <Stack.Screen name="StockDetail" options={{ headerShown: false }} component={StockDetailScreen} />
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
      backgroundColor: '#f5bc42',
    },
    animation: {
      width: 150,
      height: 150,
    },
  });