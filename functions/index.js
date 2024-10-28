const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
require('dotenv').config();

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

// Scheduled function to update crypto prices every minute
exports.updateCryptoPrices = functions.pubsub.schedule("every 10 minutes").onRun(async () => {
    try {
      // Fetch all cryptos from Firestore where type is 'crypto'
      const cryptoSnapshot = await db.collection("watchList").where("type", "==", "crypto").get();
      if (cryptoSnapshot.empty) {
        console.log("No cryptos found in watchList");
        return null;
      }
  
      const cryptosInWatchList = cryptoSnapshot.docs.map(doc => doc.data().name.toLowerCase());
  
      // Fetch all cryptos from CoinGecko API
      const coinsListResponse = await axios.get("https://api.coingecko.com/api/v3/coins/list", {
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": COINGECKO_API_KEY,
        },
      });
      const coinsList = coinsListResponse.data;
  
      // Find matching CoinGecko IDs for cryptos in Firestore
      const cryptoList = coinsList
        .filter(coin => cryptosInWatchList.includes(coin.name.toLowerCase())) // Match by name
        .map(coin => coin.id); // Get CoinGecko IDs
  
      if (cryptoList.length === 0) {
        console.log("No matching cryptos found in CoinGecko API");
        return null;
      }
  
      // Fetch and update prices for matched cryptos
      for (const cryptoId of cryptoList) {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}`, {
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": COINGECKO_API_KEY,
          },
        });
  
        const cryptoData = response.data;
        const price = cryptoData.market_data.current_price.usd;
  
        // Update the price in Firestore
        const docRef = db.collection("watchList").doc(cryptoData.symbol.toUpperCase());
        await docRef.set({
          symbol: cryptoData.symbol.toUpperCase(),
          name: cryptoData.name,
          price: price,
          type: "crypto",
        }, { merge: true });
  
        console.log(`Updated price for ${cryptoData.symbol}: $${price}`);
      }
  
    } catch (error) {
      console.error("Error fetching or updating crypto data:", error);
    }
  
    return null;
  });