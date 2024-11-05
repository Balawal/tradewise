const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const COINGECKO_API_KEY = functions.config().coingecko.api_key;

exports.updateCryptoPrices = functions.pubsub.schedule("every 10 minutes").onRun(async () => {
    try {
        const usersSnapshot = await db.collection("users").get();
        if (usersSnapshot.empty) {
            console.log("No users found in database");
            return null;
        }

        const coinsListResponse = await axios.get("https://api.coingecko.com/api/v3/coins/list", {
            headers: {
                accept: "application/json",
                "x-cg-demo-api-key": COINGECKO_API_KEY,
            },
        });
        const coinsList = coinsListResponse.data;

        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;

            const cryptoSnapshot = await db.collection(`users/${userId}/watchList`).where("type", "==", "crypto").get();
            if (cryptoSnapshot.empty) {
                console.log(`No cryptos found in watchList for user ${userId}`);
                continue;
            }

            const cryptosInWatchList = cryptoSnapshot.docs.map(doc => doc.data().name.toLowerCase());

            const cryptoList = coinsList
                .filter(coin => cryptosInWatchList.includes(coin.name.toLowerCase())) 
                .map(coin => coin.id); 

            if (cryptoList.length === 0) {
                console.log(`No matching cryptos found in CoinGecko API for user ${userId}`);
                continue;
            }

            for (const cryptoId of cryptoList) {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}`, {
                    headers: {
                        accept: "application/json",
                        "x-cg-demo-api-key": COINGECKO_API_KEY,
                    },
                });

                const cryptoData = response.data;
                const price = cryptoData.market_data.current_price.usd;

                const docRef = db.collection(`users/${userId}/watchList`).doc(cryptoData.symbol.toUpperCase());
                await docRef.set({
                    symbol: cryptoData.symbol.toUpperCase(),
                    name: cryptoData.name,
                    price: price,
                    type: "crypto",
                }, { merge: true });

                console.log(`Updated price for ${cryptoData.symbol} for user ${userId}: $${price}`);
            }
        }

    } catch (error) {
        console.error("Error fetching or updating crypto data:", error);
    }

    return null;
});