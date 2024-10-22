import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';

const RollingPrice = ({ currentPrice }) => {
  const [prevPrice, setPrevPrice] = useState(null); // Initialize as null
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentPrice !== prevPrice) {
      setVisible(false);
      setTimeout(() => {
        setPrevPrice(currentPrice);
        setVisible(true);
      }, 0); // Trigger the visibility change after a render
    }
  }, [currentPrice]);

  return (
    <View style={styles.container}>
      {visible && currentPrice !== null && ( // Check if currentPrice is not null
        <MotiView
          from={{ translateY: -30 }} // Adjust this value to control the start position
          animate={{ translateY: 0 }}
          exit={{ translateY: 30 }} // Adjust this value for exit animation
          transition={{ type: 'timing', duration: 300 }} // Control speed of animation
          style={styles.priceContainer}
        >
          <Text style={styles.priceText}>${currentPrice.toFixed(2)}</Text>
        </MotiView>
      )}
      {!visible && prevPrice !== null && ( // Check if prevPrice is not null
        <MotiView
          from={{ translateY: 30 }} // Adjust this for the incoming position
          animate={{ translateY: 0 }}
          exit={{ translateY: -30 }} // Adjust this value for exit animation
          transition={{ type: 'timing', duration: 300 }} // Control speed of animation
          style={styles.priceContainer}
        >
          <Text style={styles.priceText}>${prevPrice.toFixed(2)}</Text>
        </MotiView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RollingPrice;