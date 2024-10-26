import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIndicator } from 'react-native-indicators';
import { useNavigation } from '@react-navigation/native';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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
        Alert.alert('Success', 'Password updated successfully.');
        navigation.goBack();  
    } catch (error) {
        console.error('Error updating password:', error);

        if (error.code === 'auth/wrong-password') {
            Alert.alert('Error', 'The old password you entered is incorrect.');
            setLoading(false); 
        } else if (error.code === 'auth/requires-recent-login') {
            Alert.alert('Error', 'Please re-login and try again.');
            setLoading(false); 
        } else {
            Alert.alert('Error', error.message);
            setLoading(false); 
        }
    } finally {
        setLoading(false); 
    }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Icon name="arrow-back-ios" size={23} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Change Password</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Old password</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#ab9db8"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New password</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#ab9db8"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm new password</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#ab9db8"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity 
            style={[styles.submitButton, loading && styles.loadingButton]} 
            onPress={handleSubmit} 
            disabled={loading}
            >
            {loading ? (
                <MaterialIndicator color="white" />
            ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 16,  // Keep the back button on the left
    top: 53,   // Adjust top position if needed for alignment
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 32
  },
  form: {
    padding: 16,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#312c35',  // Updated background color
    borderColor: '#302938',      // Added border color
    borderWidth: 1,              // Set border width
    color: 'white',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#000',  // Set background to black
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 2,  // Add a border
    borderColor: '#ad93c8',
    marginTop: 320
  },
  submitButtonText: {
    color: '#ad93c8',
    fontSize: 15,
    fontWeight: 'bold',
  },
  loadingButton: {
    borderWidth: 0, 
},
});

export default ChangePasswordScreen;