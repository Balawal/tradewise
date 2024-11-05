import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { LoadingIndicator } from '../../styles/components/loadingIndicator';
import { useFetchTweets } from '../../hooks/social/useFetchTweets';
import { extractUsername } from '../../utils/utils';
import { EmptyMessage } from '../../styles/components/emptyMessage';
import { twitterScreenStyles as styles } from '../../styles/socialStyles';

const TwitterScreen = () => {
  const { tweets, loading, error } = useFetchTweets();
  const [expandedTweetIndex, setExpandedTweetIndex] = useState(null);

  const handleExpandPress = (index) => {
    setExpandedTweetIndex(expandedTweetIndex === index ? null : index);
  };

  if (loading) {
    return <LoadingIndicator color="white" />;
  }
  if (error) return <EmptyMessage message="Tweets aren't displaying. Please try again later." />;

  return (
    <ScrollView style={styles.container}>
      {tweets.length > 0 ? (
        tweets.map((tweet, index) => (
          <View key={index} style={styles.tweetContainer}>
            <View style={styles.headerContainer}>
            <Image 
                source={{ uri: tweet.avatar }} 
                style={styles.avatar} 
              />
            <View style={styles.fullnameAndUsername}>
              <Text style={styles.fullname}>{tweet.fullname}</Text>
              <Text style={styles.username}>@{extractUsername(tweet.url)}</Text>
            </View>
              <Text style={styles.time}>
                {tweet.time}
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <Text
                style={styles.content}
                numberOfLines={expandedTweetIndex === index ? undefined : 3}
              >
                {tweet.content}
              </Text>
              {tweet.content.length > 0 && (
                <TouchableOpacity
                  onPress={() => handleExpandPress(index)}
                  style={styles.readMoreButton}
                >
                  <Text style={styles.readMoreText}>
                    {expandedTweetIndex === index ? 'Show less' : 'Read more'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statsItem}>
                <EvilIcons name="comment" size={23} color="gray"/>
                <Text style={styles.statsText}>{tweet.stats.comments}</Text>
              </View>
              <View style={styles.statsItem}>
                <EvilIcons name="retweet" size={23}  color="gray"/>
                <Text style={styles.statsText}>{tweet.stats.retweets}</Text>
              </View>
              <View style={styles.statsItem}>
                <EvilIcons name="heart" size={23} color="gray" />
                <Text style={styles.statsText}>{tweet.stats.likes}</Text>
              </View>
            </View>
            <View style={styles.separator} />
          </View>
        ))
      ) : (
        <EmptyMessage message="Tweets aren't displaying. Please try again later." />
      )}
    </ScrollView>
  );
};

export default TwitterScreen;