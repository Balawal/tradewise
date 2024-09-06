import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons'; // Import icons from Expo

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TwitterScreen from '../screens/TwitterScreen';
import NewsScreen from '../screens/NewsScreen';
import SocialScreen from '../screens/SocialScreen';
import SearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();

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
                    } else if (route.name === 'Search') {
                        iconName = 'search';
                        return <FontAwesome5 name={iconName} size={24} color={color} />;
                    } else if (route.name === 'Messages') {
                        return <Ionicons name="chatbox-ellipses-sharp" size={24} color={color} />;
                    } else if (route.name === 'Settings') {
                        return <Feather name="user" size={24} color={color} />;
                    }
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Cash" component={SettingsScreen}/>
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Messages" component={SocialScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;