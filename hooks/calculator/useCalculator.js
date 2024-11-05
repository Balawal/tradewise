import { useState, useRef } from 'react';
import { Alert } from 'react-native';
import { REACT_APP_BASE_URL } from '@env';

const useCalculator = (symbol) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);
  const [reinvestDividends, setReinvestDividends] = useState(false);
  const [reinvestmentAmount, setReinvestmentAmount] = useState('');
  const [periodicContribution, setPeriodicContribution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const barChartRef = useRef(null);
  const scrollViewRef = useRef(null);

  const handleCalculate = async () => {
    if (!investmentAmount || !selectedDate) {
      Alert.alert('Error', 'Please enter an investment amount and select a date.');
      return;
    }

    let url = `${REACT_APP_BASE_URL}/stock-calculator?symbols=${symbol}&start=${selectedDate}&investment=${investmentAmount}`;

    if (reinvestDividends && reinvestmentAmount && periodicContribution) {
      url = `${REACT_APP_BASE_URL}/stock-calculator-reinvest?symbols=${symbol}&start=${selectedDate}&investment=${investmentAmount}&contribution=${reinvestmentAmount}&frequency=${periodicContribution}`;
    }

    setIsLoading(true);

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setCalculationResult(data);  // Update the state to reflect the result

        setTimeout(() => {
          barChartRef.current?.measureLayout(
            scrollViewRef.current,
            (x, y) => {
              scrollViewRef.current.scrollTo({ y: y - 50, animated: true });
            },
            (error) => console.error(error)
          );
        }, 200); 
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch data from the server');
      }
    } catch (error) {
      console.error('Error fetching calculation:', error);
      Alert.alert('Error', 'An error occurred while calculating the investment.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    investmentAmount,
    setInvestmentAmount,
    selectedDate,
    setSelectedDate,
    calculationResult,
    reinvestDividends,
    setReinvestDividends,
    reinvestmentAmount,
    setReinvestmentAmount,
    periodicContribution,
    setPeriodicContribution,
    isLoading,
    handleCalculate,
    scrollViewRef, 
    barChartRef
  };
};

export default useCalculator;