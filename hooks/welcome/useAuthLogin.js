import { useState } from 'react';
import { Alert } from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { auth } from '../../config/firebase';
import { WEB_CLIENT_ID } from '@env';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

const useAuthLogin = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        if (err.code === 'auth/invalid-credential') {
          Alert.alert('Error', 'The email address and/or password are incorrect.');
        }
      }
    } else {
      Alert.alert('Error', 'Please enter your email and password.');
    }
    setLoading(false);
  };

  const forgotPassword = async (inputEmail) => {
    try {
      await sendPasswordResetEmail(auth, inputEmail);
      Alert.alert('Password Reset Email Sent', 'Please check your email for further instructions.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken || (userInfo.data && userInfo.data.idToken);

      if (!idToken) {
        Alert.alert('Error', 'Failed to receive ID token. Please try again.');
        return;
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Error', 'Sign-in was cancelled.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services are not available.');
      } else {
        console.log(error);
        Alert.alert('Error', 'An unknown error occurred during Google Sign-In.');
      }
    }
  };

  return { loading, login, forgotPassword, googleSignIn };
};

export default useAuthLogin;