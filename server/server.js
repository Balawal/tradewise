const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');
const puppeteer = require('puppeteer');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();
const cache = new NodeCache({ stdTTL: 600 }); // Cache data for 10 minutes

app.use(cors());
app.use(express.json());

const ALPHA_VANTAGE_API_KEY = '6ADIY1OCTVMPVEY0'; 

// Endpoint to search for stocks
app.get('/api/search-query', async (req, res) => {
  console.log('Received request for stock search');
  
  const { keywords } = req.query;

  if (!keywords) {
    return res.status(400).json({ error: 'Keywords parameter is required' });
  }

  try {
    const cacheKey = `search-query-${keywords}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: keywords,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const searchResults = response.data;
    cache.set(cacheKey, searchResults);

    res.json(searchResults);
  } catch (error) {
    console.error('Error fetching stock search results:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock search results' });
  }
});


// Endpoint for stock fundamentals
app.get('/api/stock-fundamentals', async (req, res) => {
  console.log('Received request for stock fundamentals');
  
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  try {
    const cacheKey = `stock-fundamentals-${symbol}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const stockDetails = response.data;
    cache.set(cacheKey, stockDetails);

    res.json(stockDetails);
  } catch (error) {
    console.error('Error fetching stock details:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock details' });
  }
});


// Endpoint for stock SMA
app.get('/api/stock-moving-averages', async (req, res) => {
  console.log('Received request for stock moving averages');
  
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  try {
    const cacheKey = `stock-moving-averages-${symbol}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch 50-day SMA
    const sma50Response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'SMA',
        symbol: symbol,
        interval: 'daily',
        time_period: 50,
        series_type: 'close',
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const sma50 = sma50Response.data['Technical Analysis: SMA'];

    // Fetch 200-day SMA
    const sma200Response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'SMA',
        symbol: symbol,
        interval: 'daily',
        time_period: 200,
        series_type: 'close',
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const sma200 = sma200Response.data['Technical Analysis: SMA'];

    // Extract the most recent 50-day and 200-day SMA values
    const latestDate50 = Object.keys(sma50)[0];
    const latestDate200 = Object.keys(sma200)[0];

    const response = {
      symbol: symbol,
      '50_day_SMA': sma50[latestDate50]['SMA'],
      '200_day_SMA': sma200[latestDate200]['SMA'],
    };

    // Cache the response
    cache.set(cacheKey, response);

    res.json(response);
  } catch (error) {
    console.error('Error fetching moving averages:', error.message);
    res.status(500).json({ error: 'Failed to fetch moving averages' });
  }
});


//Endpoint for stock volume
app.get('/api/stock-volume', async (req, res) => {
  console.log('Received request for stock volume');

  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  try {
    const cacheKey = `stock-volume-${symbol}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol.toUpperCase(), // Ensure symbol is uppercase
        outputsize: 'full',
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const data = response.data;
    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      return res.status(404).json({ error: 'No data found for the provided symbol' });
    }

    const dates = Object.keys(timeSeries);
    const mostRecentDate = dates[0];
    const mostRecentData = timeSeries[mostRecentDate];

    const open = parseFloat(mostRecentData['1. open']);
    const close = parseFloat(mostRecentData['4. close']);
    const volume = parseInt(mostRecentData['5. volume']);

    // Calculate 10-day and 30-day average volumes
    const volumeArray = dates.slice(0, 365).map(date => parseInt(timeSeries[date]['5. volume'])).reverse();
    const avgVolume10 = volumeArray.slice(0, 10).reduce((sum, v) => sum + v, 0) / Math.min(10, volumeArray.length);
    const avgVolume30 = volumeArray.slice(0, 30).reduce((sum, v) => sum + v, 0) / Math.min(30, volumeArray.length);
    const avgVolume365 = volumeArray.slice(0, 365).reduce((sum,v) => sum + v, 0) / Math.min(365, volumeArray.length);

    // Calculate YTD change
    const oneYearAgoDate = new Date();
    oneYearAgoDate.setFullYear(oneYearAgoDate.getFullYear() - 1);
    let oneYearAgoDateString = oneYearAgoDate.toISOString().split('T')[0];
    let oneYearAgoClose = null;

    // Find the closest available trading day to one year ago
    while (!oneYearAgoClose && oneYearAgoDateString < mostRecentDate) {
      if (timeSeries[oneYearAgoDateString]) {
        oneYearAgoClose = parseFloat(timeSeries[oneYearAgoDateString]['4. close']);
      } else {
        oneYearAgoDate.setDate(oneYearAgoDate.getDate() + 1);
        oneYearAgoDateString = oneYearAgoDate.toISOString().split('T')[0];
      }
    }

    if (oneYearAgoClose === null) {
      oneYearAgoClose = close; // Fallback if no data is found within the year
    }

    const ytdChange = oneYearAgoClose ? ((close - oneYearAgoClose) / oneYearAgoClose) * 100 : 0;
  
    const result = {
      mostRecent: {
        date: mostRecentDate,
        open,
        close,
        volume,
      },
      averageVolumes: {
        avgVolume10,
        avgVolume30,
        avgVolume365
      },
      ytdChange,
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching stock volume:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock volume' });
  }
});


//Endpoint to get stock earnings
app.get('/api/stock-earnings', async (req, res) => {
  console.log('Received request for stock earnings');
  
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  try {
    const cacheKey = `stock-earnings-${symbol}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'EARNINGS',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const earnings = response.data;
    cache.set(cacheKey, earnings);

    res.json(earnings);
  } catch (error) {
    console.error('Error fetching stock earnings:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock earnings' });
  }
});

const determineSentiment = (score) => {
  if (score >= 0.15) return 'positive';
  if (score <= -0.15) return 'negative';
  return 'neutral';
};


//Endpoint to get stock sentiment scores 
app.get('/api/stock-sentiment', async (req, res) => {
  console.log('Received request for stock sentiment');
  
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol parameter is required' });
  }

  try {
    const cacheKey = `stock-sentiment-${symbol}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Call Alpha Vantage News Sentiment API
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: symbol,
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });

    const newsData = response.data.feed;

    if (!newsData || newsData.length === 0) {
      return res.status(404).json({ error: 'No sentiment data found for the specified stock.' });
    }

    let positiveCount = 0;
    let negativeCount = 0;
    let tickerSentimentScore = 0;
    const articles = [];

    // Loop through news data to calculate sentiment score and count positive/negative sentiments
    newsData.forEach((article) => {
      const tickerData = article.ticker_sentiment.find(ticker => ticker.ticker === symbol.toUpperCase());

      if (tickerData) {
        const score = parseFloat(tickerData.ticker_sentiment_score);

        if (determineSentiment(score) === 'positive') {
          positiveCount++;
        } else if (determineSentiment(score) === 'negative') {
          negativeCount++;
        }

        tickerSentimentScore += score;

        articles.push({
          title: article.title,
          url: article.url,
          banner_image: article.banner_image,
          source: article.source
        });
      }
    });

    // Average sentiment score
    tickerSentimentScore = tickerSentimentScore / newsData.length;

    const sentimentSummary = {
      symbol,
      tickerSentimentScore: tickerSentimentScore.toFixed(3),
      positiveCount,
      negativeCount,
      totalArticles: newsData.length,
      articles,
    };

    // Cache the response data
    cache.set(cacheKey, sentimentSummary);

    res.json(sentimentSummary);
  } catch (error) {
    console.error('Error fetching stock sentiment:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock sentiment' });
  }
});

const ALPACA_API_KEY = 'PKH9EBVMYSPWD2P7CN1F';
const ALPACA_API_SECRET = 'Rj6GHHhlEauKnnsyk6QN8JNczpZacRZbwdnnZ4a5';

const alpacaHeaders = {
  'APCA-API-KEY-ID': ALPACA_API_KEY,
  'APCA-API-SECRET-KEY': ALPACA_API_SECRET,
};

// Endpoint to get top movers: stocks
app.get('/api/top-movers', async (req, res) => {
  console.log('Received request for top movers');
  try {
    const cacheKey = 'top-movers';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`https://data.alpaca.markets/v1beta1/screener/stocks/movers?top=5`, {
      headers: alpacaHeaders,
    });

    const topMovers = response.data;
    cache.set(cacheKey, topMovers);

    res.json(topMovers);
  } catch (error) {
    console.error('Error fetching top movers:', error.message);
    res.status(500).json({ error: 'Failed to fetch top movers' });
  }
});


//Endpoint to get top movers: crypto
app.get('/api/top-movers-crypto', async (req, res) => {
  console.log('Received request for top movers crypto');
  try {
    const cacheKey = 'top-movers-crypto';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`https://data.alpaca.markets/v1beta1/screener/crypto/movers?top=5`, {
      headers: alpacaHeaders,
    });

    const topMovers = response.data;
    cache.set(cacheKey, topMovers);

    res.json(topMovers);
  } catch (error) {
    console.error('Error fetching top movers crypto:', error.message);
    res.status(500).json({ error: 'Failed to fetch top movers crypto' });
  }
});



// Endpoint to get historical bars: stocks
app.get('/api/historical-bars', async (req, res) => {
  console.log('Received request for historical data');
  try {
    const symbols = req.query.symbols; // e.g., 'AAPL,MSFT,GOOG'
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const formattedStartDate = startDate.toISOString().split('T')[0];

    const cacheKey = `historical-bars-${symbols}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=1Day&feed=iex`, {
      headers: alpacaHeaders,
    });

    const barsData = response.data;
    cache.set(cacheKey, barsData);

    res.json(barsData);
  } catch (error) {
    console.error('Error fetching historical bars:', error.message);
    res.status(500).json({ error: 'Failed to fetch historical bars' });
  }
});


// Endpoint to get historical bars: crypto
app.get('/api/historical-bars-crypto', async (req, res) => {
  console.log('Received request for historical data crypto');
  try {
    const symbols = req.query.symbols; // e.g., 'AAPL,MSFT,GOOG'
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const formattedStartDate = startDate.toISOString().split('T')[0];

    const cacheKey = `historical-bars-crypto-${symbols}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=1Day`, {
      headers: alpacaHeaders,
    });

    const barsData = response.data;
    cache.set(cacheKey, barsData);

    res.json(barsData);
  } catch (error) {
    console.error('Error fetching historical bars crypto:', error.message);
    res.status(500).json({ error: 'Failed to fetch historical bars crypto' });
  }
});


//Endpoint to get all news 
app.get('/api/news-articles', async (req, res) => {
  console.log('Received request for news articles');
  try{
    const cacheKey = 'news-articles';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`https://data.alpaca.markets/v1beta1/news?sort=desc&limit=25`, {
      headers: alpacaHeaders,
    });

    const newsData = response.data;
    cache.set(cacheKey, newsData);

    res.json(newsData);
  } catch (error) {
    console.error('Error fetching news articles:', error.message);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});




const tweetFilesDirectory = path.join(__dirname, 'tweet_files');

// Create the directory if it does not exist
if (!fs.existsSync(tweetFilesDirectory)) {
    fs.mkdirSync(tweetFilesDirectory);
}


// Function to clean text
function cleanText(text) {
  return text.replace(/[^\w\s@#.,!?]/g, '');
}

// Function to get formatted date
function getFormattedDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}-${String(date.getSeconds()).padStart(2, '0')}`;
}

cron.schedule('0 */12 * * *', async () => {
  
});

// Endpoint to scrape tweets
app.get('/api/scrape-tweets', async (req, res) => {
  console.log('Received request to scrape tweets');
  try {
    console.log('Starting the tweet scraping process...');
    const browser = await puppeteer.launch({ headless: false });
    console.log('Browser launched.');
    const page = await browser.newPage();
    console.log('New page created.');
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.3');
                            //Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36
    console.log('User agent set.');

    const profiles = [
      //'https://nitter.privacydev.net/AdamMancini4',
      //'https://xcancel.com/AdamMancini4',
      //'https://nitter.poast.org/AdamMancini4',
      'https://nitter.lucabased.xyz/AdamMancini4',
      'https://nitter.lucabased.xyz/InvestorsLive',
      'https://nitter.lucabased.xyz/RedDogT3',
    ];

    let allTweets = [];
    for (const url of profiles) {
      console.log(`Navigating to ${url}`);
      const response = await page.goto(url);
      const statusCode = response.status();
      console.log(`HTTP Status Code for ${url}: ${statusCode}`);

      if (statusCode !== 200) {
        console.error(`Failed to access ${url}. Skipping...`);
        await new Promise(resolve => setTimeout(resolve, 25000)); // Wait for 25 seconds before the next profile
        continue;
      }

      console.log(`Scraping tweets from ${url}`);
      const tweets = await page.$$eval('.timeline-item', nodes => {
        return nodes.map(node => {
          let content = (node.querySelector('.tweet-content')?.innerText || '').replace(/\n/g, ' ').replace(/,/g, ';');
          const time = node.querySelector('.tweet-date a')?.innerText || '';
          const link = node.querySelector('.tweet-link')?.href || '';
          const stats = node.querySelector('.tweet-stats')?.innerText || '';
          const avatar = node.querySelector('.tweet-avatar img')?.src || '';
          const fullname = node.querySelector('.fullname')?.innerText || '';
          //console.log(`Avatar URL: ${avatar}`);
          return { content, time, link, stats, avatar, fullname };
        });
      });

      // Clean the tweets content after retrieving them
      for (let tweet of tweets) {
        tweet.content = cleanText(tweet.content);
      }

      for (let tweet of tweets) {
        tweet.stats = tweet.stats.replace(/,/g, ''); // Remove commas
      }

      allTweets = allTweets.concat(tweets.map(tweet => ({ url, ...tweet })));

      console.log(`Scraped ${tweets.length} tweets from ${url}`);
      await new Promise(resolve => setTimeout(resolve, 25000)); // Wait for 25 seconds before the next profile
    }

    await browser.close();

    
    const csvContent = allTweets.map(tweet => `${tweet.url},${tweet.content}, ${tweet.time},${tweet.link}, "${tweet.stats.replace(/\n/g, ' ')}", ${tweet.avatar}, ${tweet.fullname}`).join('\n');
    const outputFilename = `tweets_${getFormattedDate()}.csv`;
    const outputFilePath = path.join(tweetFilesDirectory, outputFilename);

    console.log(`Writing tweets to ${outputFilePath}`);
    fs.writeFileSync(outputFilePath, `URL,Content,Time,Link\n${csvContent}`);
    console.log(`Tweets saved to ${outputFilePath}`);

    res.status(200).json({ message: 'Tweets scraped successfully', filename: outputFilename });
  } catch (error) {
    console.error('Error scraping tweets:', error.message);
    res.status(500).json({ error: 'Failed to scrape tweets' });
  }
});

// Endpoint to get scraped tweets
app.get('/api/get-tweets', async (req, res) => {
  try {
    const filename = req.query.filename;
    const filePath = path.join(tweetFilesDirectory, filename);

    if (!filename || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File not found or no filename provided' });
    }

    const csvData = fs.readFileSync(filePath, 'utf8');
    const lines = csvData.split('\n').slice(1); // Skip the header line
    const tweets = lines.map(line => {
      const [url, content, time, link, stats, avatar, fullname] = line.split(',');
      return { url, content, time, link, stats, avatar, fullname };
    });

    res.status(200).json(tweets);
  } catch (error) {
    console.error('Error reading tweets:', error.message);
    res.status(500).json({ error: 'Failed to retrieve tweets' });
  }
});

// Endpoint to get the latest tweet file
app.get('/api/latest-tweet-file', async (req, res) => {
  try {
    const files = fs.readdirSync(tweetFilesDirectory);
    const csvFiles = files.filter(file => file.startsWith('tweets_') && file.endsWith('.csv'));

    if (csvFiles.length === 0) {
      return res.status(404).json({ error: 'No tweet files found' });
    }

    // Sort files by modification time, latest first
    const latestFile = csvFiles.sort((a, b) => fs.statSync(path.join(tweetFilesDirectory, b)).mtime - fs.statSync(path.join(tweetFilesDirectory, a)).mtime)[0];

    res.status(200).json({ filename: latestFile });
  } catch (error) {
    console.error('Error fetching latest tweet file:', error.message);
    res.status(500).json({ error: 'Failed to retrieve latest tweet file' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});