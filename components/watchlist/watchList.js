import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore"; 
import { db } from '../../config/firebase'; 
import { getAuth } from "firebase/auth";

const WatchList = ({ symbol, name, price, type, color }) => {
  const [isWatchListed, setIsWatchListed] = useState(false);
  const auth = getAuth(); 
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const checkWatchListStatus = async () => {
        const docRef = doc(db, `users/${user.uid}/watchList`, symbol);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsWatchListed(true);
        }
      };
      checkWatchListStatus();
    }
  }, [symbol, user]);

  const toggleWatchList = async () => {
    if (user) {
      const docRef = doc(db, `users/${user.uid}/watchList`, symbol);
      if (isWatchListed) {
        await deleteDoc(docRef);
        setIsWatchListed(false);
      } else {
        await setDoc(docRef, {symbol,name,price,type,});
        setIsWatchListed(true);
      }
    }
    else {
      Alert.alert('Oops!', 'Sign up to add this to your watchlist!');
    }
  };

  return (
    <TouchableOpacity onPress={toggleWatchList}>
      <Icon 
        name={isWatchListed ? "star" : "star-border"} 
        size={30} 
        color={isWatchListed ? color : color} 
      />
    </TouchableOpacity>
  );
};

export default WatchList;