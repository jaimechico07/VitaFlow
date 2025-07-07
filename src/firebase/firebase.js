// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBEeh1w-PUod_5wrLFW6jQcpPmBpTPKyCQ",
    authDomain: "gestion-me.firebaseapp.com",
    databaseURL: "https://gestion-me-default-rtdb.firebaseio.com",
    projectId: "gestion-me",
    storageBucket: "gestion-me.firebasestorage.app",
    messagingSenderId: "1038224832094",
    appId: "1:1038224832094:web:d8b7f744953b89c8fce6cf"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
