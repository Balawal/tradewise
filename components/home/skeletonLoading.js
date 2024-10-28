import React from "react";
import { View, StyleSheet } from "react-native";

const SkeletonLoader = () => {
	return (
		<View style={styles.card}>
			<View style={styles.placeholder} />
			<View style={styles.placeholder} />
			<View style={styles.placeholder} />
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#1c1c1c",
		borderRadius: 8,
		padding: 10,
		marginRight: 15,
		width: 130,
		height: 150,
		justifyContent: "flex-start",
		alignItems: "flex-start",
	},
	placeholder: {
		backgroundColor: "#444444",
		height: 10,
		marginBottom: 10,
		borderRadius: 4,
		width: "80%",
	},
});

export default SkeletonLoader;