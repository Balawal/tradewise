import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { LoadingIndicator } from '../../../styles/components/loadingIndicator';
import { useFetchNewsArticles } from '../../../hooks/social/useFetchNewsArticles';
import { EmptyMessage } from '../../../styles/components/emptyMessage';
import { newsScreenStyles as styles } from '../../../styles/socialStyles';

const NewsScreen = ({ navigation }) => {
  const { newsArticles, loading, error } = useFetchNewsArticles();

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.newsContainer} onPress={() => navigation.navigate('NewsDetail', { url: item.url })}>
      <View style={styles.newsHeader}>
      </View>
      <View style={styles.newsContent}>
        <Text style={styles.headline}>{item.headline}</Text>
        {item.images.length > 0 && (
          <Image
            source={{ uri: item.images[0].url }}
            style={styles.newsImage}
            resizeMode="cover"
          />
        )}
      </View>
      {item.symbols.length > 0 && (
        <View style={styles.symbolContainer}>
          {item.symbols.slice(0, 3).map((symbol, index) => (
            <View key={index} style={styles.symbolInfo}>
              <Text style={styles.symbolText}>
                {symbol}
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={styles.separator} />
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingIndicator color="white" />;
  }
  if (error) return <EmptyMessage message="News articles aren't displaying. Please try again later." />

  return (
    <View style={styles.container}>
      <FlatList
        data={newsArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default NewsScreen;