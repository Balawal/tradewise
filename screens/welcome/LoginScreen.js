import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GoogleSignUpButton from '../../assets/icons/googleSignIn';
import useAuthLogin from '../../hooks/welcome/useAuthLogin';
import { LoadingIndicator } from '../../styles/components/loadingIndicator';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import { getAuth, OAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function LoginScreen() {
    const navigation = useNavigation();
    const { loading, login, forgotPassword, googleSignIn } = useAuthLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async () => {
        await login(email, password);
    };

    const handleForgotPassword = () => {
        Alert.prompt(
          'Reset Password',
          'Please enter your email address:',
          (inputEmail) => {
            if (inputEmail) {
              forgotPassword(inputEmail);
            }
          },
          'plain-text',
          '',
          'email'
        );
      };
    
      const onAppleButtonPress = async () => {
        try {
            // Perform the Apple sign-in request
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            });

            // Ensure Apple returned a user identityToken
            if (!appleAuthRequestResponse.identityToken) {
                throw new Error('Apple Sign-In failed - no identity token returned');
            }

            const { identityToken, nonce, email } = appleAuthRequestResponse;

            // Create an Apple credential for Firebase
            const provider = new OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: identityToken,
                rawNonce: nonce,
            });

            // Sign in with the credential
            const auth = getAuth();
            const userCredential = await signInWithCredential(auth, credential);

            // Retrieve the name and email if they are available
            const username = 'Loading...';
            const userEmail = email || userCredential.user.email;

            // Save the user data to Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                username: username,
                email: userEmail || 'Unknown',
            });

            console.log('Apple sign-in complete!');
        } catch (error) {
            console.log(error.message);
            Alert.alert('Apple Sign-In Error', error.message);
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
                        <Icon name="arrow-back-ios" size={25} color="white" style={{ fontSize: 25 }} />
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
                            loading && { borderWidth: 0, backgroundColor: 'white' }
                        ]} 
                        disabled={loading}
                    >
                        {loading ? (
                            <LoadingIndicator color="black" />
                        ) : (
                            <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Login</Text>
                        )}
                    </TouchableOpacity>
                </View>
                <Text className="text-xl text-gray-700 font-bold text-center py-5">
                    Or
                </Text>
                <View className="flex-row justify-center space-x-12">
                    <GoogleSignUpButton onPress={googleSignIn} label="Sign in with Google"/>
                </View>
                <View className="flex-row justify-center space-x-12 mt-4">
                    <AppleButton
                        buttonStyle={AppleButton.Style.WHITE}
                        buttonType={AppleButton.Type.LOG_IN}
                        style={{ width: 160, height: 40 }}
                        onPress={onAppleButtonPress}
                    />
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