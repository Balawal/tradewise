import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EmptyMessage = ({ message }) => (
    <View style={styles.emptyMessageContainer}>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
);
  
const styles = StyleSheet.create({
  emptyMessageContainer: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15, },
  emptyMessage: { color: '#ab9db8', fontSize: 15, textAlign: 'center', },
});