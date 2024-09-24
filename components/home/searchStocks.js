import React, { useEffect, useState, useRef, useCallback } from "react";
import {View,Text,StyleSheet,ScrollView,Animated,Dimensions,Easing,TouchableOpacity,Modal,TextInput,Keyboard,} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';

const SearchStocks = ({ focusInput }) => {
	const navigation = useNavigation();
	//console.log('checking navigation: ', navigation);
	const [searchTerm, setSearchTerm] = useState("");
	const searchInputRef = useRef(null);

	const [searchResult, setSearchResult] = useState(null);
	const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);


	useEffect(() => {
        if (focusInput) {
            // Focus the input field when the bottom sheet appears
            searchInputRef.current?.focus();
        }
    }, [focusInput]);

	const clearInput = () => {
		setSearchTerm("");
		setSearchResult("");
	};

	const handleSearchChange = (text) => {
		setSearchTerm(text); // Update search term on input change
		setIsSearchSubmitted(false);
	};

	const handleSearchSubmit = async () => {
		if (searchTerm.trim() === "") return;

		try {
			const stockResponse = fetch(`http://192.168.1.118:3000/api/search-query?keywords=${searchTerm}`);
			const cryptoResponse = fetch(`http://192.168.1.118:3000/api/search-query-crypto?query=${searchTerm}`);

			const [stocksData, cryptoData] = await Promise.all([stockResponse, cryptoResponse]);
			const stockResults = await stocksData.json();
			const cryptoResults = await cryptoData.json();

			const combinedResults = [
				...stockResults.bestMatches.map(match => ({
				symbol: match["1. symbol"],
				name: match["2. name"],
				type: 'stock',
				})),
				...cryptoResults.coins.map(coin => ({
				symbol: coin.symbol, // or the appropriate identifier for the coin
				name: coin.name,
				id: coin.id,
				type: 'crypto',
				})),
			];

			setSearchResult(combinedResults);
			setIsSearchSubmitted(true);
		} catch (error) {
			console.error("Error fetching search data:", error);
		}
	};

	const renderSearchResults = () => {
		if (!searchTerm.trim()) {
			return null;
		}

		if (isSearchSubmitted && (!searchResult || searchResult.length === 0)) {
			return <Text style={styles.noResultsText}>No results for '{searchTerm}'</Text>;
		}

		if (searchResult) {
			return (
				<ScrollView style={styles.resultsContainer}>
					{searchResult.map((match, index) => (
						<TouchableOpacity
							key={index}
							style={styles.resultItem}
							onPress={() => {
								if (match.type === 'stock') {
									navigation.navigate('StockDetail', { stockSymbol: match.symbol });
								} else {
								navigation.navigate('CryptoDetail', { cryptoID: match.id, cryptoSymbol: match.symbol });
								}
								
								clearInput();
								
							}}>
							<Text style={styles.resultSymbol}>{match.symbol}</Text>
							<Text style={styles.resultName}>{match.name}</Text>
							<View style={styles.separator} />
						</TouchableOpacity>
					))}
				</ScrollView>
			);
		}
	};

	return (
		<>
			<View style={styles.container}>
				<View style={styles.searchContainer}>
					<View style={styles.searchInputWrapper}>
						<Icon name="search" size={20} color="#888" style={styles.searchIconBar} />
						<TextInput
							ref={searchInputRef}
							style={styles.searchInput}
							placeholder="Search for company or coin"
							placeholderTextColor="#888"
							value={searchTerm}
							onChangeText={handleSearchChange}
							onSubmitEditing={handleSearchSubmit}
						/>
						{searchTerm.length > 0 && (
							<TouchableOpacity onPress={clearInput} style={styles.clearButton}>
								<Icon name="cancel" size={20} color="#fff" />
							</TouchableOpacity>
						)}
					</View>
					{renderSearchResults()}
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	header: {
		fontSize: 18,
		fontWeight: "bold",
		marginVertical: 12,
	},
	container: {
		flexGrow: 1,
		backgroundColor: "#080813",
		padding: 20,
	},
	contentContainer: {
		flexGrow: 1,
		backgroundColor: "#080813",
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
		color: "080813",
		fontWeight: "bold",
		marginBottom: 5,
		marginTop: 40,
	},
	subHeader: {
		fontSize: 14,
		color: "grey",
		marginBottom: 20,
	},
	handleIndicator: {
		backgroundColor: "#888",     // Gray color for the handle bar
        width: 50,
        height: 5,
        borderRadius: 5,  
	},
	searchInputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#313133", // Gray background for the search bar
		borderRadius: 10,
		padding: 8,
		marginBottom: 24,
	},
	searchIconBar: {
		marginRight: 10, // Space between the icon and the input
	},
	searchIcon: {
		position: 'absolute',
		top: 63,
		right: 20,
		zIndex: 10,
	},
	searchContainer: {
		backgroundColor: "#080813",
		padding: 4,
		flexDirection: "column",
		flex: 1,
	},
	searchInput: {
		flex: 1,
		fontSize: 14,
		color: "#fff", // Set text color to white
	},
	resultsContainer: {
		//marginTop: 10,
		flex: 1,
	},
	resultItem: {
		//padding: 5,
	},
	resultSymbol: {
		fontSize: 16,
		fontWeight: "bold",
		color: "white",
		marginBottom: 5,
	},
	resultName: {
		fontSize: 14,
		color: "#888",
	},
	clearButton: {
		marginLeft: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	separator: {
		height: 1,
		backgroundColor: "#111",
		marginVertical: 20,
	},
	noResultsText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
});

export default SearchStocks;
