import React from "react";
import { View, Text } from "react-native";
import { StockCards, CryptoCards } from "./cards";
import SkeletonLoader from "../../styles/components/skeletonLoading";
import useFetchMostActive from "../../hooks/home/mostactive/useFetchMostActive";
import { mostActiveStyles as styles } from "../../styles/homeStyles";

const MostActive = () => {
	const { mostActive, mostActiveBarData, mostActiveCrypto, mostActiveBarDataCrypto, loading } = useFetchMostActive();

	return (
		<View style={{ flex: 1, backgroundColor: "#000000" }}>
			<View>
				<Text style={styles.header}>Most Active</Text>
				<Text style={styles.subHeader}>Stocks with the highest trading volume today.</Text>
				{loading ? (
					<View style={styles.cardsWrapper}>
						<SkeletonLoader />
						<SkeletonLoader />
						<SkeletonLoader />
					</View>
				) : (
					<StockCards stocks={mostActive} barData={mostActiveBarData} displayVolume={true} />
				)}
				<Text style={styles.subHeader}>Crypto with the highest trading volume today.</Text>
				{loading ? (
					<View style={styles.cardsWrapper}>
						<SkeletonLoader />
						<SkeletonLoader />
						<SkeletonLoader />
					</View>
				) : (
					<CryptoCards cryptos={mostActiveCrypto} barDataCrypto={mostActiveBarDataCrypto} displayVolume={true} />
				)}
			</View>
		</View>
	);
};

export default MostActive;