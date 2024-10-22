import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons'; // Import icons from Expo

import HomeScreen from '../screens/home/HomeScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import TwitterScreen from '../screens/social/TwitterScreen';
import NewsScreen from '../screens/social/news/NewsScreen';
import SocialScreen from '../screens/social/SocialScreen';
import SearchScreen from '../screens/SearchScreen';
import WatchListScreen from '../screens/watchlist/WatchListScreen';
import WatchListStackNavigator from './watchListCalculator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StockDetailScreen from '../screens/home/stocks/StockDetailScreen';
import CryptoDetailScreen from '../screens/home/crypto/CryptoDetailScreen';
import SettingsStackNavigator from './settingsNavigation';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// Stack Navigator for Home and Detail Screens
const HomeStackNavigator = () => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="StockDetail" component={StockDetailScreen} options={{ headerShown: false }} />
            <HomeStack.Screen name="CryptoDetail" component={CryptoDetailScreen} options={{ headerShown: false }} />
        </HomeStack.Navigator>
    );
};

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#6c757d',
                tabBarShowLabel: false,
                tabBarStyle: {
                    paddingHorizontal: 20,
                    borderTopColor: 'transparent',
                    backgroundColor: '#000000',
                },
                tabBarIcon: ({ color }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'chart-area';
                        return <FontAwesome5 name={iconName} size={24} color={color} />;
                    } else if (route.name === 'Cash') {
                        iconName = 'wallet';
                        return <FontAwesome5 name={iconName} size={24} color={color} />;
                    // } else if (route.name === 'Notifications') {
                    //     iconName = 'bell';
                    //     return <FontAwesome5 name={iconName} size={24} color={color} />;
                    } else if (route.name === 'Social') {
                        return <Ionicons name="chatbox-ellipses-sharp" size={24} color={color} />;
                    } else if (route.name === 'Settings') {
                        return <Feather name="user" size={24} color={color} />;
                    }
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Cash" component={WatchListStackNavigator}/>
            {/* <Tab.Screen name="Notifications" component={SearchScreen} /> */}
            <Tab.Screen name="Social" component={SocialScreen} />
            <Tab.Screen name="Settings" component={SettingsStackNavigator} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;