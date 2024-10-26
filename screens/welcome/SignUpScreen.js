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
import GoogleSignUpButton from '../../assets/icons/googleSignIn';
import { GoogleSignin, statusCodes, } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: '413835240721-49h829u7ipn7pmr8tp1tnsbta3e5o33i.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  });

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

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signOut();
    
            // Retrieve user info from Google Sign-In
            const userInfo = await GoogleSignin.signIn();
    
            // Extract idToken and name
            const idToken = userInfo.idToken || (userInfo.data && userInfo.data.idToken);
    
            if (!idToken) {
                console.log('No ID token received');
                Alert.alert('Error', 'Failed to receive ID token. Please try again.');
                return;
            }
    
            // Use idToken to create Firebase credential and sign in
            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, googleCredential);
            const user = userCredential.user;

            const email = user.email;
            const name = user.displayName;
    
            // Store the user's name and email in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                username: name,
                email: email,
            });

            console.log('User signed in with Google and data saved to Firestore:', user);
    
        } catch (error) {
            console.error('Sign-In Error:', error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert('Error', 'Sign-in was cancelled.');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services are not available.');
            } else {
                Alert.alert('Error', 'An unknown error occurred during Google Sign-In.');
            }
        }
    };
    
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
                        <GoogleSignUpButton onPress={signIn} label="Sign up with Google"/>
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