import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const NewsDetailScreen = ({ route, navigation }) => {
  const { url } = route.params;

  // Extract the domain name from the URL
  const getDomainName = (url) => {
    const { hostname } = new URL(url);
    return hostname.replace('www.', '');
  };

  useEffect(() => {
    // Set the header title to the domain name
    const domainName = getDomainName(url);
    navigation.setOptions({ title: domainName });
  }, [url, navigation]);

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default NewsDetailScreen;