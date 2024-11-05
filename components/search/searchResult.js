import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { searchResultStyles as styles } from "../../styles/searchStyles";

const SearchResults = ({ results = [], searchTerm, onSelect }) => {
    if (!searchTerm.trim()) return null;
    if (!results || results.length === 0) {
        return <Text style={styles.noResultsText}>No results for '{searchTerm}'</Text>;
    }

    return (
        <ScrollView style={styles.resultsContainer}>
            {results.map((match, index) => (
                <ResultItem key={index} match={match} onSelect={onSelect} />
            ))}
        </ScrollView>
    );
};

const ResultItem = ({ match, onSelect }) => (
    <TouchableOpacity
        style={styles.resultItem}
        onPress={() => onSelect(match)}
    >
        <Text style={styles.resultSymbol}>{match.symbol}</Text>
        <Text style={styles.resultName}>{match.name}</Text>
        <View style={styles.separator} />
    </TouchableOpacity>
);

export { SearchResults, ResultItem };