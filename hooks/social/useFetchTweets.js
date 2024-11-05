import { useState, useEffect } from 'react';
import { REACT_APP_BASE_URL } from '@env';
import { parseTweetStats } from '../../utils/utils';

const DEFAULT_AVATAR = 'https://pbs.twimg.com/profile_images/899127121670541312/ZVBuToeP_bigger.jpg';

export const useFetchTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(`${REACT_APP_BASE_URL}/scrape-tweets`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const latestFileResponse = await fetch(`${REACT_APP_BASE_URL}/latest-tweet-file`);
        if (!latestFileResponse.ok) throw new Error('Failed to fetch latest tweet file');

        const latestFileData = await latestFileResponse.json();
        const filename = latestFileData.filename || 'backup_tweets.csv';

        const tweetsResponse = await fetch(`${REACT_APP_BASE_URL}/get-tweets?filename=${filename}`);
        if (!tweetsResponse.ok) throw new Error('Failed to fetch tweets');

        const tweetsData = await tweetsResponse.json();

        const parsedTweets = tweetsData.map(tweet => ({
          ...tweet,
          stats: parseTweetStats(tweet.stats),
          avatar: tweet.avatar.trim() || DEFAULT_AVATAR,
          fullname: tweet.fullname.trim(),
        }));

        setTweets(parsedTweets);
      } catch (err) {
        console.error(err);
        try {
          const backupTweetsResponse = await fetch(`${REACT_APP_BASE_URL}/get-tweets?filename=backup_tweets.csv`);
          if (!backupTweetsResponse.ok) throw new Error('Failed to fetch backup tweets');

          const backupTweetsData = await backupTweetsResponse.json();
          const parsedBackupTweets = backupTweetsData.map(tweet => ({
            ...tweet,
            stats: parseTweetStats(tweet.stats),
            avatar: DEFAULT_AVATAR,
            fullname: tweet.fullname.trim(),
          }));

          setTweets(parsedBackupTweets);
        } catch (backupError) {
          console.error('Failed to load backup tweets:', backupError.message);
          setError(backupError.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  return { tweets, loading, error };
};