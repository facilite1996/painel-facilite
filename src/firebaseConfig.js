// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDRETYBRxSc4FQz9PojDfa8pEj6DOL7dI",
  authDomain: "facilite-pagamentos.firebaseapp.com",
  projectId: "facilite-pagamentos",
  storageBucket: "facilite-pagamentos.firebasestorage.app",
  messagingSenderId: "175177131032",
  appId: "1:175177131032:web:18e94c5581a47604110f6d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);