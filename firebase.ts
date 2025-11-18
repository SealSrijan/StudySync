// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsBS6lKFlEMUv7OW-jgwVNj9dDmWJ3Rd8",
  authDomain: "studysync-e338a.firebaseapp.com",
  projectId: "studysync-e338a",
  storageBucket: "studysync-e338a.firebasestorage.app",
  messagingSenderId: "799347574826",
  appId: "1:799347574826:web:8ec5bc6f9f7759d9eb9b53",
  measurementId: "G-BX4TJH7TXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // analytics may fail in non-browser environments
    analytics = null;
  }
}

const auth = getAuth(app);
// Ensure auth state persists across browser reloads
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // ignore persistence errors
  });
}
const db = getFirestore(app);

export { app, analytics, auth, db, firebaseConfig };