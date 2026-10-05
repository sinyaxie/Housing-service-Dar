// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaTbGCAglm4uZzuduBzoWO7mC6un6_-Oc",
  authDomain: "housing-service-dsm.firebaseapp.com",
  projectId: "housing-service-dsm",
  storageBucket: "housing-service-dsm.firebasestorage.app",
  messagingSenderId: "68269637708",
  appId: "1:68269637708:web:c1e7e630419733ef34f4e9",
  measurementId: "G-J5JF8GXMZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
