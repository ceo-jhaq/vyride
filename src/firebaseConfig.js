// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGnZeGj2U9pXwIjudHcrWEjj48VTPmNYQ",
  authDomain: "vyride-73089.firebaseapp.com",
  projectId: "vyride-73089",
  storageBucket: "vyride-73089.firebasestorage.app",
  messagingSenderId: "256279822806",
  appId: "1:256279822806:web:584ec2e3ed73144e9f6477",
  measurementId: "G-GYWBD2HX8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, firebaseConfig, analytics };