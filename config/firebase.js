import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMbX9j4QhTHzBrky2iok84ZQFxRo1MbDQ",
  authDomain: "tradwise-auth.firebaseapp.com",
  projectId: "tradwise-auth",
  storageBucket: "tradwise-auth.appspot.com",
  messagingSenderId: "413835240721",
  appId: "1:413835240721:web:a020f8ce345b5d2a7ed8b0",
  measurementId: "G-BD0FFMBG0G"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);