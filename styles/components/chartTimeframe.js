import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const TimeFrameButtonsCrypto = ({ onSelectTimeframe, buttonColor, selectedTimeframe }) => {
  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y'];
  
  return (
    <View style={styles.buttonContainer}>
      {timeframes.map((label) => (
        <TouchableOpacity
          key={label}
          style={styles.button}
          onPress={() => {
            if (label !== selectedTimeframe) {
              onSelectTimeframe(label);
            }
          }}
        >
          <View style={[
            styles.buttonTextContainer,
            label === selectedTimeframe && { borderColor: buttonColor, borderWidth: 1 },
          ]}>
            <Text style={[styles.buttonText, { color: buttonColor }]}>{label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const TimeFrameButtons = ({ onSelectTimeframe, buttonColor, selectedTimeframe }) => {
    return (
      <View style={styles.buttonContainer}>
        {['1D', '1W', '1M', '6M', '1Y', '5Y'].map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.button}
            onPress={() => { 
              if (label !== selectedTimeframe) {
                onSelectTimeframe(label);
              }
            }}
          >
            <View style={[
              styles.buttonTextContainer,
              label === selectedTimeframe && { borderColor: buttonColor, borderWidth: 1 },
            ]}>
              <Text style={[styles.buttonText, { color: buttonColor }]}>{label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

const styles = StyleSheet.create({
  buttonContainer: { width: '22%', justifyContent: 'center', alignItems: 'center', padding: 5, backgroundColor: '#000', },
  button: { margin: 8, padding: 8, backgroundColor: '#000', borderRadius: 1, },
  buttonTextContainer: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, borderWidth: 1, },
  buttonText: { fontSize: 16, fontWeight: 'bold', },
});