import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { newsCryptoStyles as styles } from '../../../styles/homeStyles';

const NewsItem = ({ item, index, onPress }) => {
  if (index === 0) {
    return (
      <TouchableOpacity style={styles.featuredNewsContainer} onPress={onPress}>
        {item.images && item.images.length > 0 && item.images[0].url && (
          <Image
            source={{ uri: item.images[0].url }}
            style={styles.featuredNewsImage}
            resizeMode="cover"
          />
        )}
        <Text style={styles.featuredHeadline} numberOfLines={2} ellipsizeMode="tail">{item.headline}</Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.newsContainer} onPress={onPress}>
      <View style={styles.newsContent}>
        <Text style={styles.headline} numberOfLines={2} ellipsizeMode="tail">{item.headline}</Text>
        {item.images && item.images.length > 0 && item.images[0].url && (
          <Image
            source={{ uri: item.images[0].url }}
            style={styles.newsImage}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );
};

export default NewsItem;