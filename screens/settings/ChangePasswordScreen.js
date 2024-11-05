import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import useChangePassword from '../../hooks/settings/useChangePassword';
import { changePasswordStyles as styles } from '../../styles/settingsStyles';
import { LoadingIndicator } from '../../styles/components/loadingIndicator';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { changePassword, loading } = useChangePassword();

  const handleSubmit = () => {
    changePassword(oldPassword, newPassword, confirmPassword, navigation);
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
            onPress={() => {
              console.log("change password button pressed");
              handleSubmit();
            }} 
            disabled={loading}
            >
            {loading ? (
                <LoadingIndicator color="white" />
            ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
            )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;