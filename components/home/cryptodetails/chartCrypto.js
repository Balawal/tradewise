import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useFetchChartCrypto } from '../../../hooks/home/cryptodetails/useFetchChartCrypto';
import { LoadingIndicator } from '../../../styles/components/loadingIndicator';
import { TimeFrameButtonsCrypto } from '../../../styles/components/chartTimeframe';
import { chartCryptoStyles as styles } from '../../../styles/homeStyles';

const ChartCrypto = ({cryptoID, onColorChange, selectedTimeframe, setSelectedTimeframe, graphColor}) => {
  const [chartData, setChartData] = useState(null);
  const [percentChange, setPercentChange] = useState(0);
  const [priceDifference, setPriceDifference] = useState(0);

  const { width } = Dimensions.get('window');
  const chartWidth = width * 0.70; 
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    
    try {
      const data = await useFetchChartCrypto(selectedTimeframe, cryptoID, onColorChange);
      
      if (data) {
        setChartData(data.chartData);
        setPercentChange(data.percentChange);
        setPriceDifference(data.priceDifference);
      }
    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTimeframe, cryptoID]);


  if (isLoading) {
    return <LoadingIndicator color="white" />;
  }

  if (!chartData) {
    return <View style={styles.centered}><Text>Loading chart...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <TimeFrameButtonsCrypto onSelectTimeframe={setSelectedTimeframe} buttonColor={graphColor} selectedTimeframe={selectedTimeframe} />
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

export default ChartCrypto;