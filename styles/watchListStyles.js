import { StyleSheet } from "react-native";


export const watchListItemStyles = StyleSheet.create({
    card: { flexDirection: 'row', justifyContent: 'space-between',  alignItems: 'center', padding: 8, marginHorizontal: 15, borderRadius: 8, },
    info: { flexDirection: 'column', },
    symbol: { color: 'white', fontSize: 20, },
    name: { color: 'grey', fontSize: 13, },
    price: { color: 'white', fontSize: 16, },
    priceContainer: { alignItems: 'flex-end', width: 100, },
    separator: { height: 1, backgroundColor: '#111', marginVertical: 10 },
});


export const watchListScreenStyles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#000', paddingTop: 20, },
    header: { fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 20, marginTop: 40, marginLeft: 15 },
    emptyListContainer: { flexGrow: 1,  justifyContent: 'center', alignItems: 'center', },
    listContainer: { paddingBottom: 50, },
});