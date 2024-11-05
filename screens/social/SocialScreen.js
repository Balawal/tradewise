import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NewsScreen from './news/NewsScreen';
import TwitterScreen from './TwitterScreen';
import { NavigationContainer } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const Tab = createMaterialTopTabNavigator();

const SocialScreen = ({ navigation }) => {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: '#4d3465',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { 
            backgroundColor: '#000',
            paddingTop: 32,  
            height: 80,  
          },
          tabBarIndicatorStyle: { backgroundColor: '#4d3465' },
          tabBarIcon: ({ color }) => {
            let iconName;

            if (route.name === 'News') {
              iconName = 'newspaper'; 
            } else if (route.name === 'Twitter') {
              iconName = 'x-twitter'; 
            }

            return <FontAwesome6 name={iconName} size={24} color={color} />;
          },
          tabBarShowLabel: false, 
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