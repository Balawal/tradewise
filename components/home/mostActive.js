import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StockCards } from "./cards";

const MostActive = () => {
	const [mostActive, setMostActive] = useState([]);
	const [mostActiveCrypto, setMostActiveCrypto] = useState({});
	const [mostActiveBarData, setMostActiveBarData] = useState({});
	const [mostActiveBarDataCrypto, setMostActiveBarDataCrypto] = useState({});

	useEffect(() => {
		const fetchMostActive = async () => {
			try {
				console.log("fetching most active stocks");
				const response = await fetch(`http://192.168.1.118:3000/api/most-active`);
				if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
				const data = await response.json();

				if (!Array.isArray(data)) throw new Error("Invalid response format");

				const symbols = data.map((item) => item.symbol);

				// Construct comma-separated symbols string
				const symbolsString = symbols.join(",");

				console.log("fetching historical bars");
				const barsResponse = await fetch(`http://192.168.1.118:3000/api/historical-bars?symbols=${symbolsString}`);
				if (!barsResponse.ok) throw new Error(`HTTP error! status: ${barsResponse.status}`);
				const barsData = await barsResponse.json();

				const barDataMap = {};
				for (const symbol in barsData.bars) {
					barDataMap[symbol] = barsData.bars[symbol].map((bar) => bar.c); // Only closing price
				}

				const formattedMostActive = data.map((stock) => ({
					...stock,
					isGainer: stock.percent_change > 0, // If positive, it's a gainer
				}));

				setMostActive(formattedMostActive);
				setMostActiveBarData(barDataMap);
			} catch (error) {
				console.error("Error fetching most active data:", error);
			}
		};
		fetchMostActive();
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: "#000000" }}>
			<View>
				<Text style={styles.header}>Most Active</Text>
				<Text style={styles.subHeader}>Stocks with the highest trading volume today.</Text>
				<StockCards stocks={mostActive} barData={mostActiveBarData} displayVolume={true} />
				<Text style={styles.subHeader}>Crypto with the highest trading volume today.</Text>
			</View>
			{/* Ensure SearchStocks has content to display */}
		</View>
	);
};

const styles = StyleSheet.create({
	searchContainer: {
		position: "relative", // Make sure parent has relative positioning
		zIndex: 2, // Ensure it's above the ScrollView content
		backgroundColor: "#000000", // Match the background color if needed
	},
	container: {
		backgroundColor: "#000000",
		padding: 3,
	},
	contentContainer: {
		backgroundColor: "#000000",
	},
	cardsWrapper: {
		flexDirection: "row",
	},
	card: {
		backgroundColor: "#000000",
		borderRadius: 8,
		padding: 10,
		marginRight: 15,
		width: 150,
		height: 180,
		justifyContent: "flex-start",
		alignItems: "flex-start",
		marginBottom: 5
	},
	chartWrapper: {
		width: "50%",
		height: 80,
		marginBottom: 10,
	},
	chart: {
		marginVertical: 2,
		borderRadius: 0,
		alignItems: "center",
		justifyContent: "center",
	},
	cardSymbol: {
		fontSize: 15,
		fontWeight: "bold",
		marginLeft: 10,
		marginTop: 5,
	},
	cardPrice: {
		fontSize: 20,
		marginBottom: 5,
		fontWeight: "bold",
		marginLeft: 10,
	},
	cardPercent: {
		fontSize: 11,
		fontWeight: "bold",
		marginLeft: 10,
	},
	header: {
		fontSize: 24,
		color: "white",
		fontWeight: "bold",
		marginBottom: 5,
		marginTop: 30,
		marginLeft: 15,
	},
	subHeader: {
		fontSize: 14,
		color: "grey",
		marginBottom: -1,
		marginLeft: 15,
	},
});

export default MostActive;
