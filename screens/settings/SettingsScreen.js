import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import useUser from '../../hooks/settings/useUser';
import { openEmail } from '../../utils/utils';
import { settingsScreenStyles as styles } from '../../styles/settingsStyles';

const SettingsScreen = () => {
    const { user, username } = useUser();
    const handleLogout = async() =>{
        await signOut(auth);
    }
    const navigation = useNavigation();

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

      <TouchableOpacity style={styles.row} onPress={() => openEmail('Tradewise-Help Center')}>
        <Text style={styles.rowLabel}>Help center</Text>
        <Icon name="arrow-forward-ios" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => openEmail('Tradewise-Contact')}>
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

export default SettingsScreen;