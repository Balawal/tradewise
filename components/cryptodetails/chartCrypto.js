import React, { useState, useEffect, useRef } from 'react';
import { View, Dimensions, Text, StyleSheet, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { MaterialIndicator } from 'react-native-indicators';

const TimeframeButtons = ({ onSelectTimeframe, buttonColor, selectedTimeframe, setSelectedTimeframe }) => {
    return (
      <View style={styles.buttonContainer}>
        {['1D', '1W', '1M', '3M', '6M', '1Y'].map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.button}
            onPress={() => { 
              if (label !== selectedTimeframe) {// Only set if it's a new timeframe
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
  

const ChartCrypto = ({cryptoID, onColorChange, selectedTimeframe, setSelectedTimeframe, graphColor}) => {
  const [chartData, setChartData] = useState(null);
  const [percentChange, setPercentChange] = useState(0);
  const [priceDifference, setPriceDifference] = useState(0);

  const { width } = Dimensions.get('window');
  const chartWidth = width * 0.70; 
  const [isLoading, setIsLoading] = useState(false);
  const chartDataRef = useRef(null);

  const fetchChartData = async (timeframe) => {
    setIsLoading(true);
    try {
      const endpointMap = {
        '1D': '/api/crypto-one-day-bars',
        '1W': '/api/crypto-one-week-bars',
        '1M': '/api/crypto-one-month-bars',
        '3M': '/api/crypto-three-month-bars',
        '6M': '/api/crypto-six-month-bars',
        '1Y': '/api/crypto-one-year-bars',
      };

      const response = await axios.get(`http://192.168.1.118:3000${endpointMap[timeframe]}`, {
        params: { coinName: cryptoID },
      });

      const data = response.data.prices;
      const change = parseFloat(response.data.percentChange);
      const priceDiff = parseFloat(response.data.priceDifference);

      setPercentChange(change);
      setPriceDifference(priceDiff);

      const color = change >= 0 ? 'green' : 'red';

      if (onColorChange) {
        onColorChange(color);
      }
      setChartData({
        datasets: [{ data }]
      });
    } catch (error) {
      console.error(`Error fetching ${timeframe} bars data:`, error);
    }
    finally {
      setIsLoading(false); // Always set loading to false at the end
    }
  };

  useEffect(() => {
    fetchChartData(selectedTimeframe);
    console.log("Selected timeframe: ", selectedTimeframe);
    console.log("Graph color: ", graphColor);
  }, [selectedTimeframe, cryptoID]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIndicator color="white" />
      </View>
    );
  }

  if (!chartData) {
    return <View style={styles.centered}><Text>Loading chart...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TimeframeButtons onSelectTimeframe={setSelectedTimeframe} buttonColor={graphColor} selectedTimeframe={selectedTimeframe} setSelectedTimeframe={setSelectedTimeframe} />
      <View>
          <Text style={styles.returnLabel}>Return</Text>
          <Text style={[styles.returnText, { color: graphColor }]}>{priceDifference.toFixed(2)} ({percentChange.toFixed(2)}%)</Text>
        </View>
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={430}
          chartConfig={{
            backgroundColor: '#000000',
            backgroundGradientFrom: '#000000',
            backgroundGradientTo: '#000000',
            decimalPlaces: 2,
            color: (opacity = 1) => graphColor, 
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
    paddingHorizontal: 6, 
    paddingVertical: 4,   
    borderRadius: 4,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  chartContainer: {
    height: '120%',
    width: '6%',
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
    marginVertical: -20,
    marginLeft: 10
  },
  infoContainer: {
    flexDirection: 'row',
    marginLeft: -45
  },
  returnLabel: {
    color: 'gray', 
    fontSize: 16, 
    fontWeight: 'bold',
    marginLeft: -50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});

export default ChartCrypto;