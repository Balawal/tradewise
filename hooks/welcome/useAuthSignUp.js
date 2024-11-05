import { useState } from 'react';
import { Alert } from 'react-native';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '@env';

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
});

export const useAuthSignUp = () => {
    const [loading, setLoading] = useState(false);

    const signUpWithEmail = async (name, email, password) => {
        setLoading(true);
        try {
            if (password.length < 6) {
                Alert.alert('Error', 'Password must be at least 6 characters long.');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                Alert.alert('Error', 'Please enter a valid email address.');
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', userCredential.user.uid), { username: name, email });
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signOut();

            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.idToken || (userInfo.data && userInfo.data.idToken);

            if (!idToken) throw new Error('No ID token received.');

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, googleCredential);
            await setDoc(doc(db, 'users', userCredential.user.uid), { username: userCredential.user.displayName, email: userCredential.user.email });
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert('Error', 'Sign-in was cancelled.');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Error', 'Google Play Services are not available.');
            } else {
                Alert.alert('Error', 'An unknown error occurred during Google Sign-In.');
            }
        }
    };

    return { signUpWithEmail, signInWithGoogle, loading };
};