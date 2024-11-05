import React from 'react';
import { View, Text } from 'react-native';
import BarChartComponent from './barChart';
import { formatCalculatorNumber } from '../../utils/utils';
import { calculationResultStyles as styles } from '../../styles/calculatorStyles';

const CalculationResult = ({ calculationResult, investmentAmount, reinvestDividends, reinvestmentAmount, periodicContribution, barChartRef }) => {

  return (
    calculationResult && (
      <View ref={barChartRef}>
      <BarChartComponent 
        investment={parseFloat(investmentAmount)} 
        profit={calculationResult.totalProfit} 
      />
      <Text style={styles.summary}>Investment Summary</Text>
    <View style={styles.row}>
      <View style={styles.leftColumn}>
        <Text style={styles.descriptor}>TICKER</Text>
        <Text style={styles.under}>{calculationResult.symbol}</Text>
      </View>
      <View style={styles.centerColumn}>
        <Text style={styles.descriptor}>TOTAL PROFIT</Text>
        <Text style={styles.under}>${formatCalculatorNumber(calculationResult.totalProfit)}</Text>
      </View>
      <View style={styles.rightColumn}>
      <Text style={styles.descriptor}>CAPITAL GAIN</Text>
      <Text style={styles.under}>${formatCalculatorNumber(calculationResult.capitalGain)}</Text>
    </View>
    </View>
    <View style={styles.separator} />

  <View style={styles.row}>
    <View style={styles.leftColumn}>
      <Text style={styles.descriptor}>TOTAL DIVIDEND</Text>
      <Text style={styles.under}>{calculationResult.dividends.totalDividend}</Text>
    </View>
    <View style={styles.centerColumn}>
      <Text style={styles.descriptor}>TIMES DISTR.</Text>
      <Text style={styles.under}>{calculationResult.dividends.timesDistributed}</Text>
    </View>
    <View style={styles.rightColumn}>
      <Text style={styles.descriptor}>DIVIDEND AVG</Text>
      <Text style={styles.under}>{calculationResult.dividends.dividendAverage}</Text>
    </View>
  </View>
  <View style={styles.separator} />

  <View style={styles.row}>
    <View style={styles.leftColumn}>
      <Text style={styles.descriptor}>TOTAL SHARES</Text>
      <Text style={styles.under}>{formatCalculatorNumber(calculationResult.totalShares)}</Text>
    </View>
    <View style={styles.centerColumn}>
      <Text style={styles.descriptor}>CURRENT PRICE</Text>
      <Text style={styles.under}>${formatCalculatorNumber(calculationResult.currentPrice)}</Text>
    </View>
    <View style={styles.rightColumn}>
      <Text style={styles.descriptor}>PURCHASE PRICE</Text>
      <Text style={styles.under}>${formatCalculatorNumber(calculationResult.purchasePrice)}</Text>
    </View>
  </View>
  <View style={styles.separator} />

  <View style={styles.row}>
    <View style={styles.leftColumn}>
      <Text style={styles.descriptor}>DURATION</Text>
      <Text style={styles.under}>{calculationResult.duration.years} Y {calculationResult.duration.months} M {calculationResult.duration.days} D</Text>
    </View>
    <View style={styles.centerColumn}>
      <Text style={styles.descriptor}>ANNUAL RETURN</Text>
      <Text style={styles.under}>{formatCalculatorNumber(calculationResult.annualReturn)}%</Text>
    </View>
    <View style={styles.rightColumn}>
      <Text style={styles.descriptor}>TOTAL RETURN</Text>
      <Text style={styles.under}>{formatCalculatorNumber(calculationResult.totalReturn)}%</Text>
    </View>
  </View>
  <View style={styles.separator} />
  {reinvestDividends && reinvestmentAmount && periodicContribution && calculationResult.periodicContributions && (
  <View>
    <Text style={styles.summary}>Dividend Summary</Text>
    <View style={styles.row}>
    <View style={styles.leftColumn}>
      <Text style={styles.descriptor}>DRIP</Text>
      <Text style={styles.under}>${formatCalculatorNumber(parseFloat(calculationResult.dripValue))}</Text>
    </View>
    <View style={styles.centerColumn}>
      <Text style={styles.descriptor}>CONTR. SHARES</Text>
      <Text style={styles.under}>${formatCalculatorNumber(parseFloat(calculationResult.periodicContributions.totalContribution))}</Text>
    </View>
    <View style={styles.rightColumn}>
      <Text style={styles.descriptor}>TOTAL CONTR.</Text>
      <Text style={styles.under}>{formatCalculatorNumber(parseFloat(calculationResult.periodicContributions.contributionShares))}</Text>
    </View>
  </View>
  </View>
  )}
  </View>
    )
  );
};

export default CalculationResult;