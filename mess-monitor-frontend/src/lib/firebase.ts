import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDuxmN_wbKXIImyEPzsYwqM6mD4gDWaysM",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "quizmaster-1ec61"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "quizmaster-1ec61",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "quizmaster-1ec61"}.firebasestorage.app`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "54672973970",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:54672973970:web:1563eb840e81c98a35c64b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-H1S9LYHJ0L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
