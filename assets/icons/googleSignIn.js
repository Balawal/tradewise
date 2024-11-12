import React from 'react';
import { TouchableOpacity, Text, Image, View, StyleSheet } from 'react-native';

const GoogleSignUpButton = ({ onPress, label }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.buttonContent}>
                <Image 
                    source={require('../../assets/icons/google.png')} 
                    style={styles.icon} 
                />
                <Text style={styles.buttonText}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
        borderColor: '#747775',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        maxWidth: 300,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#1f1f1f',
        fontWeight: '500',
        marginLeft: 12, // space between icon and text
    },
    icon: {
        width: 20,
        height: 20,
    },
});

export default GoogleSignUpButton;