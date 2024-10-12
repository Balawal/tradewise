import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BarChartComponent = ({ investment, profit }) => {
  // Calculate percentages for the bars
  const total = investment + profit;

  // Prevent division by zero
  const investmentPercentage = total > 0 ? (investment / total) * 100 : 0;
  const profitPercentage = total > 0 ? (profit / total) * 100 : 0;

  console.log('Investment:', investmentPercentage);
  console.log('Profit:', profitPercentage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investment and Profit</Text>
      <Text style={styles.amount}>${(investment + profit).toFixed(2)}</Text>
      <Text style={styles.change}>{(((total - investment) / investment) * 100).toFixed(2)}%</Text>
      <View style={styles.chartContainer}>
        <View style={styles.barContainer}>
          <Text style={styles.label}>Investment</Text>
          <View style={styles.bar}>
            <View style={[styles.filledBar, { width: `${investmentPercentage}%` }]} />
          </View>
        </View>
        <View style={styles.barContainer}>
          <Text style={styles.label}>Profit</Text>
          <View style={styles.bar}>
            <View style={[styles.filledBar, { width: `${profitPercentage}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    borderColor: '#4d3465',
    borderWidth: 1,
    height: 300
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  amount: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  change: {
    color: '#0bda73',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  barContainer: {
    marginHorizontal: 4,
    marginVertical: 10,
    flexDirection: 'row',
  },
  label: {
    color: '#ad93c8',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  bar: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
    marginTop: -4,
    marginLeft: 75,
    width: 300,
    position: 'absolute',
  },
  filledBar: {
    height: 60,
    backgroundColor: '#ad93c8',
  },
});

export default BarChartComponent;