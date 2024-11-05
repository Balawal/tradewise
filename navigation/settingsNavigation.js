import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/settings/SettingsScreen';
import DeleteAccountScreen from '../screens/settings/DeleteAccountScreen';
import ChangePasswordScreen from '../screens/settings/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

const SettingsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default SettingsStackNavigator;