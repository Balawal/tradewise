import { useState } from 'react';
import { Alert } from 'react-native';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const useChangePassword = () => {
    const [loading, setLoading] = useState(false);

    const changePassword = async (oldPassword, newPassword, confirmPassword, navigation) => {
        setLoading(true);
        const auth = getAuth();
        const user = auth.currentUser;

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            setLoading(false);
            return;
        }

        if (!user) {
            Alert.alert('Error', 'No user logged in.');
            setLoading(false);
            return;
        }

        const credential = EmailAuthProvider.credential(user.email, oldPassword);

        try {
            await reauthenticateWithCredential(user, credential);
            console.log('Reauthentication successful');

            await updatePassword(user, newPassword);
            Alert.alert('Success!', 'Password updated successfully.');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating password:', error);

            if (error.code === 'auth/wrong-password') {
                Alert.alert('Error', 'The old password you entered is incorrect.');
            } else if (error.code === 'auth/requires-recent-login') {
                Alert.alert('Error', 'Please re-login and try again.');
            } else {
                Alert.alert('Error', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return { changePassword, loading };
};

export default useChangePassword;