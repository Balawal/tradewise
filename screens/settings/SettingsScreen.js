import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; 
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const handleLogout = async() =>{
        await signOut(auth);
    }
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUsername = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userDoc);

                if (docSnap.exists()) {
                    setUsername(docSnap.data().username); // Get the username
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchUsername();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser({
                    email: currentUser.email,
                    username: currentUser.displayName || 'No Username',
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Menu</Text>
      </View>
      
      <Text style={styles.sectionTitle}>My account</Text>
      
      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Name</Text>
          <Text style={styles.rowValue}>{username}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowLabel}>Email</Text>
          <Text style={styles.rowValue}>{user ? user.email : 'Loading...'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Account settings</Text>

      <TouchableOpacity style={styles.row} onPress={() => {navigation.navigate('ChangePassword')}}>
        <Text style={styles.rowLabel}>Password</Text>
        <Icon name="arrow-forward-ios" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => {navigation.navigate('DeleteAccount')}}>
        <Text style={styles.rowLabel}>Delete Account</Text>
        <Icon name="arrow-forward-ios" size={20} color="white" />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Support</Text>

      <TouchableOpacity style={styles.row} onPress={() => {Linking.openURL('mailto:bchaudry818@gmail.com?subject=Tradewise-Help%20Center');}}>
        <Text style={styles.rowLabel}>Help center</Text>
        <Icon name="arrow-forward-ios" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => {Linking.openURL('mailto:bchaudry818@gmail.com?subject=Tradewise-Contact');}}>
        <Text style={styles.rowLabel}>Contact us</Text>
        <Icon name="arrow-forward-ios" size={20} color="white" />
      </TouchableOpacity>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20,
  },
  scrollViewContainer: {
    paddingBottom: 20, // Add some bottom padding for better scrolling experience
  },
  header: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    marginLeft: 15
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 15,
    paddingle: 40
  },
  rowLabel: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5
  },
  rowText: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  rowValue: {
    color: '#ab9db8',
    fontSize: 14,
    marginLeft: 5
  },
  logoutContainer: {
    marginTop: 150,
    padding: 16,
  },
  logoutButton: {
    backgroundColor: '#000',  // Set background to black
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 2,  // Add a border
    borderColor: '#ad93c8',  // Set the border color to the original background color
  },
  logoutButtonText: {
    color: '#ad93c8',  // Change the text color to match the border
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;