import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BarChartComponent = ({ symbol, investment, profit }) => {
  const total = parseFloat(investment) + parseFloat(profit);
  
  // Define X-axis intervals
  const intervals = [
    0,
    total * 0.25,
    total * 0.5,
    total * 0.75,
    total
  ];

  const investmentPercentage = (parseFloat(investment) / total) * 100;
  const profitPercentage = (parseFloat(profit) / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {/* Y-Axis Symbol */}
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>{symbol}</Text>
        </View>
        {/* Bar and X-Axis */}
        <View style={styles.barWrapper}>
          <View style={styles.barContainer}>
            {/* Investment Bar */}
            <View
              style={[
                styles.barSegment,
                { width: `${investmentPercentage}%`, backgroundColor: '#808080' },
              ]}
            />
            {/* Profit Bar */}
            <View
              style={[
                styles.barSegment,
                { width: `${profitPercentage}%`, backgroundColor: '#007AFF' },
              ]}
            />
            {/* Total Label in the middle of the bar */}
            <Text style={styles.totalText}>
              Total = ${total.toFixed(2)}
            </Text>
          </View>
          {/* X-Axis Intervals */}
          <View style={styles.xAxis}>
            {intervals.map((interval, index) => (
              <Text key={index} style={styles.xAxisLabel}>
                ${interval.toFixed(2)}
              </Text>
            ))}
          </View>
        </View>
      </View>
      {/* Legend with colored rectangles */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Text style={styles.legendText}>Investment:</Text>
          <View style={[styles.legendColorBox, { backgroundColor: '#808080' }]} />
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendText}>Profit:</Text>
          <View style={[styles.legendColorBox, { backgroundColor: '#007AFF' }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',  // Make the label white
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxis: {
    justifyContent: 'center',
    marginRight: -1,
  },
  yAxisLabel: {
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',  // Make Y-axis label (symbol) white
  },
  barWrapper: {
    flex: 1,
  },
  barContainer: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative', // Allows the overlaying of text
  },
  barSegment: {
    height: '100%',
  },
  totalText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    top: '50%',
    transform: [{ translateY: -10 }], // Centers the text vertically
    color: '#000',  // White text
    fontWeight: 'bold',
    fontSize: 14,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  xAxisLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#fff',  // Make X-axis intervals white
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
    color: '#fff',  // Make the legend text white
  },
  legendColorBox: {
    width: 40,
    height: 10,
    marginLeft: 5,
    borderRadius: 2,  // Optional: round the corners of the color boxes
  },
});

export default BarChartComponent;