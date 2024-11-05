import { StyleSheet } from "react-native";


export const searchInputStyles = StyleSheet.create({
    searchInputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#313133", borderRadius: 10, padding: 8, marginBottom: 24, },
	searchIconBar: { marginRight: 10, },
	searchInput: { flex: 1, fontSize: 14, color: "#fff", },
	clearButton: { marginLeft: 10, justifyContent: "center", alignItems: "center", },
});

export const searchResultStyles = StyleSheet.create({
    resultsContainer: { flex: 1, },
	resultSymbol: { fontSize: 16, fontWeight: "bold", color: "white", marginBottom: 5, },
	resultName: { fontSize: 14, color: "#888", },
	separator: { height: 1, backgroundColor: "#111", marginVertical: 20, },
	noResultsText: { color: "white", textAlign: "center", fontWeight: "bold", },
});

export const searchStocksStyles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: "#080813", padding: 20, },
});