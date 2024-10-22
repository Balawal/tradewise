import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIndicator } from 'react-native-indicators';
import { useNavigation } from '@react-navigation/native';
import { getAuth, deleteUser } from "firebase/auth";

const DeleteAccountScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

    const deleteUserAccount = async () => {
        setLoading(true);
        if (user) {
            deleteUser(user)
              .then(() => {
                console.log("User deleted successfully.");
                setLoading(false);
                navigation.navigate('Welcome');
              })
              .catch((error) => {
                console.error("Error deleting user:", error);
              });
          } else {
            console.log("No user signed in.");
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
        <Text style={styles.title}>Delete Account</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>Are you sure?</Text>
        <Text style={styles.description}>
          Your account will be permanently deleted. You won't be able to recover it.
        </Text>
        
        <TouchableOpacity 
            style={[styles.deleteButton, loading && styles.loadingButton]} 
            onPress={deleteUserAccount} 
            disabled={loading}
            >
            {loading ? (
                <MaterialIndicator color="white" />
            ) : (
                <Text style={styles.deleteButtonText}>Delete Account</Text>
            )}
        </TouchableOpacity>
      </View>
      
      <Text style={styles.footerText}>
        By tapping "Delete Account", you are confirming that you understand and agree to the terms of deleting your account.
      </Text>
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
    content: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: 16,
      marginTop: 30,
    },
    heading: {
      color: '#ffffff',
      fontSize: 22,
      fontWeight: 'bold',
      paddingBottom: 8,
    },
    description: {
      color: '#ffffff',
      fontSize: 16,
      paddingBottom: 16,
    },
    deleteButton: {
      borderColor: '#ff2400',
      backgroundColor: '#000',
      borderRadius: 20,
      paddingVertical: 8,
      alignItems: 'center',
      borderWidth: 2,
    },
    deleteButtonText: {
      color: '#ff2400',
      fontSize: 15,
      fontWeight: 'bold',
    },
    footerText: {
      color: '#ab9db8',
      fontSize: 14,
      textAlign: 'center',
      paddingHorizontal: 16,
      paddingTop: 520
    },
    loadingButton: {
        borderWidth: 0, 
    },
  });
  
  export default DeleteAccountScreen;