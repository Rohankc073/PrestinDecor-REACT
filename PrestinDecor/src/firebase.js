import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyBlDgd77EtoIeGfJMc4rbLPJ0jjhPje1mo",
  authDomain: "funatu-3e9d1.firebaseapp.com",
  projectId: "funatu-3e9d1",
  storageBucket: "funatu-3e9d1.appspot.com",
  messagingSenderId: "464742668298",
  appId: "1:464742668298:web:169d6d4d3398e9c45927f3",
  measurementId: "G-C1YWQDC626"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize Firebase Authentication

export { db, storage, auth, firestore, doc, getDoc, setDoc , getDocs, where, deleteDoc, collection, query};
