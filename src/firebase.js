// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD0bctwz22Z12dfWIVLyylImlGldV8pkXc",
    authDomain: "arena-ducs.firebaseapp.com",
    databaseURL: "https://arena-ducs-default-rtdb.firebaseio.com",
    projectId: "arena-ducs",
    storageBucket: "arena-ducs.appspot.com",
    messagingSenderId: "917188227682",
    appId: "1:917188227682:web:8e19b8465af228d60b173b",
    measurementId: "G-DYW4RYL52K"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
