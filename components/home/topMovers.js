import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { StockCards, CryptoCards } from "./cards";
import SearchStocks from "./searchStocks";
import TopMoversStreaming from "../websocket/topMoversStreaming";
import MostActive from "./mostActive";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import useFetchTopMovers from "./useFetchTopMovers";

const TopMovers = () => {
	const { barData, combinedCrypto, combinedStocks, marketData, setMarketData, marketDataCrypto, setMarketDataCrypto, barDataCrypto } =
		useFetchTopMovers();
	//console.log("COMBINED CRYPTO:::", combinedCrypto);
	//console.log("COMBINED STOCKS:::", combinedStocks);
	const { isStockConnected, isCryptoConnected } = TopMoversStreaming(
		marketData,
		setMarketData,
		marketDataCrypto,
		setMarketDataCrypto
	);

	const bottomSheetModalRef = useRef(null);
	const snapPoints = ["80%"];

	const handlePresentModal = () => {
		console.log("Present modal triggered");
		bottomSheetModalRef.current?.present();
		setIsBottomSheetOpen(true);
	};

	const handleDismissModal = () => {
        setIsBottomSheetOpen(false);  // Reset when modal is dismissed
    };

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	return (
		<BottomSheetModalProvider>
		<View style={{ flex: 1, backgroundColor: "#000000" }}>
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<TouchableOpacity style={[{ marginTop: 50, marginLeft: 370, flex: 1 }]} onPress={handlePresentModal}>
					<Icon name="search" size={24} color="white" />
				</TouchableOpacity>
				<View>
					<Text style={styles.header}>Top Movers</Text>
					<Text style={styles.subHeader}>Stocks making the biggest moves today.</Text>
					<StockCards stocks={combinedStocks} barData={barData} />
					<Text style={styles.subHeader}>Crypto making the biggest moves today.</Text>
					<CryptoCards cryptos={combinedCrypto} barDataCrypto={barDataCrypto} />
					<MostActive />
				</View>
			</ScrollView>
				<BottomSheetModal
					ref={bottomSheetModalRef}
					index={0}
					snapPoints={snapPoints}
					handleIndicatorStyle={styles.handleIndicator}
					onDismiss={handleDismissModal}
					backgroundStyle={styles.bottomSheetBackground}>
					<SearchStocks focusInput={isBottomSheetOpen}/>
				</BottomSheetModal>
		</View>
		</BottomSheetModalProvider>
	);
};

const styles = StyleSheet.create({
	searchContainer: {
		position: "absolute",
		zIndex: 2,
		backgroundColor: "#000000",
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
		marginBottom: 10,
		marginTop: -10,
		marginLeft: 15,
	},
	subHeader: {
		fontSize: 14,
		color: "grey",
		marginBottom: 5,
		marginLeft: 15,
	},
	bottomSheetBackground: {
		zIndex: 10000,
		borderRadius: 10,
		backgroundColor: "080813", // Black background for the bottom sheet
	},
	handleIndicator: {
		backgroundColor: "#888",     // Gray color for the handle bar
        width: 50,
        height: 5,
        borderRadius: 5,  
	},
});

export default TopMovers;
