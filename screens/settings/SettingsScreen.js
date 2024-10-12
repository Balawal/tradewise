import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function HomeScreen() {
    const handleLogout = async() =>{
        await signOut(auth);
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }} className="flex-1 justify-center items-center">
          <Text style={{ color: '#fff' }} className="text-lg">Settings Page</Text>
          <TouchableOpacity onPress={handleLogout} className="p-1 bg-red-400 rounded-lg mt-4">
              <Text className="text-white text-lg font-bold">Logout</Text>
          </TouchableOpacity>
      </SafeAreaView>
  )
}