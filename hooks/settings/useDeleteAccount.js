import { useState } from 'react';
import { getAuth, deleteUser } from "firebase/auth";
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const useDeleteAccount = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;

    const deleteUserAccount = async () => {
        setLoading(true);

        if (!user) {
            Alert.alert('Error', 'No user logged in.');
            setLoading(false);
            return;
        }

        try {
            await deleteUser(user);
            Alert.alert('Success!', 'Account deleted successfully.');
            console.log("User deleted successfully.");
            navigation.navigate('Welcome');
        } catch (error) {
            console.error("Error deleting user:", error);
            if (error.code === 'auth/requires-recent-login') {
                Alert.alert('Error', 'Please re-login and try again.');
            } else {
                Alert.alert('Error', error.message);
            }
        } finally {
            setLoading(false);
        }
        
    };

    return { deleteUserAccount, loading };
};

export default useDeleteAccount;