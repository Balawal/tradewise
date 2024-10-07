import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/calculator/datePicker';
import BarChartComponent from '../../components/calculator/barChart';

const CalculatorScreen = ({ route, navigation }) => {
  const { symbol } = route.params;
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  const [reinvestDividends, setReinvestDividends] = useState(false); // New state for reinvestment toggle
  const [reinvestmentAmount, setReinvestmentAmount] = useState(''); // Amount to reinvest
  const [periodicContribution, setPeriodicContribution] = useState(''); // Periodic contributions

  const handleCalculate = async () => {
    if (!investmentAmount || !selectedDate) {
      Alert.alert('Error', 'Please enter an investment amount and select a date.');
      return;
    }
  
    let url = `http://192.168.1.118:3000/api/stock-calculator?symbols=${symbol}&start=${selectedDate}&investment=${investmentAmount}`;
  
    // If the user toggles reinvestment, change the URL to the reinvestment endpoint
    if (reinvestDividends && reinvestmentAmount && periodicContribution) {
      url = `http://192.168.1.118:3000/api/stock-calculator-reinvest?symbols=${symbol}&start=${selectedDate}&investment=${investmentAmount}&contribution=${reinvestDividends}&frequency=${periodicContribution}`;
    }
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        setCalculationResult(data);  // Update the state to reflect the result
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch data from the server');
      }
    } catch (error) {
      console.error('Error fetching calculation:', error);
      Alert.alert('Error', 'An error occurred while calculating the investment.');
    }
  };

  const renderHeader = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={25} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.symbol}>{symbol}</Text>

      {/* Investment Amount Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Investment Amount</Text>
        <TextInput
          style={styles.input}
          value={investmentAmount}
          onChangeText={setInvestmentAmount}
          placeholder="$0.00"
          placeholderTextColor="#ad93c8"
          keyboardType="numeric"
        />
      </View>

      {/* Date Picker Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Investment Date</Text>
        <DatePicker onDateChange={setSelectedDate} selectedDate={selectedDate} />
      </View>

      {/* Reinvest Dividends Toggle */}
      <View style={styles.reinvestContainer}>
        <View style={styles.toggleLabelContainer}>
          <Text style={styles.label}>Reinvest Dividends</Text>
          <Text style={styles.toggleDescription}>Toggle on to reinvest dividends</Text>
        </View>
        <TouchableOpacity onPress={() => setReinvestDividends(prev => !prev)} style={styles.toggleSwitch}>
          <View style={[styles.toggleCircle, reinvestDividends && styles.toggleCircleActive]} />
          <Text style={styles.toggleValue}>{reinvestDividends ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
      </View>

      {/* Reinvestment Amount Input */}
      {reinvestDividends && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reinvestment Amount</Text>
          <TextInput
            style={styles.input}
            value={reinvestmentAmount}
            onChangeText={setReinvestmentAmount}
            placeholder="$0.00"
            placeholderTextColor="#ad93c8"
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Periodic Contributions Input */}
      {reinvestDividends && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.periodicButton, periodicContribution === 'weekly' && styles.selectedButton]}
            onPress={() => setPeriodicContribution('weekly')}
          >
            <Text style={styles.buttonText}>Weekly</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.periodicButton, periodicContribution === 'monthly' && styles.selectedButton]}
            onPress={() => setPeriodicContribution('monthly')}
          >
            <Text style={styles.buttonText}>Monthly</Text>
          </TouchableOpacity>
   
          <TouchableOpacity
            style={[styles.periodicButton, periodicContribution === 'annually' && styles.selectedButton]}
            onPress={() => setPeriodicContribution('annually')}
          >
            <Text style={styles.buttonText}>Annually</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Calculate Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>
      </View>

      {/* Calculation Result */}
      {calculationResult && (
        <View>
            <BarChartComponent symbol={calculationResult.symbol} investment={investmentAmount} profit={calculationResult.totalProfit} />
            <Text style={styles.profit}>Profit/Loss</Text>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text style={styles.descriptor}>TICKER</Text>
              <Text style={styles.under}>{calculationResult.symbol}</Text>
            </View>
            <View style={styles.centerColumn}>
              <Text style={styles.descriptor}>TOTAL PROFIT</Text>
              <Text style={styles.under}>${calculationResult.totalProfit.toFixed(2)}</Text>
            </View>
            <View style={styles.rightColumn}>
            <Text style={styles.descriptor}>CAPITAL GAIN</Text>
            <Text style={styles.under}>${calculationResult.capitalGain.toFixed(2)}</Text>
          </View>
          </View>
          <View style={styles.separator} />

          <Text style={styles.keystats}>Dividend</Text>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.descriptor}>TOTAL DIVIDEND</Text>
            <Text style={styles.under}>{calculationResult.dividends.totalDividend}</Text>
          </View>
          <View style={styles.centerColumn}>
            <Text style={styles.descriptor}>TIMES DISTRIBUTED</Text>
            <Text style={styles.under}>{calculationResult.dividends.timesDistributed}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.descriptor}>DIVIDEND AVG</Text>
            <Text style={styles.under}>{calculationResult.dividends.dividendAverage}</Text>
          </View>
        </View>
        <View style={styles.separator} />

        <Text style={styles.keystats}>Shares</Text>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.descriptor}>TOTAL SHARES</Text>
            <Text style={styles.under}>{calculationResult.totalShares.toFixed(2)}</Text>
          </View>
          <View style={styles.centerColumn}>
            <Text style={styles.descriptor}>CURRENT PRICE</Text>
            <Text style={styles.under}>${calculationResult.currentPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.descriptor}>PURCHASE PRICE</Text>
            <Text style={styles.under}>${calculationResult.purchasePrice.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.separator} />

        <Text style={styles.keystats}>Other Details</Text>
        <View style={styles.row}>
          <View style={styles.leftColumn}>
            <Text style={styles.descriptor}>DURATION</Text>
            <Text style={styles.under}>{calculationResult.duration.years} Y {calculationResult.duration.months} M {calculationResult.duration.days} D</Text>
          </View>
          <View style={styles.centerColumn}>
            <Text style={styles.descriptor}>ANNUAL RETURN</Text>
            <Text style={styles.under}>{calculationResult.annualReturn.toFixed(2)}%</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.descriptor}>TOTAL RETURN</Text>
            <Text style={styles.under}>{calculationResult.totalReturn.toFixed(2)}%</Text>
          </View>
        </View>
        <View style={styles.separator} />
        {reinvestDividends && (
        <View>
          <Text style={styles.profit}>Total Reinvested: $</Text>
          <Text style={styles.profit}>Final Investment Value: $</Text>
        </View>
        )}
      </View>
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <FlatList
        style={styles.container}
        data={[]}
        ListHeaderComponent={renderHeader}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  symbol: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    paddingLeft: 16,
    paddingTop: 20,
  },
  inputContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    paddingBottom: 8,
  },
  input: {
    backgroundColor: '#362447',
    color: 'white',
    borderRadius: 10,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 0,
    placeholderTextColor: '#ad93c8',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#8019e6',
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profit: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
  },
  reinvestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  toggleLabelContainer: {
    flexDirection: 'column',
  },
  toggleDescription: {
    color: '#ad93c8',
    fontSize: 12,
  },
  toggleSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleCircle: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: '#362447',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  toggleCircleActive: {
    backgroundColor: '#8019e6',
  },
  toggleValue: {
    color: 'white',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 16,
  },
  periodicButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: '#8019e6',
  },
});

export default CalculatorScreen;