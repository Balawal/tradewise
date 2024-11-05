import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

const useUser = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUsername = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userDoc = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(userDoc);

                if (docSnap.exists()) {
                    setUsername(docSnap.data().username);
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchUsername();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser({
                    email: currentUser.email,
                    username: currentUser.displayName || 'No Username',
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return { user, username };
};

export default useUser;