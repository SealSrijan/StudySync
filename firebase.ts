import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAsBS6lKFlEMUv7OW-jgwVNj9dDmWJ3Rd8",
  authDomain: "studysync-e338a.firebaseapp.com",
  projectId: "studysync-e338a",
  storageBucket: "studysync-e338a.firebasestorage.app",
  messagingSenderId: "799347574826",
  appId: "1:799347574826:web:8ec5bc6f9f7759d9eb9b53"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);