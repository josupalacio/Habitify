import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCpohdwjXlOeamp8WNJq-MtaDWpt86p5z0",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "getting-things-done-6eea2.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "getting-things-done-6eea2",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "getting-things-done-6eea2.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "205723042166",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:205723042166:web:1394ecf62f094062d0fa57",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-M31E7LKYY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
