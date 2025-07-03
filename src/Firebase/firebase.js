// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBe9SIGJmqG0YkxFaMyg3clTNc4mP-X898",
  authDomain: "trackly-57ef4.firebaseapp.com",
  projectId: "trackly-57ef4",
  storageBucket: "trackly-57ef4.appspot.com", // ✅ fixed typo: was `firebasestorage.app`
  messagingSenderId: "941529143610",
  appId: "1:941529143610:web:e6e732f52a195c58b65803",
  measurementId: "G-GNXMPHRXE1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auths = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
