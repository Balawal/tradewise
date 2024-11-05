import React from 'react';
import { View, Text } from 'react-native';
import { formatCalculatorNumber } from '../../utils/utils';
import { barChartStyles as styles } from '../../styles/calculatorStyles';

const BarChartComponent = ({ investment, profit }) => {
  const total = investment + profit;

  const investmentPercentage = total > 0 ? (investment / total) * 100 : 0;
  const profitPercentage = total > 0 ? (profit / total) * 100 : 0;
  const percentageChange = ((total - investment) / investment) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investment and Profit</Text>
      <Text style={styles.amount}>${formatCalculatorNumber(investment + profit)}</Text>
      <Text style={[styles.change, { color: percentageChange < 0 ? 'red' : '#0bda73' }]}>
        {percentageChange.toFixed(2)}%
      </Text>
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

export default BarChartComponent;