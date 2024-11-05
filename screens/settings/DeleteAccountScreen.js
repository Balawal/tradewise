import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import useDeleteAccount from '../../hooks/settings/useDeleteAccount';
import { deleteAccountStyles as styles } from '../../styles/settingsStyles';
import { LoadingIndicator } from '../../styles/components/loadingIndicator';

const DeleteAccountScreen = () => {
    const navigation = useNavigation();
    const { deleteUserAccount, loading } = useDeleteAccount();

    const handleSubmit = () => {
      deleteUserAccount();
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
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <LoadingIndicator color="white" />
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

export default DeleteAccountScreen;