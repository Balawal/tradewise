import { View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/welcome/LoginScreen';
import SignUpScreen from '../screens/welcome/SignUpScreen';
import WelcomeScreen from '../screens/welcome/WelcomeScreen';
import LottieView from 'lottie-react-native';
import useAuth from '../hooks/firebase/useAuth';
import BottomTabNavigation from './bottomTabNavigation';
import NewsDetailScreen from '../screens/social/news/NewsDetailScreen';
import StockDetailScreen from '../screens/home/StockDetailScreen';
import CryptoDetailScreen from '../screens/home/CryptoDetailScreen';
import WatchListScreen from '../screens/watchlist/WatchListScreen';
import CalculatorScreen from '../screens/calculator/CalculatorScreen';
import DeleteAccountScreen from '../screens/settings/DeleteAccountScreen';
import ChangePasswordScreen from '../screens/settings/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const SplashScreen = () => (
    <View style={styles.container}>
      <LottieView 
        source={require('../assets/icons/charging_bull.json')}
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
      <Stack.Navigator>
        {/* Allow access to Welcome, SignUp, and Login screens */}
        {!user && (
          <>
            <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
            <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
            <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
          </>
        )}

        {/* Main app navigation, accessible for both authenticated and guest users */}
        <Stack.Screen name="Done" component={BottomTabNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ headerStyle: { backgroundColor: '#000000' }, headerTintColor: '#ffffff' }} />
        <Stack.Screen name="StockDetail" component={StockDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CryptoDetail" component={CryptoDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="WatchList" component={WatchListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ad93c8', },
    animation: { width: 250, height: 250, },
  });