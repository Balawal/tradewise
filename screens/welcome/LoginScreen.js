import {View, Text, Image, TouchableOpacity, TextInput, Alert} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { MaterialIndicator } from 'react-native-indicators';
import GoogleSignUpButton from '../../assets/icons/googleSignIn';
import { GoogleSignin, statusCodes, } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: '413835240721-49h829u7ipn7pmr8tp1tnsbta3e5o33i.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  });

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async () => {
        setLoading(true);

        if(email && password){
            try{
                await signInWithEmailAndPassword(auth, email, password);
                setLoading(false);
            }catch(err){
                if (err.code === 'auth/invalid-credential') {
                    Alert.alert('Error', 'The email address and/or password are incorrect.');
                }
                setLoading(false);
                return;
            }
        } else {
            Alert.alert('Error', 'Please enter your email and password.');
            setLoading(false);
        }
    }

    const handleForgotPassword = async () => {
        // Prompt the user for their email address
        Alert.prompt(
            'Reset Password',
            'Please enter your email address:',
            async (inputEmail) => {
                if (inputEmail) {
                    try {
                        await sendPasswordResetEmail(auth, inputEmail);
                        Alert.alert('Password Reset Email Sent', 'Please check your email for further instructions.');
                    } catch (error) {
                        Alert.alert('Error', error.message);
                    }
                }
            },
            'plain-text',
            '',
            'email'
        );
    };

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
                        <Icon name="arrow-back-ios" size="25" color="white"/>
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                    <Image source={require('../../assets/icons/fix_logo.png')}
                        style={{width: 120, height: 120}} />
                </View>
            </SafeAreaView>
            <View className="flex-1 bg-white px-8 pt-8"
                style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}
            >
                <View className="form space-y-2">
                    <Text className="text-gray-700 ml-4">Email Address</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                        value={email}
                        onChangeText={value=> setEmail(value)}
                        placeholder="Enter Email"
                    />
                    <Text className="text-gray-700 ml-4">Password</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
                        secureTextEntry
                        value={password}
                        onChangeText={value=> setPassword(value)}
                        placeholder="Enter Password"
                    />
                    <TouchableOpacity 
                        onPress={handleForgotPassword} 
                        className="flex items-end mb-5"
                    >
                        <Text className="text-gray-700">Forgot Password?</Text>
                    </TouchableOpacity>
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
                            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Login</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <Text className="text-xl text-gray-700 font-bold text-center py-5">
                    Or
                </Text>
                <View className="flex-row justify-center space-x-12">
                    <GoogleSignUpButton onPress={signIn} label="Log in with Google"/>
                </View>
                <View className="flex-row justify-center mt-14">
                        <Text className="text-gray-500 font-semibold">Don't have an account?</Text>
                        <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}>
                            <Text className="font-semibold text-[#ad93c8]"> Sign Up</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        </View>
    )
}