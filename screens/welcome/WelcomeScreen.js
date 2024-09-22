import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView className="flex-1 bg-slate-950" >
            <View className="flex-1 flex justify-around my-4">
                <Text
                    className="text-white font-bold text-4xl text-center">
                    Let's get started!
                </Text>
                <View className="flex-row justify-center">
                    <Image source={require('../../assets/icons/reading.png')}
                        style={{width: 250, height: 250}} />
                </View>
                <View className="space-y-4">
                    <TouchableOpacity
                    onPress={()=> navigation.navigate('SignUp')}
                        className="py-3 bg-sky-700 mx-7 rounded-xl">
                            <Text 
                                className="text-xl font-bold text-center text-slate-950"
                            >
                                Sign Up
                            </Text>
                    </TouchableOpacity>
                    <View className="flex-row justify-center">
                        <Text className="text-white font-semibold">Already have an account?</Text>
                        <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                            <Text className="font-semibold text-sky-700"> Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}