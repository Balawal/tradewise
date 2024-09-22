import React, { useEffect, useState, useRef, useCallback} from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, Easing, TouchableOpacity, Modal, TextInput, Keyboard} from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SearchStocks = ({navigation}) => {
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["83%"];
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  const [searchResult, setSearchResult] = useState(null);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const handlePresentModal = () => {
    console.log('Present modal triggered');
    bottomSheetModalRef.current?.present();
    setTimeout(() => {
      searchInputRef.current?.focus(); // Focus the search bar after the modal appears
    }, 100); // Adjust delay as needed to ensure proper rendering
  };

  const clearInput = () => {
    setSearchTerm('');
    setSearchResult('');
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text); // Update search term on input change
    setIsSearchSubmitted(false);
  };


  const handleSearchSubmit = async () => {
    if (searchTerm.trim() === '') return;
  
    try {
      const response = await fetch('http://192.168.1.118:3000/api/search-query?keywords=${searchTerm}'); 
      //if (!response.ok) throw new Error(HTTP error! status: ${response.status});
      const data = await response.json();
      console.log(data);
  
      // Navigate to the StockDetailScreen with the stock symbol as a parameter
      setSearchResult(data.bestMatches);
      setIsSearchSubmitted(true);
    } catch (error) {
      console.error('Error fetching search data:', error);
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
                // Handle item press, e.g., navigate to stock detail screen
                navigation.navigate('StockDetail', { stockSymbol: match['1. symbol'] });
                {clearInput}
                bottomSheetModalRef.current?.dismiss(); // Close the modal
              }}
            >
              <Text style={styles.resultSymbol}>{match['1. symbol']}</Text>
              <Text style={styles.resultName}>{match['2. name']}</Text>
              <View style={styles.separator} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      );
    }
  };


  return (
    <>
    <View style={{flex: 1, marginTop: 100, height: 40, width: 40, zIndex: 1000}}>
      <TouchableOpacity style={[{ flex: 1}]} onPress={handlePresentModal}>
        <Icon name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
      <View style={styles.container}>
        {/* Search Icon */}
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            handleIndicatorStyle={styles.handleIndicator}
            onDismiss={() => setSearchResult(null)}
            backgroundStyle={styles.bottomSheetBackground}
          >
            <View style={styles.searchContainer}>
              <View style={styles.searchInputWrapper}>
                <Icon name="search" size={20} color="#888" style={styles.searchIconBar} />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder="Company or coin"
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
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
    header: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 12,
    },
    container: {
      flexGrow: 1,
      backgroundColor: '#000000',
      padding: 20,
    },
    contentContainer: {
      flexGrow: 1,
      backgroundColor: '#000000',
    },
    cardsWrapper: {
      flexDirection: 'row',
    },
    card: {
      backgroundColor: '#000000',
      borderRadius: 8,
      padding: 10,
      marginRight: 15,
      width: 150,
      height: 180, 
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    chartWrapper: {
      width: '50%',
      height: 80, 
      marginBottom: 10,
    },
    chart: {
      marginVertical: 2,
      borderRadius: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardSymbol: {
      fontSize: 15,
      fontWeight: 'bold',
      marginLeft: 10,
      marginTop: 5
    },
    cardPrice: {
      fontSize: 20,
      marginBottom: 5,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    cardPercent: {
      fontSize: 11,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    header: {
      fontSize: 24,
      color: 'white',
      fontWeight: 'bold',
      marginBottom: 5,
      marginTop: 40
    },
    subHeader: {
      fontSize: 14,
      color: 'grey',
      marginBottom: 20,
    },
    handleIndicator: {
      backgroundColor: '#888', // Set the handle color to gray
      width: 50, // Adjust the width if needed
      height: 5,  // Adjust the height if needed
      borderRadius: 5,
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#313133', // Gray background for the search bar
      borderRadius: 10,
      padding: 8,
      marginBottom: 24
    },
    searchIconBar: {
      marginRight: 10, // Space between the icon and the input
    },
    searchIcon: {
      //position: 'absolute',
      top: 63, 
      right: 20,
      zIndex: 10,
    },
    bottomSheetBackground: {
      zIndex: 10000,
      borderRadius: 30,
      backgroundColor: 'white', // Black background for the bottom sheet
    },
    searchContainer: {
      backgroundColor: '#080813',
      padding: 18,
      flexDirection: 'column',
      flex: 1,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: '#fff',  // Set text color to white
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
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 5
    },
    resultName: {
      fontSize: 14,
      color: '#888',
    },
    clearButton: {
      marginLeft: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    separator: {
      height: 1,
      backgroundColor: '#111',
      marginVertical: 20,
    },
    noResultsText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold'
    }
  });

export default SearchStocks;