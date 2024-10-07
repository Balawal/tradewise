import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../config/firebase';
//import { GoogleSignin, statusCodes, } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//     webClientId: '413835240721-m5r9lq7deapq3esuti0un7fabt11l3du.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
   
//   });

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async ()=> {
        if(email && password){
            try{
                await createUserWithEmailAndPassword(auth, email, password);
            }catch(err){
                console.log('got error: ', err.message);
            }
        }
    }

    // const signIn = async () => {
    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const {idToken} = await GoogleSignin.signIn();
    //       const googleCredentials = GoogleAuthProvider.credential(idToken);
    //       await signInWithCredential(googleCredentials);
    //     } catch (error) {
    //         console.log('got error: ', error.message);
    //       if (isErrorWithCode(error)) {
    //         switch (error.code) {
    //           case statusCodes.IN_PROGRESS:
    //             // operation (eg. sign in) already in progress
    //             break;
    //           case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
    //             // Android only, play services not available or outdated
    //             break;
    //           default:
    //           // some other error happened
    //         }
    //       } else {
    //         // an error that's not related to google sign in occurred
    //       }
    //     }
    // };
    
    return(
        <View className="flex-1 bg-slate-950">
            <SafeAreaView className="flex">
                <View className="flex-row justify-start">
                    <TouchableOpacity
                        onPress={()=> navigation.goBack()}
                        style={{ marginLeft: 18 }}
                    >
                        <Icon name="arrow-back-ios" size="25" color="white" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                    <Image source={require('../../assets/icons/reading.png')}
                        style={{width: 165, height: 110}} />
                </View>
            </SafeAreaView>
            <View className="flex-1 bg-white px-8 pt-8"
                style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}
            >
                <View className="form space-y-2">
                    <Text className="text-gray-700 ml-4">Full Name</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                        value={name}
                        onChangeText={value=> setName(value)}
                        placeholder="Enter Name"
                    />
                    <Text className="text-gray-700 ml-4">Email Address</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                        value={email}
                        onChangeText={value=> setEmail(value)}
                        placeholder="Enter Email"
                    />
                    <Text className="text-gray-700 ml-4">Password</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
                        secureTextEntry
                        value={password}
                        onChangeText={value=> setPassword(value)}
                        placeholder="Enter Password"
                    />
                    <TouchableOpacity
                        className="py-3 bg-violet-950 rounded-xl"
                        onPress={handleSubmit}
                    >
                        <Text className="font-xl font-bold text-center text-gray-700">
                            Sign Up
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-xl text-gray-700 font-bold text-center py-5">
                    Or
                </Text>
                <View className="flex-row justify-center space-x-12">
                    
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image source={require('../../assets/icons/google.png')}
                            className="w-10 h-10" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image source={require('../../assets/icons/facebook.png')}
                            className="w-10 h-10" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image source={require('../../assets/icons/apple-logo.png')}
                            className="w-10 h-10" />
                    </TouchableOpacity>
                
                </View>
                <View className="flex-row justify-center mt-7">
                        <Text className="text-gray-500 font-semibold">Already have an account?</Text>
                        <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                            <Text className="font-semibold text-violet-950"> Login</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    )
}