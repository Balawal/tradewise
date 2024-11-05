import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { calculateButtonStyles as styles } from '../../styles/calculatorStyles';
import { LoadingIndicator } from '../../styles/components/loadingIndicator';

const CalculateButton = ({ isLoading, onPress }) => (
        <View style={styles.buttonContainer}>
            {isLoading ? (
            <LoadingIndicator color="white" />
            ) : (
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>
            )}
  </View>
);

export default CalculateButton;