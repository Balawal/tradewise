import { useEffect, useState } from "react";
import { REACT_APP_BASE_URL } from '@env';

export default function useFetchMostActive() {
    const [mostActive, setMostActive] = useState([]);
	const [mostActiveBarData, setMostActiveBarData] = useState({});
	const [mostActiveCrypto, setMostActiveCrypto] = useState([]);
	const [mostActiveBarDataCrypto, setMostActiveBarDataCrypto] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMostActiveStocks = async () => {
			try {
				const response = await fetch(`${REACT_APP_BASE_URL}/most-active`);
				if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
				const data = await response.json();

				if (!Array.isArray(data)) throw new Error("Invalid response format");

				const symbols = data.map((item) => item.symbol);
				const symbolsString = symbols.join(",");

				const barsResponse = await fetch(`${REACT_APP_BASE_URL}/historical-bars?symbols=${symbolsString}`);
				if (!barsResponse.ok) throw new Error(`HTTP error! status: ${barsResponse.status}`);
				const barsData = await barsResponse.json();

				const barDataMap = {};
				for (const symbol in barsData.bars) {
					barDataMap[symbol] = barsData.bars[symbol].map((bar) => bar.c);
				}

				const formattedMostActive = data.map((stock) => ({
					...stock,
					isGainer: stock.percent_change > 0,
				}));

				setMostActive(formattedMostActive);
				setMostActiveBarData(barDataMap);
			} catch (error) {
				console.error("Error fetching most active stocks:", error);
			}
		};

		const fetchMostActiveCrypto = async () => {
			try {
				const responseCrypto = await fetch(`${REACT_APP_BASE_URL}/top-coins`);
				console.log(`Fetching top coins from: ${REACT_APP_BASE_URL}/top-coins`);
				if (!responseCrypto.ok) {
					const errorBody = await responseCrypto.text(); 
					throw new Error(`HTTP error! status: ${responseCrypto.status}, response: ${errorBody}`);
				}
				const dataCrypto = await responseCrypto.json();

				if (!Array.isArray(dataCrypto)) throw new Error("Invalid response format");

				const symbolsCrypto = dataCrypto.map((item) => item.symbol);
				const symbolsStringCrypto = symbolsCrypto.join(",");

				const barsResponseCrypto = await fetch(`${REACT_APP_BASE_URL}/historical-bars-crypto?symbols=${symbolsStringCrypto}`);
				if (!barsResponseCrypto.ok) throw new Error(`HTTP error! status: ${barsResponseCrypto.status}`);
				const barsDataCrypto = await barsResponseCrypto.json();

				const barDataMapCrypto = {};
				for (const symbol in barsDataCrypto.bars) {
					barDataMapCrypto[symbol] = barsDataCrypto.bars[symbol].map((bar) => bar.c);
				}

				const formattedMostActiveCrypto = dataCrypto.map((crypto) => ({
					...crypto,
					isGainer: crypto.percent_change > 0,
				}));

				setMostActiveCrypto(formattedMostActiveCrypto);
				setMostActiveBarDataCrypto(barDataMapCrypto);
			} catch (error) {
				console.error("Error fetching most active crypto data:", error);
			}
		};

		(async () => {
			await fetchMostActiveStocks();
			await fetchMostActiveCrypto();
			setLoading(false);
		})();
	}, []);

	return { 
        mostActive, 
        mostActiveBarData, 
        mostActiveCrypto, 
        mostActiveBarDataCrypto, 
        loading 
    };
}