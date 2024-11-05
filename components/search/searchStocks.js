import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import useFetchSearch from "../../hooks/search/useFetchSearch";
import SearchInput from "./searchInput";
import { SearchResults } from "./searchResult";
import { searchStocksStyles as styles } from "../../styles/searchStyles";

const SearchStocks = ({ focusInput }) => {
	const navigation = useNavigation();
	const [searchTerm, setSearchTerm] = useState("");
	const searchInputRef = useRef(null);
	const { searchResult, isLoading } = useFetchSearch(searchTerm);
	
	useEffect(() => {
        if (focusInput) {
            searchInputRef.current?.focus();
        }
    }, [focusInput]);

	const clearInput = () => setSearchTerm("");

	const handleSelectItem = (match) => {
        if (match.type === "stock") {
            navigation.navigate("StockDetail", { stockSymbol: match.symbol });
        } else {
            navigation.navigate("CryptoDetail", { cryptoID: match.id, cryptoSymbol: match.symbol });
        }
        clearInput();
    };

	const handleSearchSubmit = () => {
        if (searchTerm.trim() !== "") {
            setSearchTerm(searchTerm);
        }
    };

	return (
		<>
			<View style={styles.container}>
			<SearchInput
                searchTerm={searchTerm}
                onChangeText={setSearchTerm}
                onSubmit={handleSearchSubmit}
                onClear={clearInput}
            />
			<SearchResults results={searchResult} searchTerm={searchTerm} onSelect={handleSelectItem} />
			{isLoading && <Text style={styles.loadingText}>Loading...</Text>}
			</View>
		</>
	);
};

export default SearchStocks;