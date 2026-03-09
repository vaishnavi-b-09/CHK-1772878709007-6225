import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- YOUR FIREBASE CONFIG ---
const firebaseConfig = {
    apiKey: "AIzaSyD-K_ZWnRpsltjfvtXKRQ8DSoqsiWBj18Y",
    authDomain: "gyan-setu-ec05a.firebaseapp.com",
    projectId: "gyan-setu-ec05a",
    storageBucket: "gyan-setu-ec05a.firebasestorage.app",
    messagingSenderId: "885325843624",
    appId: "1:885325843624:web:17ef1a1c2bc950fbe5069d",
    measurementId: "G-HSWDNG2EBG"
};

// --- INITIALIZE & EXPORT ---
const app = initializeApp(firebaseConfig);

// We export these so we can use them anywhere in your app!
export const auth = getAuth(app);
export const db = getFirestore(app);