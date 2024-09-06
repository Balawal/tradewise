import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Dimensions, View } from 'react-native';

const { width } = Dimensions.get('window');

const AutoScrolling = ({ data, renderItem, itemWidth, speed = 20 }) => {
  const flatListRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const scrollInterval = useRef(null);

  const startAutoScroll = () => {
    scrollInterval.current = setInterval(() => {
      setScrollX(prevScrollX => {
        const newScrollX = prevScrollX + 1;
        if (newScrollX >= data.length * itemWidth) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: false });
          return 0;
        } else {
          flatListRef.current.scrollToOffset({ offset: newScrollX, animated: true });
          return newScrollX;
        }
      });
    }, speed);
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  return (
    <FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderItem}
      horizontal
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false} // Disable manual scrolling
    />
  );
};

export default AutoScrolling;