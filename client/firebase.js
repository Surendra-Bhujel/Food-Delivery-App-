// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {  getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mithodelivery-3a267.firebaseapp.com",
  projectId: "mithodelivery-3a267",
  storageBucket: "mithodelivery-3a267.firebasestorage.app",
  messagingSenderId: "694989050341",
  appId: "1:694989050341:web:bd30c1d873c0fe75655f0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth};