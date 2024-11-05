import { StyleSheet } from "react-native";


export const newsScreenStyles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#000000' },
    newsContainer: { paddingVertical: 2 },
    newsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    newsContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headline: { fontSize: 12, color: '#ffffff', flex: 1, marginRight: 10, marginLeft: 12 },
    newsImage: { width: 50, height: 50, borderRadius: 0, marginHorizontal: 12 },
    symbolContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginBottom: 5 },
    symbolText: { fontSize: 12, color: '#ffffff', marginRight: 10, marginLeft: 12, fontWeight: 'bold' },
    separator: { height: 1, backgroundColor: '#111', marginVertical: 15 },
});


export const twitterScreenStyles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#000000', },
    headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8, },
    fullnameAndUsername: { flexDirection: 'row', alignItems: 'center', flex: 1, },
    fullname: { color: '#ffffff', fontWeight: 'bold', marginRight: 4, },
    username: { color: '#888888', },
    headerText: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginLeft: 8, },
    tweetContainer: { marginBottom: 8, paddingVertical: 0, },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, },
    time: { color: '#888888', },
    contentContainer: { marginTop: 4, marginBottom: 10, },
    content: { color: '#ffffff', },
    readMoreButton: { marginTop: 4, },
    readMoreText: { color: '#1DA1F2', fontWeight: 'bold', fontSize: 10, },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', },
    statsItem: { flexDirection: 'row', alignItems: 'center', },
    statsText: { marginLeft: 5, color: '#888888', fontSize: 13, },
    separator: { height: 1, backgroundColor: '#111', marginVertical: 15, },
});
