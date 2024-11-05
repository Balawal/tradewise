import { useEffect, useState } from 'react';
import { collection, onSnapshot } from "firebase/firestore"; 
import { db } from '../../config/firebase';
import { getAuth } from 'firebase/auth';

const useWatchList = () => {
  const [watchList, setWatchList] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/watchList`), (snapshot) => {
      const updatedWatchList = snapshot.docs.map(doc => doc.data());
      setWatchList(updatedWatchList);
      console.log("Real-time watchlist data::: ", updatedWatchList);
    });

    return () => unsubscribe();
  }, [user]);

  return watchList;
};

export default useWatchList;