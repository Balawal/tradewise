import React from 'react';
import { TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import CalculationResult from '../../components/calculator/calculationResult';
import CalculatorHeader from '../../components/calculator/calculatorHeader';
import CalculateButton from '../../components/calculator/calculateButton';
import useCalculator from '../../hooks/calculator/useCalculator';
import { calculatorScreenStyles as styles } from '../../styles/calculatorStyles';

const CalculatorScreen = ({ route, navigation }) => {
  const { symbol } = route.params;
  const {
    investmentAmount, setInvestmentAmount,
    selectedDate, setSelectedDate,
    reinvestDividends, setReinvestDividends,
    reinvestmentAmount, setReinvestmentAmount,
    periodicContribution, setPeriodicContribution,
    calculationResult, handleCalculate, isLoading, scrollViewRef, barChartRef
  } = useCalculator(symbol);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView ref={scrollViewRef} style={styles.container}>
        <CalculatorHeader
          symbol={symbol}
          investmentAmount={investmentAmount}
          setInvestmentAmount={setInvestmentAmount}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          reinvestDividends={reinvestDividends}
          setReinvestDividends={setReinvestDividends}
          reinvestmentAmount={reinvestmentAmount}
          setReinvestmentAmount={setReinvestmentAmount}
          periodicContribution={periodicContribution}
          setPeriodicContribution={setPeriodicContribution}
          navigation={navigation}
        />
        <CalculateButton isLoading={isLoading} onPress={handleCalculate} />
        <CalculationResult calculationResult={calculationResult} investmentAmount={investmentAmount} reinvestDividends={reinvestDividends} reinvestmentAmount={reinvestmentAmount} periodicContribution={periodicContribution} barChartRef={barChartRef}/>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default CalculatorScreen;