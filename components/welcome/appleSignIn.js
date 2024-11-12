import React from 'react';
import { Alert } from 'react-native';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { getAuth, OAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function AppleSignIn() {
    const onAppleButtonPress = async () => {
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            });

            if (!appleAuthRequestResponse.identityToken) {
                throw new Error('Apple Sign-In failed - no identity token returned');
            }

            const { identityToken, nonce, email } = appleAuthRequestResponse;

            const provider = new OAuthProvider('apple.com');
            const credential = provider.credential({
                idToken: identityToken,
                rawNonce: nonce,
            });

            const auth = getAuth();
            const userCredential = await signInWithCredential(auth, credential);

            const username = 'Loading...';
            const userEmail = email || userCredential.user.email;

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

    return (
        <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_UP}
            style={{ width: 160, height: 40 }}
            onPress={onAppleButtonPress}
        />
    );
}