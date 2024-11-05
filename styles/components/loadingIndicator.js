import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';

export const LoadingIndicator = ({ color = 'white' }) => (
  <View style={styles.loadingContainer}>
    <MaterialIndicator color={color} />
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000', },
});