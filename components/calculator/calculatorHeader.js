import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from './datePicker';
import { calculatorHeaderStyles as styles } from '../../styles/calculatorStyles';

const CalculatorHeader = ({
  symbol,
  investmentAmount,
  setInvestmentAmount,
  selectedDate,
  setSelectedDate,
  reinvestDividends,
  setReinvestDividends,
  reinvestmentAmount,
  setReinvestmentAmount,
  periodicContribution,
  setPeriodicContribution,
  navigation
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-ios" size={25} color="white" />
      </TouchableOpacity>
    </View>

    <Text style={styles.symbol}>{symbol}</Text>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Investment Amount</Text>
      <TextInput
        style={styles.input}
        value={investmentAmount}
        onChangeText={setInvestmentAmount}
        placeholder="$0.00"
        placeholderTextColor="#e5d4d4"
        keyboardType="numeric"
      />
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Investment Date</Text>
      <DatePicker onDateChange={setSelectedDate} selectedDate={selectedDate} />
    </View>

    <View style={styles.reinvestContainer}>
      <View style={styles.toggleLabelContainer}>
        <Text style={styles.label}>Reinvest Dividends</Text>
      </View>
      <TouchableOpacity onPress={() => setReinvestDividends(prev => !prev)} style={styles.toggleSwitch}>
        <View style={[styles.toggleCircle, reinvestDividends && styles.toggleCircleActive]} />
        <Text style={styles.toggleValue}>{reinvestDividends ? 'On' : 'Off'}</Text>
      </TouchableOpacity>
    </View>

    {reinvestDividends && (
      <>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reinvestment Amount</Text>
          <TextInput
            style={styles.input}
            value={reinvestmentAmount}
            onChangeText={setReinvestmentAmount}
            placeholder="$0.00"
            placeholderTextColor="#e5d4d4"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonGroup}>
          {['weekly', 'monthly', 'annually'].map((frequency) => (
            <TouchableOpacity
              key={frequency}
              style={[styles.periodicButton, periodicContribution === frequency && styles.selectedButton]}
              onPress={() => setPeriodicContribution(frequency)}
            >
              <Text style={styles.buttonText}>{frequency.charAt(0).toUpperCase() + frequency.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    )}
  </View>
);

export default CalculatorHeader;