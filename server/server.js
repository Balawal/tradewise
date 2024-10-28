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
const cache = new NodeCache({ stdTTL: 60 }); // Cache data for 10 minutes

app.use(cors());
app.use(express.json());

const CRYPTO_COMPARE_API_KEY = process.env.CRYPTO_COMPARE_API_KEY;

//Endpoint for most active crypto
app.get('/api/top-coins', async (req, res) => {
  console.log('Received request for top coins by volume');

  // Get the 'limit' and 'page' query parameters from the request, defaulting to 10 and 0 (first page)
  const { limit = 10, page = 0, tsym = 'USD' } = req.query;

  // Construct the cache key based on query params
  const cacheKey = `top-coins-${limit}-${page}-${tsym}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    // Construct the API URL with the parameters
    const url = `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=${limit}&page=${page}&tsym=${tsym}&api_key=${CRYPTO_COMPARE_API_KEY}`;

    // Make the request to the CryptoCompare API
    const response = await axios.get(url);

    // Extract the relevant data
    const topCoinsData = response.data.Data.map(coin => {
      const usdData = coin.RAW && coin.RAW.USD;
      return {
        symbol: `${coin.CoinInfo.Internal}/USD`,
        volume: usdData ? coin.RAW.USD.VOLUME24HOURTO : 0,
        percent_change: usdData ? coin.RAW.USD.CHANGEPCT24HOUR : 0
      };
    });

    // Cache the processed data with a 120-second timeout (2 minutes)
    cache.set(cacheKey, topCoinsData, 120);

    // Return the processed data
    res.json(topCoinsData);
  } catch (error) {
    console.error('Error fetching top coins by volume:', error.message);
    res.status(500).json({ error: 'Failed to fetch top coins by volume' });
  }
});

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;


//Endpoint for stock calculator
app.get('/api/stock-calculator', async (req, res) => {
  console.log('received request for stock calculator');
  try {
    const symbols = req.query.symbols;
    const startDate = req.query.start;
    
    // Calculate yesterday's date as the end date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const endDate = yesterday.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'

    if (!startDate) {
      return res.status(400).json({ error: 'Start date is required' });
    }

    const cacheKey = `bars-${symbols}-${startDate}-${endDate}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch stock price data
    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${startDate}&end=${endDate}&timeframe=1Day&feed=iex`, {
      headers: alpacaHeaders,
    });

    const barsData = response.data.bars[symbols];
    const firstBar = barsData[0];  
    const lastBar = barsData[barsData.length - 1];  

    if (!firstBar || !lastBar) {
      return res.status(500).json({ error: `Insufficient data for ${symbols}` });
    }

    const investmentAmount = parseFloat(req.query.investment || 0);

    // Calculate total shares
    const totalShares = investmentAmount / firstBar.c;

    // Calculate capital gain
    const capitalGain = (lastBar.c - firstBar.c) * totalShares;

    // Calculate total return
    const totalReturn = (capitalGain / firstBar.c) * 100;

    // Calculate annual return (CAGR)
    const years = (new Date(endDate) - new Date(startDate)) / (365 * 24 * 60 * 60 * 1000);
    const annualReturn = ((lastBar.c / firstBar.c) ** (1 / years) - 1) * 100;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate duration
    const durationYears = end.getFullYear() - start.getFullYear();
    const durationMonths = end.getMonth() - start.getMonth();
    const durationDays = end.getDate() - start.getDate();

    let yearsToDisplay = durationYears;
    let monthsToDisplay = durationMonths;
    let daysToDisplay = durationDays;

    if (daysToDisplay < 0) {
      monthsToDisplay--;
      const lastMonthDate = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
      daysToDisplay += lastMonthDate;
    }

    if (monthsToDisplay < 0) {
      yearsToDisplay--;
      monthsToDisplay += 12;
    }

    const duration = {};
    if (yearsToDisplay > 0) duration.years = yearsToDisplay;
    if (monthsToDisplay > 0) duration.months = monthsToDisplay;
    if (daysToDisplay >= 0) duration.days = daysToDisplay;

    // Fetch and filter dividend data
    const dividendResponse = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${symbols}?apikey=${FIN_MODEL_API_KEY}`);

    const filteredDividends = dividendResponse.data.historical.filter(dividend => {
      const dividendDate = new Date(dividend.date);
      return dividendDate >= new Date(startDate) && dividendDate <= new Date(endDate);
    });

    // Calculate total dividend
    let totalDividend = 0;
    filteredDividends.forEach(dividend => {
      totalDividend += dividend.dividend * totalShares; // Dividend per share * total shares owned
    });

    // Calculate times distributed and dividend average
    const timesDistributed = filteredDividends.length;
    const dividendAverage = totalDividend / timesDistributed;

    // Calculate total profit
    const finalValueOfShares = lastBar.c * totalShares;
    const totalProfit = (finalValueOfShares + totalDividend) - investmentAmount;

    const responseData = {
      symbol: symbols,
      purchasePrice: firstBar.c,
      currentPrice: lastBar.c,
      totalShares: totalShares,
      capitalGain: capitalGain,
      totalProfit: totalProfit,
      totalReturn: totalReturn,
      annualReturn: annualReturn,
      duration,
      dividends: {
        totalDividend: totalDividend.toFixed(2),
        timesDistributed: timesDistributed,
        dividendAverage: dividendAverage.toFixed(2),
      }
    };

    cache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});



//Endpoint for stock calculator with reinvestment
app.get('/api/stock-calculator-reinvest', async (req, res) => {
  console.log('received request for reinvesting stock calculator');
  try {
    const symbols = req.query.symbols;
    const startDate = req.query.start;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const endDate = new Date(yesterday).toISOString().split('T')[0];
    
    const investmentAmount = parseFloat(req.query.investment || 0);
    const contributionAmount = parseFloat(req.query.contribution || 0); // User-defined contribution amount
    const contributionFrequency = req.query.frequency || 'monthly'; // Weekly, Bi-Weekly, Monthly, etc.
    
    if (!startDate) {
      return res.status(400).json({ error: 'Start date is required' });
    }

    const cacheKey = `bars-${symbols}-${startDate}-${endDate}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch stock price data
    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${startDate}&end=${endDate}&timeframe=1Day&feed=iex`, {
      headers: alpacaHeaders,
    });

    const barsData = response.data.bars[symbols];
    const firstBar = barsData[0];  
    const lastBar = barsData[barsData.length - 1];  

    if (!firstBar || !lastBar) {
      return res.status(500).json({ error: `Insufficient data for ${symbols}` });
    }

    // Calculate total shares from initial investment
    const totalSharesInitial = investmentAmount / firstBar.c;

    // Fetch dividend data
    const dividendResponse = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${symbols}?apikey=${FIN_MODEL_API_KEY}`);

    const filteredDividends = dividendResponse.data.historical.filter(dividend => {
      const dividendDate = new Date(dividend.date);
      return dividendDate >= new Date(startDate) && dividendDate <= new Date(endDate);
    });

    const dividendDates = filteredDividends.map(dividend => dividend.date);
    const dividendPrices = await getPriceOnDividendDates(symbols, dividendDates);

    let totalDividend = 0;
    let sharesFromDividends = 0;

    // Calculate DRIP (shares from reinvested dividends)
    filteredDividends.forEach(dividend => {
      const dividendPrice = dividendPrices[dividend.date];  // Get price on dividend date
      if (dividendPrice) {
        const dividendShares = (dividend.dividend * totalSharesInitial) / dividendPrice;  // Calculate shares based on dividend date price
        sharesFromDividends += dividendShares;
        totalDividend += dividend.dividend * totalSharesInitial;  // Total dividend value
      }
    });

    // Calculate periodic contributions
    const contributionDates = generateContributionDates(startDate, endDate, contributionFrequency);
    let contributionShares = 0;
    let totalContributions = investmentAmount; // Start with initial investment

    contributionDates.forEach((contributionDate) => {
      const bar = barsData.find(b => new Date(b.t).toISOString().split('T')[0] === contributionDate);
      if (bar) {
        contributionShares += contributionAmount / bar.c;
        totalContributions += contributionAmount; // Add to total contributions
      }
    });

    // Subtract initial investment from total contributio

    // Calculate total shares (initial + contribution shares + dividend reinvestment)
    const totalShares = totalSharesInitial + contributionShares + sharesFromDividends;

    // Final value of shares
    const finalValueOfShares = totalShares * lastBar.c;

    // Calculate total profit
    const totalProfit = finalValueOfShares + totalDividend - totalContributions;

    // Calculate capital gain
    const capitalGain = (lastBar.c - firstBar.c) * totalShares;

    // Calculate total return
    const totalReturn = ((capitalGain / totalContributions) * 100);

    // Calculate annual return (CAGR)
    const years = (new Date(endDate) - new Date(startDate)) / (365 * 24 * 60 * 60 * 1000);
    const annualReturn = ((finalValueOfShares / totalContributions) ** (1 / years) - 1) * 100;

    // Calculate duration
    const duration = calculateDuration(startDate, endDate);

    finalContributions = totalContributions - investmentAmount;

    const responseData = {
      symbol: symbols,
      purchasePrice: firstBar.c,
      currentPrice: lastBar.c,
      totalShares: totalShares,
      capitalGain: capitalGain,
      totalProfit: totalProfit,
      totalReturn: totalReturn,
      annualReturn: annualReturn,
      duration,
      dividends: {
        totalDividend: totalDividend.toFixed(2),
        timesDistributed: filteredDividends.length,
        dividendAverage: (totalDividend / filteredDividends.length).toFixed(2),
      },
      periodicContributions: {
        totalContribution: finalContributions.toFixed(2),
        contributionShares: contributionShares.toFixed(4),
      },
      dripValue: (sharesFromDividends * lastBar.c).toFixed(2) // DRIP value
    };

    cache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

async function getPriceOnDividendDates(symbol, dividendDates) {
  const dividendPrices = {};

  // Loop through each dividend date to fetch historical prices
  for (const date of dividendDates) {
    const start = new Date(date);
    const end = new Date(date);
    start.setDate(start.getDate() - 1); // Fetch price one day before dividend date
    end.setDate(end.getDate() + 1); // Fetch price one day after dividend date

    // Fetch historical stock prices from Alpaca for the date range
    const priceResponse = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbol}&start=${start.toISOString().split('T')[0]}&end=${end.toISOString().split('T')[0]}&timeframe=1Day&feed=iex`, {
      headers: alpacaHeaders,
    });

    // If the price data exists for the symbol, store the close price for that day
    if (priceResponse.data.bars[symbol]) {
      const priceData = priceResponse.data.bars[symbol];
      const closestBar = priceData.find(bar => new Date(bar.t).toISOString().split('T')[0] === date) || priceData[0];
      dividendPrices[date] = closestBar ? closestBar.c : null;
    }
  }

  return dividendPrices;
}

// Helper function to generate contribution dates based on the frequency
function generateContributionDates(startDate, endDate, frequency) {
  const contributions = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    contributions.push(currentDate.toISOString().split('T')[0]);
    switch (frequency) {
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'bi-weekly':
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'bi-monthly':
        currentDate.setMonth(currentDate.getMonth() + 2);
        break;
      case 'annually':
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
  }
  return contributions;
}

// Helper function to calculate duration between dates
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let durationYears = end.getFullYear() - start.getFullYear();
  let durationMonths = end.getMonth() - start.getMonth();
  let durationDays = end.getDate() - start.getDate();

  // Adjust for negative months or days
  if (durationDays < 0) {
    durationMonths -= 1;
    durationDays += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if (durationMonths < 0) {
    durationYears -= 1;
    durationMonths += 12;
  }

  return { years: durationYears, months: durationMonths, days: durationDays };
}

//Endpoint to get all crypto news 
app.get('/api/news-crypto', async (req, res) => {
  console.log('Received request for news crypto');
  
  // Get the 'symbols' query parameter from the request
  const { symbols } = req.query;

  // Check if symbols were provided, if not, set it to an empty string
  const symbolQuery = symbols ? `${symbols}USD` : 'USD';

  try {
    const cacheKey = `news-crypto-${symbolQuery}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Update the API call to include the symbols query parameter
    const response = await axios.get(`https://data.alpaca.markets/v1beta1/news?symbols=${symbolQuery}&sort=desc&limit=12`, {
      headers: alpacaHeaders,
    });

    const newsData = response.data;
    cache.set(cacheKey, newsData);

    res.json(newsData);
  } catch (error) {
    console.error('Error fetching news crypto:', error.message);
    res.status(500).json({ error: 'Failed to fetch news crypto' });
  }
});


//Endpoint to get one day crypto bars
app.get('/api/crypto-one-day-bars', async (req, res) => {
  const { coinName, vs_currency = 'usd', days = '1' } = req.query;

  if (!coinName) {
    return res.status(400).json({ error: 'Coin name or symbol is required' });
  }

  try {
    // Step 1: Fetch the coin ID by coinName (similar to your previous logic)
    const coinsListResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': COINGECKO_API_KEY,
      },
    });
    const coinsList = coinsListResponse.data;

    // Find the coin by name or symbol
    const coin = coinsList.find(c => c.name.toLowerCase() === coinName.toLowerCase() || c.symbol.toLowerCase() === coinName.toLowerCase());

    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    const coinId = coin.id;

    // Step 2: Fetch the historical market data for the coinId
    const historicalDataResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vs_currency,
        days: days,
      },
    });

    const pricesData = historicalDataResponse.data.prices.map(price => price[1]);

    const firstPrice = pricesData[0];
    const lastPrice = pricesData[pricesData.length - 1];

    const priceDifference = lastPrice - firstPrice;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Respond with the extracted prices, priceDifference, and percentChange
    res.json({
      prices: pricesData,
      priceDifference: priceDifference.toFixed(2),
      percentChange: percentChange.toFixed(2),
    });
    
  } catch (error) {
    console.error('Error fetching one day crypto data:', error.message);
    res.status(500).json({ error: 'Failed to fetch one day crypto data' });
  }
});

//Endpoint to get one week crypto bars
app.get('/api/crypto-one-week-bars', async (req, res) => {
  const { coinName, vs_currency = 'usd', days = '7' } = req.query;

  if (!coinName) {
    return res.status(400).json({ error: 'Coin name or symbol is required' });
  }

  try {
    // Step 1: Fetch the coin ID by coinName (similar to your previous logic)
    const coinsListResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': COINGECKO_API_KEY,
      },
    });
    const coinsList = coinsListResponse.data;

    // Find the coin by name or symbol
    const coin = coinsList.find(c => c.name.toLowerCase() === coinName.toLowerCase() || c.symbol.toLowerCase() === coinName.toLowerCase());

    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    const coinId = coin.id;

    // Step 2: Fetch the historical market data for the coinId
    const historicalDataResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vs_currency,
        days: days,
      },
    });

    const pricesData = historicalDataResponse.data.prices.map(price => price[1]);

    const firstPrice = pricesData[0];
    const lastPrice = pricesData[pricesData.length - 1];

    const priceDifference = lastPrice - firstPrice;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Respond with the extracted prices, priceDifference, and percentChange
    res.json({
      prices: pricesData,
      priceDifference: priceDifference.toFixed(2),
      percentChange: percentChange.toFixed(2),
    });
    
  } catch (error) {
    console.error('Error fetching one week crypto data:', error.message);
    res.status(500).json({ error: 'Failed to fetch one week crypto data' });
  }
});

//Endpoint to get one month crypto bars
app.get('/api/crypto-one-month-bars', async (req, res) => {
  const { coinName, vs_currency = 'usd', days = '30' } = req.query;

  if (!coinName) {
    return res.status(400).json({ error: 'Coin name or symbol is required' });
  }

  try {
    // Step 1: Fetch the coin ID by coinName (similar to your previous logic)
    const coinsListResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': COINGECKO_API_KEY,
      },
    });
    const coinsList = coinsListResponse.data;

    // Find the coin by name or symbol
    const coin = coinsList.find(c => c.name.toLowerCase() === coinName.toLowerCase() || c.symbol.toLowerCase() === coinName.toLowerCase());

    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    const coinId = coin.id;

    // Step 2: Fetch the historical market data for the coinId
    const historicalDataResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vs_currency,
        days: days,
      },
    });

    const pricesData = historicalDataResponse.data.prices.map(price => price[1]);

    const firstPrice = pricesData[0];
    const lastPrice = pricesData[pricesData.length - 1];

    const priceDifference = lastPrice - firstPrice;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Respond with the extracted prices, priceDifference, and percentChange
    res.json({
      prices: pricesData,
      priceDifference: priceDifference.toFixed(2),
      percentChange: percentChange.toFixed(2),
    });
    
  } catch (error) {
    console.error('Error fetching one month crypto data:', error.message);
    res.status(500).json({ error: 'Failed to fetch one month crypto data' });
  }
});

//Endpoint to get three month crypto bars
app.get('/api/crypto-three-month-bars', async (req, res) => {
  const { coinName, vs_currency = 'usd', days = '90' } = req.query;

  if (!coinName) {
    return res.status(400).json({ error: 'Coin name or symbol is required' });
  }

  try {
    // Step 1: Fetch the coin ID by coinName (similar to your previous logic)
    const coinsListResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': COINGECKO_API_KEY,
      },
    });
    const coinsList = coinsListResponse.data;

    // Find the coin by name or symbol
    const coin = coinsList.find(c => c.name.toLowerCase() === coinName.toLowerCase() || c.symbol.toLowerCase() === coinName.toLowerCase());

    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    const coinId = coin.id;

    // Step 2: Fetch the historical market data for the coinId
    const historicalDataResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vs_currency,
        days: days,
      },
    });

    const pricesData = historicalDataResponse.data.prices.map(price => price[1]);

    const firstPrice = pricesData[0];
    const lastPrice = pricesData[pricesData.length - 1];

    const priceDifference = lastPrice - firstPrice;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Respond with the extracted prices, priceDifference, and percentChange
    res.json({
      prices: pricesData,
      priceDifference: priceDifference.toFixed(2),
      percentChange: percentChange.toFixed(2),
    });
    
  } catch (error) {
    console.error('Error fetching three month crypto data:', error.message);
    res.status(500).json({ error: 'Failed to fetch three month crypto data' });
  }
});

//Endpoint to get six month crypto bars
app.get('/api/crypto-six-month-bars', async (req, res) => {
  const { coinName, vs_currency = 'usd', days = '180' } = req.query;

  if (!coinName) {
    return res.status(400).json({ error: 'Coin name or symbol is required' });
  }

  try {
    // Step 1: Fetch the coin ID by coinName (similar to your previous logic)
    const coinsListResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': COINGECKO_API_KEY,
      },
    });
    const coinsList = coinsListResponse.data;

    // Find the coin by name or symbol
    const coin = coinsList.find(c => c.name.toLowerCase() === coinName.toLowerCase() || c.symbol.toLowerCase() === coinName.toLowerCase());

    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    const coinId = coin.id;

    // Step 2: Fetch the historical market data for the coinId
    const historicalDataResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vs_currency,
        days: days,
      },
    });

    const pricesData = historicalDataResponse.data.prices.map(price => price[1]);

    const firstPrice = pricesData[0];
    const lastPrice = pricesData[pricesData.length - 1];

    const priceDifference = lastPrice - firstPrice;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Respond with the extracted prices, priceDifference, and percentChange
    res.json({
      prices: pricesData,
      priceDifference: priceDifference.toFixed(2),
      percentChange: percentChange.toFixed(2),
    });
    
  } catch (error) {
    console.error('Error fetching six month crypto data:', error.message);
    res.status(500).json({ error: 'Failed to fetch six month crypto data' });
  }
});

//Endpoint to get one day crypto bars
app.get('/api/crypto-one-year-bars', async (req, res) => {
  const { coinName, vs_currency = 'usd', days = '365' } = req.query;

  if (!coinName) {
    return res.status(400).json({ error: 'Coin name or symbol is required' });
  }

  try {
    // Step 1: Fetch the coin ID by coinName (similar to your previous logic)
    const coinsListResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': COINGECKO_API_KEY,
      },
    });
    const coinsList = coinsListResponse.data;

    // Find the coin by name or symbol
    const coin = coinsList.find(c => c.name.toLowerCase() === coinName.toLowerCase() || c.symbol.toLowerCase() === coinName.toLowerCase());

    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    const coinId = coin.id;

    // Step 2: Fetch the historical market data for the coinId
    const historicalDataResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: vs_currency,
        days: days,
      },
    });

    const pricesData = historicalDataResponse.data.prices.map(price => price[1]);

    const firstPrice = pricesData[0];
    const lastPrice = pricesData[pricesData.length - 1];

    const priceDifference = lastPrice - firstPrice;
    const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Respond with the extracted prices, priceDifference, and percentChange
    res.json({
      prices: pricesData,
      priceDifference: priceDifference.toFixed(2),
      percentChange: percentChange.toFixed(2),
    });
    
  } catch (error) {
    console.error('Error fetching one year crypto data:', error.message);
    res.status(500).json({ error: 'Failed to fetch one year crypto data' });
  }
});


//Endpoint to get crypto market data
app.get('/api/crypto-coin-data', async (req, res) => {
  const { coinName } = req.query;

  if (!coinName) {
    return res.status(400).json({ error: 'Coin name or symbol is required' });
  }

  try {
    // Step 1: Fetch coins list and filter to get the coin ID by name or symbol
    const cacheKey = 'crypto-coin-data';
    let coinsList = cache.get(cacheKey);


    const coinsListResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list', {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': COINGECKO_API_KEY,
      },
    });
    coinsList = coinsListResponse.data;


    // Find the coin by name or symbol
    const coin = coinsList.find(c => c.name.toLowerCase() === coinName.toLowerCase() || c.symbol.toLowerCase() === coinName.toLowerCase());

    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    const coinId = coin.id;
    console.log('heres the id:' , coinId);

    // Step 2: Fetch full coin data by ID

    const coinDataResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
    });
    
    coinData = coinDataResponse.data;
    // Respond with coin data
    res.json(coinData);

  } catch (error) {
    console.error('Error fetching coin data by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch coin data' });
  }
});




// Endpoint to search for crypto
app.get('/api/search-query-crypto', async (req, res) => {
  console.log('Received request for crypto search');
  
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const cacheKey = `search-query-crypto-${query}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get('https://api.coingecko.com/api/v3/search', {
      params: {
        query: query,
      },
    });

    const searchResults = response.data;
    const limitedResults = {
      coins: searchResults.coins.slice(0, 10),
      exchanges: searchResults.exchanges.slice(0, 10)
    };

    cache.set(cacheKey, limitedResults);

    res.json(limitedResults);
  } catch (error) {
    console.error('Error fetching coin search results:', error.message);
    res.status(500).json({ error: 'Failed to fetch coin search results' });
  }
});



const FIN_MODEL_API_KEY = process.env.FIN_MODEL_API_KEY;


// Endpoint to get most active: stocks from alpaca api
app.get('/api/most-active', async (req, res) => {
  console.log('Received request for most active');
  try {
    const cacheKey = 'most-active';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch Alpaca API for volume data
    const alpacaResponse = await axios.get(`https://data.alpaca.markets/v1beta1/screener/stocks/most-actives?by=volume&top=10`, {
      headers: alpacaHeaders,
    });
    const alpacaData = alpacaResponse.data.most_actives;

    // Fetch Financial Model API for price and percentage change data
    const finModelResponse = await axios.get(`https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${FIN_MODEL_API_KEY}`);
    const finModelData = finModelResponse.data;

    // Merge both datasets based on symbol
    const mergedData = alpacaData.map(alpacaStock => {
      // Find the matching stock from Financial Model API by symbol
      const finModelStock = finModelData.find(stock => stock.symbol === alpacaStock.symbol);
      
      return {
        symbol: alpacaStock.symbol,
        volume: alpacaStock.volume,
        trade_count: alpacaStock.trade_count,
        // Merge in the fields from the Financial Model API
        price: finModelStock ? finModelStock.price : null,
        change: finModelStock ? finModelStock.change : null,
        percent_change: finModelStock ? finModelStock.changesPercentage : null,
      };
    });

    // Cache the merged data
    cache.set(cacheKey, mergedData);

    // Send the merged data as the response
    res.json(mergedData);
  } catch (error) {
    console.error('Error fetching most active stocks:', error.message);
    res.status(500).json({ error: 'Failed to fetch most active stocks' });
  }
});





















const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Endpoint to get earnings calendar
app.get('/api/earnings-calendar', async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Symbol is required' });
  }

  const horizon = '12month'; // Setting horizon to 12 months
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'EARNINGS_CALENDAR',
        symbol: symbol,
        horizon: horizon,
        apikey: apiKey,
      },
      responseType: 'text', // Ensure the response is treated as text
    });

    const csvData = response.data; // Get the CSV data from the response
    console.log('earnings data:::', csvData); // Log the raw CSV data

    // Now use your parseCSV function
    const earningsData = parseCSV(csvData);

    if (earningsData.length > 0) {
      const firstEarningsDate = earningsData[0].reportDate; // Access the first report date
      return res.json({ firstEarningsDate });
    }

    res.json({ firstEarningsDate: null }); // No earnings found
  } catch (error) {
    console.error('Error fetching earnings calendar:', error.message);
    res.status(500).json({ error: 'Failed to fetch earnings calendar' });
  }
});

// Function to parse CSV into JSON
const parseCSV = (csvString) => {
  // Check if csvString is defined and not empty
  if (!csvString) {
    throw new Error('CSV string is undefined or empty');
  }

  // Normalize line breaks and split the CSV string into rows
  const rows = csvString.split('\n').map(row => row.split(',').map(cell => cell.trim()));

  console.log('rows:::', rows);
  const headers = rows[0].map(header => header.replace(/\r/, '')); // Remove any carriage return from headers
  console.log('headers:::', headers);
  
  return rows.slice(1).map(row => {
    return row.reduce((acc, val, idx) => {
      acc[headers[idx]] = val; // No need to trim again since we've done it already
      return acc;
    }, {});
  });
};

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

    const limitedArticles = articles.slice(0, 12);

    // Average sentiment score
    tickerSentimentScore = tickerSentimentScore / newsData.length;

    const sentimentSummary = {
      symbol,
      tickerSentimentScore: tickerSentimentScore.toFixed(3),
      positiveCount,
      negativeCount,
      totalArticles: limitedArticles.length,
      articles: limitedArticles
    };

    // Cache the response data
    cache.set(cacheKey, sentimentSummary);

    res.json(sentimentSummary);
  } catch (error) {
    console.error('Error fetching stock sentiment:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock sentiment' });
  }
});
















const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
const ALPACA_API_SECRET = process.env.ALPACA_API_SECRET;

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


//Endpoint to get latest trade
app.get('/api/latest-trade', async (req, res) => {
  console.log('Received request for latest trade');
  try{
    const symbols = req.query.symbols;
    //console.log(symbols);
    const cacheKey = 'latest-trade';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/${symbols}/trades/latest?feed=iex`, {
      headers: alpacaHeaders, 
    });
    //console.log(response);

    const latestData = response.data;
    cache.set(cacheKey, latestData);

    res.json(latestData);
  } catch (error) {
    console.error('Error fetching latest trade:', error.message);
    res.status(500).json({ error: 'Failed to fetch latest trade' });
  }
});


// Endpoint to get latest  bars
app.get('/api/latest-bars', async (req, res) => {
  console.log('Received request for latest bars');
  try {
    const symbols = req.query.symbols; // e.g., 'AAPL,MSFT,GOOG'
    //console.log(symbols);
    const endDate = new Date().toISOString().split('T')[0];
    //console.log(endDate);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    //console.log(formattedStartDate);

    // Cache key for the specific request
    const cacheKey = `latest-bars-${symbols}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch the stock bars from Alpaca
    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=10Min&feed=iex`, {
      headers: alpacaHeaders,
    });
    //console.log(response);

    if (!response.data || !response.data.bars || !response.data.bars[symbols]) {
      return res.status(404).json({ [symbols]: { error: `No data available for symbol ${symbols}` } });
    }

    const barsData = response.data.bars[symbols];
    //console.log(barsData);

    const firstBar = barsData[0];  // The oldest bar (1 week ago)
    const lastBar = barsData[barsData.length - 1];  // The most recent bar

    if (!firstBar || !lastBar) {
      return res.status(500).json({ error: `Insufficient data for ${symbols}` });
    }

    const priceDifference = lastBar.c - firstBar.c; // Closing price difference
    const percentChange = ((priceDifference / firstBar.c) * 100).toFixed(2); // Percent change
    //console.log(priceDifference, percentChange);

    // Add the calculated data to the response
    const responseData = {
      symbol: symbols,
      bars: barsData,
      priceDifference: priceDifference,
      percentChange: percentChange,
    };


    // Cache the calculated data
    cache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching latest bars:', error.message);
    res.status(500).json({ error: 'Failed to fetch latest bars' });
  }
});


// Endpoint to get one week bars
app.get('/api/one-week-bars', async (req, res) => {
  console.log('Received request for one week bars');
  try {
    const symbols = req.query.symbols; // e.g., 'AAPL,MSFT,GOOG'
    //console.log(symbols);
    const endDate = new Date().toISOString().split('T')[0];
    //console.log(endDate);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    //console.log(formattedStartDate);

  
    const cacheKey = `one-week-bars-${symbols}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch the stock bars from Alpaca
    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=1Hour&feed=iex`, {
      headers: alpacaHeaders,
    });

    //console.log(response);
    if (!response.data || !response.data.bars || !response.data.bars[symbols]) {
      return res.status(404).json({ [symbols]: { error: `No data available for symbol ${symbols}` } });
    }

    const barsData = response.data.bars[symbols];
    const firstBar = barsData[0];  // The oldest bar (1 week ago)
    const lastBar = barsData[barsData.length - 1];  // The most recent bar

    if (!firstBar || !lastBar) {
      return res.status(500).json({ error: `Insufficient data for ${symbols}` });
    }

    const priceDifference = lastBar.c - firstBar.c; // Closing price difference
    const percentChange = ((priceDifference / firstBar.c) * 100).toFixed(2); // Percent change
    //console.log(priceDifference, percentChange);

    // Add the calculated data to the response
    const responseData = {
      symbol: symbols,
      bars: barsData,
      priceDifference: priceDifference,
      percentChange: percentChange,
    };


    // Cache the calculated data
    cache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching one week bars:', error.message);
    res.status(500).json({ error: 'Failed to fetch one week bars' });
  }
});



// Endpoint to get one month bars
app.get('/api/one-month-bars', async (req, res) => {
  console.log('Received request for one month bars');
  try {
    const symbols = req.query.symbols; // e.g., 'AAPL,MSFT,GOOG'
    //console.log(symbols);
    const endDate = new Date().toISOString().split('T')[0];
    //console.log(endDate);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    //console.log(formattedStartDate);

  
    const cacheKey = `one-month-bars-${symbols}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch the stock bars from Alpaca
    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=12Hour&feed=iex`, {
      headers: alpacaHeaders,
    });

    //console.log(response);
    if (!response.data || !response.data.bars || !response.data.bars[symbols]) {
      return res.status(404).json({ [symbols]: { error: `No data available for symbol ${symbols}` } });
    }

    const barsData = response.data.bars[symbols];
    const firstBar = barsData[0];  // The oldest bar (1 year ago)
    const lastBar = barsData[barsData.length - 1];  // The most recent bar

    if (!firstBar || !lastBar) {
      return res.status(500).json({ error: `Insufficient data for ${symbols}` });
    }

    const priceDifference = lastBar.c - firstBar.c; // Closing price difference
    const percentChange = ((priceDifference / firstBar.c) * 100).toFixed(2); // Percent change

    // Add the calculated data to the response
    const responseData = {
      symbol: symbols,
      bars: barsData,
      priceDifference: priceDifference,
      percentChange: percentChange,
    };


    // Cache the calculated data
    cache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching one month bars:', error.message);
    res.status(500).json({ error: 'Failed to fetch one month bars' });
  }
});


// Endpoint to get six month bars
app.get('/api/six-month-bars', async (req, res) => {
  console.log('Received request for six month bars');
  try {
    const symbols = req.query.symbols; // e.g., 'AAPL,MSFT,GOOG'
    //console.log(symbols);
    const endDate = new Date().toISOString().split('T')[0];
    //console.log(endDate);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    //console.log(formattedStartDate);

  
    const cacheKey = `six-month-bars-${symbols}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch the stock bars from Alpaca
    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=1Day&feed=iex`, {
      headers: alpacaHeaders,
    });

    //console.log(response);
    if (!response.data || !response.data.bars || !response.data.bars[symbols]) {
      return res.status(404).json({ [symbols]: { error: `No data available for symbol ${symbols}` } });
    }

    const barsData = response.data.bars[symbols];
    const firstBar = barsData[0];  // The oldest bar (6 months ago)
    const lastBar = barsData[barsData.length - 1];  // The most recent bar

    if (!firstBar || !lastBar) {
      return res.status(500).json({ error: `Insufficient data for ${symbols}` });
    }

    const priceDifference = lastBar.c - firstBar.c; // Closing price difference
    const percentChange = ((priceDifference / firstBar.c) * 100).toFixed(2); // Percent change

    // Add the calculated data to the response
    const responseData = {
      symbol: symbols,
      bars: barsData,
      priceDifference: priceDifference,
      percentChange: percentChange,
    };


    // Cache the calculated data
    cache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching six month bars:', error.message);
    res.status(500).json({ error: 'Failed to fetch six month bars' });
  }
});

// Endpoint to get one year bars
app.get('/api/one-year-bars', async (req, res) => {
  console.log('Received request for one year bars');
  try {
    const symbols = req.query.symbols; // e.g., 'AAPL,MSFT,GOOG'
    //console.log(symbols);
    const endDate = new Date().toISOString().split('T')[0];
    //console.log(endDate);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    //console.log(formattedStartDate);

  
    const cacheKey = `one-year-bars-${symbols}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch the stock bars from Alpaca
    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=1Day&feed=iex`, {
      headers: alpacaHeaders,
    });

    //console.log(response);
    if (!response.data || !response.data.bars || !response.data.bars[symbols]) {
      return res.status(404).json({ [symbols]: { error: `No data available for symbol ${symbols}` } });
    }

    const barsData = response.data.bars[symbols];
    const firstBar = barsData[0];  // The oldest bar (1 year ago)
    const lastBar = barsData[barsData.length - 1];  // The most recent bar

    if (!firstBar || !lastBar) {
      return res.status(500).json({ error: `Insufficient data for ${symbols}` });
    }

    const priceDifference = lastBar.c - firstBar.c; // Closing price difference
    const percentChange = ((priceDifference / firstBar.c) * 100).toFixed(2); // Percent change

    // Add the calculated data to the response
    const responseData = {
      symbol: symbols,
      bars: barsData,
      priceDifference: priceDifference,
      percentChange: percentChange,
    };


    // Cache the calculated data
    cache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching one year bars:', error.message);
    res.status(500).json({ error: 'Failed to fetch one year bars' });
  }
});


// Endpoint to get five years bars
app.get('/api/five-years-bars', async (req, res) => {
  console.log('Received request for five years bars');
  try {
    const symbols = req.query.symbols; // e.g., 'AAPL,MSFT,GOOG'
    //console.log(symbols);
    const endDate = new Date().toISOString().split('T')[0];
    //console.log(endDate);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 60);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    //console.log(formattedStartDate);

  
    const cacheKey = `five-years-bars-${symbols}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch the stock bars from Alpaca
    const response = await axios.get(`https://data.alpaca.markets/v2/stocks/bars?symbols=${symbols}&start=${formattedStartDate}&end=${endDate}&timeframe=1Day&feed=iex`, {
      headers: alpacaHeaders,
    });

    //console.log(response);
    if (!response.data || !response.data.bars || !response.data.bars[symbols]) {
      return res.status(404).json({ [symbols]: { error: `No data available for symbol ${symbols}` } });
    }

    const barsData = response.data.bars[symbols];
    const firstBar = barsData[0];  // The oldest bar (5 years ago)
    const lastBar = barsData[barsData.length - 1];  // The most recent bar

    if (!firstBar || !lastBar) {
      return res.status(500).json({ error: `Insufficient data for ${symbols}` });
    }

    const priceDifference = lastBar.c - firstBar.c; // Closing price difference
    const percentChange = ((priceDifference / firstBar.c) * 100).toFixed(2); // Percent change

    // Add the calculated data to the response
    const responseData = {
      symbol: symbols,
      bars: barsData,
      priceDifference: priceDifference,
      percentChange: percentChange,
    };


    // Cache the calculated data
    cache.set(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    console.error('Error fetching five years bars:', error.message);
    res.status(500).json({ error: 'Failed to fetch five years bars' });
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
    //console.log('Starting the tweet scraping process...');
    const browser = await puppeteer.launch({ headless: false });
    //console.log('Browser launched.');
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    //console.log('New page created.');
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.3');
                            //Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36
    //console.log('User agent set.');

    const profiles = [
      //'https://nitter.privacydev.net/AdamMancini4',
      //'https://xcancel.com/AdamMancini4',
      //'https://nitter.poast.org/AdamMancini4',
      'https://nitter.lucabased.xyz/AdamMancini4',
      'https://nitter.lucabased.xyz/InvestorsLive',
      // 'https://nitter.lucabased.xyz/RedDogT3',
    ];

    let allTweets = [];
    for (const url of profiles) {
      //console.log(`Navigating to ${url}`);
      const response = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      const statusCode = response.status();
      //console.log(`HTTP Status Code for ${url}: ${statusCode}`);

      if (statusCode !== 200) {
        console.error(`Failed to access ${url}. Skipping...`);
        await new Promise(resolve => setTimeout(resolve, 25000)); // Wait for 25 seconds before the next profile
        continue;
      }

      //console.log(`Scraping tweets from ${url}`);
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
    const filename = req.query.filename || 'backup_tweets.csv';
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