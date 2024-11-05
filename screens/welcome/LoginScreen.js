import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GoogleSignUpButton from '../../assets/icons/googleSignIn';
import useAuthLogin from '../../hooks/welcome/useAuthLogin';
import { LoadingIndicator } from '../../styles/components/loadingIndicator';

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
                    <GoogleSignUpButton onPress={googleSignIn} label="Log in with Google"/>
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