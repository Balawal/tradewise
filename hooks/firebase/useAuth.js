import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, user=>{
            if(user){
                setUser(user);
            }else{
                setUser(null);
            }
        });
        return unsub;
    },[])
    return { user } 
}