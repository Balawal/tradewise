import { View, Text } from "react-native";
import { useEffect, useState } from "react";

export default function useFetchTopMovers() {
	const [marketData, setMarketData] = useState({ gainers: [], losers: [] });
	const [marketDataCrypto, setMarketDataCrypto] = useState({ gainers: [], losers: [] });
	const [barData, setBarData] = useState({});
	const [barDataCrypto, setBarDataCrypto] = useState({});

	useEffect(() => {
		const fetchTopMoversAndBarData = async () => {
			try {
				console.log("Fetching top movers stocks...");

				const response = await fetch("http://192.168.1.118:3000/api/top-movers");
				if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
				const data = await response.json();

				const gainers = data.gainers.map((stock) => stock.symbol);
				const losers = data.losers.map((stock) => stock.symbol);
				const symbolsArray = gainers.concat(losers);
				const symbols = symbolsArray.join(",");

				console.log("Fetching historical bars...");
				const barsResponse = await fetch(`http://192.168.1.118:3000/api/historical-bars?symbols=${symbols}`);
				if (!barsResponse.ok) throw new Error(`HTTP error! status: ${barsResponse.status}`);
				const barsData = await barsResponse.json();

				const barDataMap = {};
				for (const symbol in barsData.bars) {
					barDataMap[symbol] = barsData.bars[symbol].map((bar) => bar.c); // Only closing price
				}

				setMarketData({
					gainers: data.gainers || [],
					losers: data.losers || [],
				});
				setBarData(barDataMap);
			} catch (error) {
				console.error("Error fetching market data:", error);
			}
		};

		const fetchTopMoversAndBarDataCrypto = async () => {
			try {
				console.log("Fetching top movers crypto...");

				const responseCrypto = await fetch("http://192.168.1.118:3000/api/top-movers-crypto");
				if (!responseCrypto.ok) throw new Error(`HTTP error! status: ${responseCrypto.status}`);
				const dataCrypto = await responseCrypto.json();

				const gainersCrypto = dataCrypto.gainers.map((crypto) => crypto.symbol);
				const losersCrypto = dataCrypto.losers.map((crypto) => crypto.symbol);
				const symbolsArrayCrypto = gainersCrypto.concat(losersCrypto);
				const symbolsCrypto = symbolsArrayCrypto.join(",");

				console.log("Fetching historical bars crypto...");
				const barsResponseCrypto = await fetch(`http://192.168.1.118:3000/api/historical-bars-crypto?symbols=${symbolsCrypto}`);
				if (!barsResponseCrypto.ok) throw new Error(`HTTP error! status: ${barsResponseCrypto.status}`);
				const barsDataCrypto = await barsResponseCrypto.json();

				const barDataMapCrypto = {};
				for (const symbol in barsDataCrypto.bars) {
					barDataMapCrypto[symbol] = barsDataCrypto.bars[symbol].map((bar) => bar.c); // Only closing price
				}

				setMarketDataCrypto({
					gainers: dataCrypto.gainers || [],
					losers: dataCrypto.losers || [],
				});
				setBarDataCrypto(barDataMapCrypto);
			} catch (error) {
				console.error("Error fetching market data crypto:", error);
			}
		};

		fetchTopMoversAndBarData();
		fetchTopMoversAndBarDataCrypto();

		return () => {};
	}, []);

	const combinedStocks = [
		...marketData.gainers.map((stock) => ({ ...stock, isGainer: true })),
		...marketData.losers.map((stock) => ({ ...stock, isGainer: false })),
	];

	const combinedCrypto = [
		...marketDataCrypto.gainers.map((crypto) => ({ ...crypto, isGainer: true })),
		...marketDataCrypto.losers.map((crypto) => ({ ...crypto, isGainer: false })),
	];

	return {
		combinedStocks,
		combinedCrypto,
		marketData,
		setMarketData,
		marketDataCrypto,
		setMarketDataCrypto,
		barData,
		barDataCrypto,
	};
}
