import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const TimeframeButtons = ({ onSelectTimeframe, buttonColor, selectedTimeframe, setSelectedTimeframe }) => {
    return (
      <View style={styles.buttonContainer}>
        {['1D', '1W', '1M', '6M', '1Y', '5Y'].map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.button}
            onPress={() => {
              setSelectedTimeframe(label);
              onSelectTimeframe(label);
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
  

const Chart = ({ stockSymbol}) => {
  const [chartData, setChartData] = useState(null);
  const [percentChange, setPercentChange] = useState(0);
  const [priceDifference, setPriceDifference] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [graphColor, setGraphColor] = useState('white'); 
  const { width } = Dimensions.get('window');
  const chartWidth = width * 0.75; 

  const fetchChartData = async (timeframe) => {
    try {
      const endpointMap = {
        '1D': '/api/latest-bars',
        '1W': '/api/one-week-bars',
        '1M': '/api/one-month-bars',
        '6M': '/api/six-month-bars',
        '1Y': '/api/one-year-bars',
        '5Y': '/api/five-years-bars',
      };

      const response = await axios.get(`http://192.168.1.118:3000${endpointMap[timeframe]}`, {
        params: { symbols: stockSymbol },
      });

      const data = response.data.bars;
      const change = parseFloat(response.data.percentChange);
      const priceDiff = parseFloat(response.data.priceDifference);

      setPercentChange(change);
      setPriceDifference(priceDiff);

      // Determine graph color based on percentChange
      const color = change >= 0 ? 'green' : 'red';
      setGraphColor(color);
      //setReturnText(`${timeframe} Return: ${priceDifference.toFixed(2)}(${percentChange.toFixed(2)}%)`);

      // Extract closing prices and dates for the graph
      const closingPrices = data.map(bar => bar.c);

      // Set chart data
      setChartData({
        datasets: [
          {
            data: closingPrices,
          },
        ],
      });
    } catch (error) {
      console.error(`Error fetching ${timeframe} bars data:`, error);
    }
  };

  useEffect(() => {
    fetchChartData(selectedTimeframe);
    console.log("Selected timeframe: ", selectedTimeframe);
    console.log("Graph color: ", graphColor);
  }, [selectedTimeframe, stockSymbol]);

  if (!chartData) {
    return <View style={styles.centered}><Text>Loading chart...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TimeframeButtons onSelectTimeframe={setSelectedTimeframe} buttonColor={graphColor} selectedTimeframe={selectedTimeframe} setSelectedTimeframe={setSelectedTimeframe} />
      <View>
          <Text style={styles.returnLabel}>Return </Text>
          <Text style={[styles.returnText, { color: graphColor }]}>{priceDifference.toFixed(2)} ({percentChange.toFixed(2)}%)</Text>
        </View>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={chartWidth} // Adjust as needed
          height={430}
          chartConfig={{
            backgroundColor: '#000000',
            backgroundGradientFrom: '#000000',
            backgroundGradientTo: '#000000',
            decimalPlaces: 2,
            color: (opacity = 1) => graphColor, // Use the graphColor state
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '0',
            },
          }}
          withHorizontalLabels={false}
          withVerticalLabels={false}
          withInnerLines={false}
          withOuterLines={false}
          withShadow={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000', 
  },
  buttonContainer: {
    width: '22%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#000', 
  },
  button: {
    margin: 8,
    padding: 8,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  buttonTextContainer: {
    paddingHorizontal: 6, // Adjust this to control the space around the text
    paddingVertical: 4,   // Adjust this to control the space around the text
    borderRadius: 4,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  chartContainer: {
    height: '120%',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#000', 
    position: 'relative', 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', 
  },
  chartInfo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'transparent', 
    marginBottom: 10
  },
  returnText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    marginLeft: -45
  },
  returnLabel: {
    color: 'gray', 
    fontSize: 16, 
    fontWeight: 'bold',
    marginLeft: -60,
  },
});

export default Chart;