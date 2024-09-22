import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image  } from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import { EvilIcons } from '@expo/vector-icons';

const extractUsername = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

const parseTweetStats = (stats) => {
  //console.log('Raw Stats Input:', stats);
  
  // Remove leading/trailing spaces and collapse multiple spaces into a single space
  const cleanedStats = stats.trim().replace(/\s+/g, ' ');
  //console.log('Cleaned Stats:', cleanedStats); // Log the cleaned stats string

  // Split the cleaned stats string into an array based on spaces, then convert each item to a number
  const statsArray = cleanedStats.split(' ').map(item => {
    const number = parseInt(item.replace(/,/g, ''), 10);
    return isNaN(number) ? 'N/A' : number;
  });
  
  //console.log('Extracted Stats Array:', statsArray); // Log the extracted array of numbers

  // Return an object with the extracted stats
  return {
    comments: statsArray[1] || '0',
    retweets: statsArray[2] || '0',
    quotes: statsArray[3] || '0',
    likes: statsArray[4] || '0',
  };
};

const TwitterScreen = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch the latest tweet file and its data
    const fetchTweets = async () => {
      try {
        const response = await fetch('http://192.168.1.118:3000/api/scrape-tweets');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Fetch the latest tweet file
        const latestFileResponse = await fetch('http://192.168.1.118:3000/api/latest-tweet-file');
        if (!latestFileResponse.ok) {
          throw new Error('Failed to fetch latest tweet file');
        }

        const latestFileData = await latestFileResponse.json();
        if (!latestFileData.filename) {
          throw new Error('No filename found');
        }

        // Fetch the tweets from the latest file
        const tweetsResponse = await fetch(`http://192.168.1.118:3000/api/get-tweets?filename=${latestFileData.filename}`);
        if (!tweetsResponse.ok) {
          throw new Error('Failed to fetch tweets');
        }

        const tweetsData = await tweetsResponse.json();
        // console.log('Tweets Data:', tweetsData); 

        const parsedTweets = tweetsData.map(tweet => {
          const parsedStats = parseTweetStats(tweet.stats);
          //console.log('Parsed Tweet Stats:', parsedStats); // Log the parsed stats
          const avatar = tweet.avatar.trim();
          //console.log('profile picture: ', avatar);
          const fullname = tweet.fullname.trim();
          //console.log('user fullname: ', fullname);
          return {
            ...tweet,
            stats: parsedStats,
            avatar,
            fullname
          };
        });

        setTweets(parsedTweets);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  const [expandedTweetIndex, setExpandedTweetIndex] = useState(null);

  const handleExpandPress = (index) => {
    setExpandedTweetIndex(expandedTweetIndex === index ? null : index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIndicator color="white" />
      </View>
    );
  }
  if (error) return <Text style={styles.noTweets}>No tweets available.</Text>;

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
        <Text style={styles.noTweets}>No tweets available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Makes the image circular
    marginRight: 8,
  },
  fullnameAndUsername: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fullname: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginRight: 4, // Space between fullname and username
  },
  username: {
    color: '#888888',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  tweetContainer: {
    marginBottom: 8,
    paddingVertical: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  time: {
    color: '#888888',
  },
  contentContainer: {
    marginTop: 4,
    marginBottom: 10,
  },
  content: {
    color: '#ffffff',
  },
  readMoreButton: {
    marginTop: 4,
  },
  readMoreText: {
    color: '#1DA1F2', 
    fontWeight: 'bold',
    fontSize: 10
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 5,
    color: '#888888',
    fontSize: 13,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noTweets: {
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#111',
    marginVertical: 15,
  },
});


export default TwitterScreen;