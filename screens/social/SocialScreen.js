import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NewsScreen from './news/NewsScreen';
import TwitterScreen from './TwitterScreen';
import NewsDetailScreen from './news/NewsDetailScreen';
import { NavigationContainer } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const Tab = createMaterialTopTabNavigator();

const SocialScreen = ({ navigation }) => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#1DA1F2',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { 
            backgroundColor: '#000',
            paddingTop: 32,  // Adjust this value to move the tabs lower
            height: 80,  // Adjust height as necessary
          },
          tabBarIndicatorStyle: { backgroundColor: '#1DA1F2' },
          tabBarIcon: ({ color }) => {
            let iconName;

            if (route.name === 'News') {
              iconName = 'newspaper'; // FontAwesome icon name for news
            } else if (route.name === 'Twitter') {
              iconName = 'x-twitter'; // FontAwesome icon name for Twitter
            }

            return <FontAwesome6 name={iconName} size={24} color={color} />;
          },
          tabBarShowLabel: false, // Hide the label and show only the icon
        })}
      >
        <Tab.Screen name="News">
          {() => <NewsScreen navigation={navigation} />}
        </Tab.Screen>
        <Tab.Screen name="Twitter" component={TwitterScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default SocialScreen;