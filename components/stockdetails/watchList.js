import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore"; 
import { db } from '../../config/firebase'; 

const WatchList = ({ stockSymbol, stockName, stockPrice }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Check if the stock is already favorited in Firestore
    const checkFavoriteStatus = async () => {
      const docRef = doc(db, "watchList", stockSymbol);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setIsFavorited(true);
      }
    };

    checkFavoriteStatus();
  }, [stockSymbol]);

  const toggleFavorite = async () => {
    const docRef = doc(db, "watchList", stockSymbol);
    if (isFavorited) {
      // Remove from favorites
      await deleteDoc(docRef);
      setIsFavorited(false);
    } else {
      // Add to favorites
      await setDoc(docRef, {
        stockSymbol,
        stockName,
        stockPrice
      });
      setIsFavorited(true);
    }
  };

  return (
    <TouchableOpacity onPress={toggleFavorite}>
      <Icon 
        name={isFavorited ? "star" : "star-border"} 
        size={30} 
        color={isFavorited ? "gold" : "white"} 
      />
    </TouchableOpacity>
  );
};

export default WatchList;