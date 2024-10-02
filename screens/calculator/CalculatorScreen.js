import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Alert, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/calculator/datePicker';
import { BarChart } from 'react-native-chart-kit'; // Import BarChart


const CalculatorScreen = ({ route, navigation }) => {
    const { symbol,name } = route.params;
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); // For storing selected date
    const [calculationResult, setCalculationResult] = useState(null);

    const handleCalculate = async () => {
      if (!investmentAmount || !selectedDate) {
        Alert.alert('Error', 'Please enter an investment amount and select a date.');
        return;
      }

      console.log(symbol);
      console.log(selectedDate);
      console.log(investmentAmount);
  
      // Construct the API URL with query parameters
      const url = `http://192.168.1.118:3000/api/stock-calculator?symbols=${symbol}&start=${selectedDate}&investment=${investmentAmount}`;
  
      try {
        // Send request to the backend
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
  
        if (response.ok) {
          setCalculationResult(data); // Store the result to display later
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch data from the server');
        }
      } catch (error) {
        console.error('Error fetching calculation:', error);
        Alert.alert('Error', 'An error occurred while calculating the investment.');
      }
    };

    const getChartData = () => {
      if (calculationResult) {
        const initialInvestment = parseFloat(investmentAmount);
        const profit = calculationResult.totalProfit;

        return {
          labels: ['Investment', 'Profit'],
          datasets: [
            {
              data: [initialInvestment, profit],
              colors: [
                (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Investment color (red)
                (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Profit color (blue)
              ],
            },
          ],
        };
      }
      return null;
    };

    const chartData = getChartData();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-ios" size="25" color='white'  />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.symbolContainer}>
                    <Text style={styles.stock}>Stock: </Text>
                    <Text style={styles.symbol}>{symbol}</Text>
                    <Text style={styles.name}> - {name}</Text> 
                </View>
            <Text style={styles.invest}>Invest Amount (USD)</Text>
            <TextInput
                style={styles.input}
                value={investmentAmount}
                onChangeText={setInvestmentAmount}
                placeholder="$ - Enter amount"
                placeholderTextColor="#888"
                keyboardType="numeric" // Only allows numeric input
            />
            <Text style={styles.invest}>Select a Date</Text>
            <DatePicker onDateChange={setSelectedDate}/>

            <TouchableOpacity style={styles.button} onPress={handleCalculate}>
                <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>

            {calculationResult && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>Investment Result for {calculationResult.symbol}</Text>
                        <Text style={styles.resultText}>Current Price: ${calculationResult.currentPrice.toFixed(2)}</Text>
                        <Text style={styles.resultText}>Purchase Price: ${calculationResult.purchasePrice.toFixed(2)}</Text>
                        <Text style={styles.resultText}>Total Shares: {calculationResult.totalShares.toFixed(2)}</Text>
                        <Text style={styles.resultText}>Capital Gain: ${calculationResult.capitalGain.toFixed(2)}</Text>
                        <Text style={styles.resultText}>Total Profit: ${calculationResult.totalProfit.toFixed(2)}</Text>
                        <Text style={styles.resultText}>Total Return: {calculationResult.totalReturn.toFixed(2)}%</Text>
                        <Text style={styles.resultText}>Duration: {calculationResult.duration.years} years, {calculationResult.duration.months} months, {calculationResult.duration.days} days</Text>
                        <Text style={styles.resultText}>Dividends: ${calculationResult.dividends.totalDividend}</Text>

                        <View style={styles.chartContainer}>
                        <BarChart
                            data={chartData}
                            width={300} // Adjust as needed
                            height={220}
                            chartConfig={{
                                backgroundColor: '#000',
                                backgroundGradientFrom: '#000',
                                backgroundGradientTo: '#000',
                                decimalPlaces: 2, // Optional, defaults to 2
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: '6',
                                    strokeWidth: '2',
                                    stroke: '#ffa726',
                                },
                            }}
                            verticalLabelRotation={30}
                            fromZero={true}
                        />
                    </View>
                </View>
              )}
              </ScrollView>
        </View>
        </TouchableWithoutFeedback>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
      },
      header:{
        flexDirection: 'row',    
        justifyContent: 'space-between', 
        paddingHorizontal: 5,    
        paddingTop: 35, 
      },
      symbol: {
        fontSize: 20,
        color: 'white',
      },
      name: {
        fontSize: 20,
        color: 'white',
      },
      stock: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold'
      },
      invest: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10
      },
      goBack: {
        paddingTop: 35
      },
      symbolContainer: {
        flexDirection: 'row',  // Align symbol and name horizontally
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10
      },
      input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
    },
    button: {
      backgroundColor: '#1E90FF',
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
  },
  buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    color: 'white',
  },
  scrollContainer: {
    flexGrow: 1, // Ensure the ScrollView takes all available space
}
});

export default CalculatorScreen;