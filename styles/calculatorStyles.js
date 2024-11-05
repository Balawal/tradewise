import { StyleSheet } from "react-native";


export const calculateButtonStyles = StyleSheet.create({
  buttonContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 60 },
  button: { backgroundColor: "#000", borderRadius: 20, paddingVertical: 8, alignItems: "center", borderWidth: 2, borderColor: "#ad93c8", },
  buttonText: { color: "#ad93c8", fontSize: 14, fontWeight: "bold" },
});


export const datePickerStyles = StyleSheet.create({
  container: { paddingVertical: 0 },
  input: { backgroundColor: "#312c35", borderColor: "#302938", color: "white", borderRadius: 10, height: 56, paddingHorizontal: 16, fontSize: 16, borderWidth: 0, },
});


 export const calculatorHeaderStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 2 },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 50, },
  symbol: { color: "white", fontSize: 22, fontWeight: "bold", paddingLeft: 16, paddingTop: 20 },
  inputContainer: { marginTop: 10, paddingHorizontal: 16, paddingVertical: 10 },
  label: { color: "white", fontSize: 16, fontWeight: "500", paddingBottom: 8 },
  input: { backgroundColor: "#312c35", borderColor: "#302938", color: "white", borderRadius: 10, height: 56, paddingHorizontal: 16, fontSize: 16, borderWidth: 0, placeholderTextColor: "#fff", },
  buttonText: { color: "#ad93c8", fontSize: 14, fontWeight: "bold", },
  reinvestContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#000", padding: 10, borderRadius: 10, marginTop: 10, },
  toggleLabelContainer: { flexDirection: "column", },
  toggleSwitch: { flexDirection: "row", alignItems: "center", },
  toggleCircle: { height: 28, width: 28, borderRadius: 14, backgroundColor: "#362447", alignItems: "center", justifyContent: "center", marginRight: 8, },
  toggleCircleActive: { backgroundColor: "#8019e6", },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingHorizontal: 16 },
  periodicButton: { flex: 1, backgroundColor: "#000", borderRadius: 10, height: 40, justifyContent: "center", alignItems: "center", marginHorizontal: 4, },
  selectedButton: { backgroundColor: "#8019e6" },
});


export const calculationResultStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 2, },
  header: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 50, },
  summary: { fontSize: 23, marginVertical: 30, marginTop: 40, color: "white", fontWeight: "bold", padding: 2, },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10, },
  leftColumn: { flex: 1, alignItems: "flex-start", padding: 2, },
  centerColumn: { flex: 1, alignItems: "center", padding: 2, },
  rightColumn: { flex: 1, alignItems: "flex-end", padding: 2, },
  descriptor: { fontSize: 12, color: "gray", marginBottom: 8, marginTop: 8, },
  under: { fontSize: 13, color: "white", fontWeight: "bold", },
  separator: { height: 1, backgroundColor: "#111", marginVertical: 10, },
});


export const barChartStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', borderRadius: 20, padding: 16, marginVertical: 10, borderColor: '#4d3465', borderWidth: 1, height: 300 },
  title: { color: 'white', fontSize: 16, fontWeight: '500', },
  amount: { color: 'white', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  change: { color: '#0bda73', fontSize: 16, fontWeight: '500', marginBottom: 16 },
  chartContainer: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' },
  barContainer: { marginHorizontal: 4, marginVertical: 10, flexDirection: 'row' },
  label: { color: '#ad93c8', fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 50 },
  bar: { flex: 1, backgroundColor: '#000', overflow: 'hidden', marginTop: -4, marginLeft: 75, width: 300, position: 'absolute' },
  filledBar: { height: 60, backgroundColor: '#ad93c8' },
});


export const calculatorScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 2, },
});
