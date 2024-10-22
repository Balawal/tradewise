import {View, Text, Image, TouchableOpacity, TextInput, Alert} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { db } from '../../config/firebase'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore'; 
import { MaterialIndicator } from 'react-native-indicators';
//import { GoogleSignin, statusCodes, } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//     webClientId: '413835240721-m5r9lq7deapq3esuti0un7fabt11l3du.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
   
//   });

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            setLoading(false);  
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            setLoading(false);
            return;
        }

        if (email && password && name) { // Ensure the name is also checked
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                setLoading(false);
    
                // Store username in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    username: name, // Store the username
                    email: user.email // Store the email (optional)
                });
    
                // Navigate to the next screen if needed
            } catch (err) {
                Alert.alert('Error', err.message);
                setLoading(false);
                return;
            } 
        } else {
            Alert.alert('Error', 'Please fill in all the fields.');
            setLoading(false);
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
        <View className="flex-1 bg-black">
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
                    <Image source={require('../../assets/icons/fix_logo.png')}
                        style={{width: 100, height: 100}} />
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
                        onPress={handleSubmit} 
                        style={[ 
                            { 
                                backgroundColor: '#ad93c8', 
                                borderRadius: 20, 
                                paddingVertical: 8, 
                                alignItems: 'center', 
                                borderWidth: 2, 
                                borderColor: '#ad93c8', 
                            }, 
                            loading && { borderWidth: 0, backgroundColor: 'white' } // Adjust the button style when loading
                        ]} 
                        disabled={loading}
                    >
                        {loading ? (
                            <MaterialIndicator color="black" />
                        ) : (
                            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Signup</Text>
                        )}
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
                <View className="flex-row justify-center mt-14">
                        <Text className="text-gray-500 font-semibold">Already have an account?</Text>
                        <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
                            <Text className="font-semibold text-[#ad93c8]"> Login</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    )
}