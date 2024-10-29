import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { formatDistanceToNowStrict } from 'date-fns';
import { MaterialIndicator } from 'react-native-indicators';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const NewsScreen = ({ navigation }) => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsArticles = async () => {
      try {
        console.log('Fetching news articles from backend...');
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/news-articles`);

        const filteredArticles = response.data.news.filter(article => 
          article.images.length > 0 && article.symbols.length > 0
        );

        setNewsArticles(filteredArticles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news articles:', error.message);
        setLoading(false);
      }
    };

    fetchNewsArticles();
  }, []);

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

  const handlePress = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIndicator color="white" />
      </View>
    );
  }
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000000',
  },
  newsContainer: {
    paddingVertical: 2,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12
  },
  date: {
    fontSize: 12,
    color: '#888888',
    marginHorizontal: 12
  },
  newsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headline: {
    fontSize: 12,
    color: '#ffffff',
    flex: 1,
    marginRight: 10,
    marginLeft: 12,
  },
  newsImage: {
    width: 50,
    height: 50,
    borderRadius: 0,
    marginHorizontal: 12
  },
  symbolContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 5
  },
  symbolText: {
    fontSize: 12,
    color: '#ffffff',
    marginRight: 10,
    marginLeft: 12,
    fontWeight: 'bold'
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#111',
    marginVertical: 15,
  },
});

export default NewsScreen;
