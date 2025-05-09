// Import the functions you need from the SDKs you need

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Для базы данных
import { getStorage } from "firebase/storage";     // Для хранения файлов
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5B4eOZ_kkQyHbXQYZX010gNz5fXU-FT4",
  authDomain: "quizzz-react.firebaseapp.com",
  projectId: "quizzz-react",
  storageBucket: "quizzz-react.firebasestorage.app",
  messagingSenderId: "510424216459",
  appId: "1:510424216459:web:4bf9cc6796e0cebd20358e",
  measurementId: "G-BQ9HNLG9L6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();