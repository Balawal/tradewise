import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { searchInputStyles as styles } from "../../styles/searchStyles";

const SearchInput = ({ searchTerm, onChangeText, onSubmit, onClear }) => (
    <View style={styles.searchInputWrapper}>
        <Icon name="search" size={20} color="#888" style={styles.searchIconBar} />
        <TextInput
            style={styles.searchInput}
            placeholder="Search for company or coin"
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
        />
        {searchTerm.length > 0 && (
            <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                <Icon name="cancel" size={20} color="#fff" />
            </TouchableOpacity>
        )}
    </View>
);

export default SearchInput;