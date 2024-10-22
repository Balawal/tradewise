import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 flex justify-around my-4">
        <Text className="text-white font-bold text-3xl text-center">
          Welcome
        </Text>
        <View className="flex-row justify-center">
          <Image
            source={require('../../assets/icons/fix_logo.png')}
            style={{ width: 120, height: 120 }}
          />
        </View>
        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className="py-2 bg-black mx-7 rounded-2xl border-2 border-[#ad93c8]"
          >
            <Text className="text-base font-bold text-center text-[#ad93c8]">
              Sign Up
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center">
            <Text className="text-white font-semibold">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="font-semibold text-[#ad93c8]"> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}