import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StockCards, CryptoCards } from "./cards";
import SearchStocks from "../search/searchStocks";
import TopMoversStreaming from "../websocket/topMoversStreaming";
import MostActive from "./mostActive";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import useFetchTopMovers from "../../hooks/home/topmovers/useFetchTopMovers";
import SkeletonLoader from "../../styles/components/skeletonLoading";
import { topMoversStyles as styles } from "../../styles/homeStyles";


const TopMovers = () => {
	const { barData, combinedCrypto, combinedStocks, marketData, setMarketData, marketDataCrypto, setMarketDataCrypto, barDataCrypto } =
		useFetchTopMovers();

	const { isStockConnected, isCryptoConnected } = TopMoversStreaming(
		marketData,
		setMarketData,
		marketDataCrypto,
		setMarketDataCrypto
	);

	const bottomSheetModalRef = useRef(null);
	const snapPoints = ["80%"];
	const loading = !combinedStocks.length && !combinedCrypto.length;

	const handlePresentModal = () => {
		console.log("Present modal triggered");
		bottomSheetModalRef.current?.present();
		setIsBottomSheetOpen(true);
	};

	const handleDismissModal = () => {
        setIsBottomSheetOpen(false);  
    };

	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

	return (
		<BottomSheetModalProvider>
		<View style={{ flex: 1, backgroundColor: "#000000" }}>
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<TouchableOpacity style={[{ marginTop: 50, marginLeft: 385, flex: 1 }]} onPress={handlePresentModal}>
					<Icon name="search" size={24} color="white" />
				</TouchableOpacity>
				<View>
					<Text style={styles.header}>Top Movers</Text>
					<Text style={styles.subHeader}>Stocks making the biggest moves today.</Text>
					{loading ? (
							<View style={styles.cardsWrapper}>
								<SkeletonLoader />
								<SkeletonLoader />
								<SkeletonLoader />
							</View>
						) : (
							<StockCards stocks={combinedStocks} barData={barData} />
						)}
					<Text style={styles.subHeader}>Crypto making the biggest moves today.</Text>					
					{loading ? (
							<View style={styles.cardsWrapper}>
								<SkeletonLoader />
								<SkeletonLoader />
								<SkeletonLoader />
							</View>
						) : (
							<CryptoCards cryptos={combinedCrypto} barDataCrypto={barDataCrypto} />
						)}
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

export default TopMovers;
