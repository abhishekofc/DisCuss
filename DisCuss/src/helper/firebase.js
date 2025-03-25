// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "discuss-a1d69.firebaseapp.com",
  projectId: "discuss-a1d69",
  storageBucket: "discuss-a1d69.firebasestorage.app",
  messagingSenderId: "781072619463",
  appId: "1:781072619463:web:68eef8d0ab941f2eed6be2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app)
const provider=new GoogleAuthProvider()
export {auth,provider}