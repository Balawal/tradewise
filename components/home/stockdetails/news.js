import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { newsStyles as styles } from '../../../styles/homeStyles';

const NewsItem = ({ item, index, onPress }) => {
  if (index === 0) {
    return (
      <TouchableOpacity style={styles.featuredNewsContainer} onPress={onPress}>
        {item.banner_image &&(
          <Image
            source={{ uri: item.banner_image }}
            style={styles.featuredNewsImage}
            resizeMode="cover"
          />
        )}
        <Text style={styles.featuredHeadline} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.newsContainer} onPress={onPress}>
      <View style={styles.newsContent}>
        <Text style={styles.headline} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        {item.banner_image && (
          <Image
            source={{ uri: item.banner_image }}
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