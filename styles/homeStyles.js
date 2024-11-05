import { StyleSheet } from "react-native";


export const newsStyles = StyleSheet.create({
    newsContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    newsContainer: { marginTop: 15, marginBottom: 15 },
    headline: { fontSize: 12, color: '#ffffff', flex: 1, marginRight: 10, marginLeft: 12 },
    newsImage: { width: 50, height: 50, borderRadius: 0, marginHorizontal: 12 },
    featuredNewsContainer: { marginVertical: 10, paddingHorizontal: 10 },
    featuredNewsImage: { width: '100%', height: 250, borderRadius: 10 },
    featuredHeadline: { fontSize: 24, marginTop: 10, color: '#ffffff' },
    separator: { height: 1, backgroundColor: '#111', marginVertical: 10 },
});


export const newsCryptoStyles = StyleSheet.create({
    newsListContainer: { maxHeight: 100, overflow: 'scroll', },
    newsContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    newsContainer: { marginTop: 15, marginBottom: 15, },
    headline: { fontSize: 12, color: '#ffffff', flex: 1, marginRight: 10, marginLeft: 12, },
    newsImage: { width: 50, height: 50, borderRadius: 0, marginHorizontal: 12 },
    featuredNewsContainer: { marginVertical: 10, paddingHorizontal: 10 },
    featuredNewsImage: { width: '100%', height: 250, borderRadius: 10 },
    featuredHeadline: { fontSize: 24, marginTop: 10, color: '#ffffff' },
    separator: { height: 1, backgroundColor: '#111', marginVertical: 10 },
});


export const calendarStyles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)' },
    modalContent: { width: '80%', backgroundColor: 'black', padding: 20, borderRadius: 10, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: 'white' },
    optionButton: { backgroundColor: '#000', borderRadius: 20, padding: 8, alignItems: 'center', borderWidth: 2, borderColor: '#ad93c8', width: '100%', marginTop: 15 },
    optionButtonText: { color: '#ad93c8', fontSize: 14, fontWeight: 'bold' },
    closeButton: { backgroundColor: '#000', borderRadius: 20, padding: 8, alignItems: 'center', borderWidth: 2, borderColor: 'white', width: '100%', marginTop: 15 },
    closeButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
});


export const chartStyles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', backgroundColor: '#000' },
    chartContainer: { height: '120%', width: '15%', justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: '#000', position: 'relative' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
    returnText: { fontSize: 16, fontWeight: 'bold', marginVertical: -20, marginLeft: 10 },
    returnLabel: { color: 'gray', fontSize: 16, fontWeight: 'bold', marginLeft: -50 },
});


export const chartCryptoStyles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', backgroundColor: '#000', },
    chartContainer: { height: '120%', width: '6%', justifyContent: 'center', alignItems: 'center', padding: 10, backgroundColor: '#000', position: 'relative', },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', },
    returnText: { fontSize: 16, fontWeight: 'bold', marginVertical: -20, marginLeft: 10, },
    returnLabel: { color: 'gray', fontSize: 16, fontWeight: 'bold', marginLeft: -50, },
});


export const lastPriceStyles = StyleSheet.create({
    latestTrade: { fontSize: 40, marginVertical: 2, color: 'white', },
    container: { flex: 1, flexDirection: 'column', backgroundColor: '#000', },
});


export const cardsStyles = StyleSheet.create({
    cardsWrapper: { flexDirection: 'row', },
    card: { backgroundColor: '#000000', borderRadius: 8, padding: 10, marginRight: 15, width: 150, height: 180, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: 15, },
    chartWrapper: { width: '50%', height: 80, marginBottom: 10, },
    chart: { marginVertical: 2, borderRadius: 0, alignItems: 'center', justifyContent: 'center', },
    cardSymbol: { fontSize: 15, fontWeight: 'bold', marginLeft: 10, marginTop: 10, },
    cardPrice: { fontSize: 20, marginBottom: 5, fontWeight: 'bold', marginLeft: 10, },
    cardPercent: { fontSize: 11, fontWeight: 'bold', marginLeft: 10, },
});


export const mostActiveStyles = StyleSheet.create({
    cardsWrapper: { flexDirection: "row", },
	header: { fontSize: 24, color: "white", fontWeight: "bold", marginBottom: 10, marginTop: 30, marginLeft: 15, },
	subHeader: { fontSize: 14, color: "grey", marginBottom: -1, marginLeft: 15, },
});

export const topMoversStyles = StyleSheet.create({
    contentContainer: { backgroundColor: "#000000", },
    cardsWrapper: { flexDirection: "row", },
    header: { fontSize: 24, color: "white", fontWeight: "bold", marginBottom: 10, marginTop: -10, marginLeft: 15, },
    subHeader: { fontSize: 14, color: "grey", marginBottom: 0, marginLeft: 15, },
    bottomSheetBackground: { zIndex: 10000, borderRadius: 10, backgroundColor: "080813", },
    handleIndicator: { backgroundColor: "#888", width: 50, height: 5, borderRadius: 5, },
});


export const stockDetailScreenStyles = StyleSheet.create({ 
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 35, },
    goBack: { paddingTop: 35, },
    container: { flex: 1, padding: 20, backgroundColor: '#000', },
    name: { fontSize: 25, marginVertical: 8, color: 'white', fontWeight: 'bold', marginTop: 10, marginBottom: 8, },
    keystats: { fontSize: 23, marginVertical: 10, color: 'white', fontWeight: 'bold', },
    sentiment: { fontSize: 23, marginVertical: 20, color: 'white', fontWeight: 'bold', },
    dividend: { fontSize: 23, marginVertical: 20, color: 'white', fontWeight: 'bold', },
    technicals: { fontSize: 23, marginVertical: 20, color: 'white', fontWeight: 'bold', },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, },
    leftColumn: { flex: 1, alignItems: 'flex-start', },
    centerColumn: { flex: 1, alignItems: 'center', },
    rightColumn: { flex: 1, alignItems: 'flex-end', },
    descriptor: { fontSize: 12, color: 'gray', marginBottom: 8, marginTop: 8, },
    under: { fontSize: 13, color: 'white', fontWeight: 'bold', },
    separator: { height: 1, backgroundColor: '#111', marginVertical: 10, },
    newsListContainer: { maxHeight: 100, overflow: 'scroll', },
    latestTrade: { fontSize: 40, marginVertical: 2, color: 'white', fontWeight: 'bold', marginTop: 1, marginBottom: 10, },
    containerLP: { flex: 1, flexDirection: 'column', backgroundColor: '#000', },
});


export const cryptoDetailScreenStyles = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 35, },
    goBack: { paddingTop: 35, },
    container: { flex: 1, padding: 20, backgroundColor: '#000', },
    name: { fontSize: 25, marginVertical: 8, color: 'white', fontWeight: 'bold', marginTop: 15, marginBottom: 8, },
    price: { fontSize: 40, marginVertical: 2, color: 'white', fontWeight: 'bold', marginTop: 1, marginBottom: 10, },
    keystats: { fontSize: 23, marginVertical: 10, color: 'white', fontWeight: 'bold', },
    sentiment: { fontSize: 23, marginVertical: 20, color: 'white', fontWeight: 'bold', },
    technicals: { fontSize: 23, marginVertical: 20, color: 'white', fontWeight: 'bold', },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, },
    leftColumn: { flex: 1, alignItems: 'flex-start', },
    centerColumn: { flex: 1, alignItems: 'center', },
    rightColumn: { flex: 1, alignItems: 'flex-end', },
    descriptor: { fontSize: 12, color: 'gray', marginBottom: 8, marginTop: 8, },
    under: { fontSize: 13, color: 'white', fontWeight: 'bold', },
    separator: { height: 1, backgroundColor: '#111', marginVertical: 10, },
    newsListContainer: { maxHeight: 100, overflow: 'scroll', },
});


export const homeScreenStyles = StyleSheet.create({
    container: { flexGrow: 1, flex: 1, backgroundColor: '#000000',  zIndex: 1000, },
});