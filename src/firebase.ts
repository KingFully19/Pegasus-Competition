import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 1. Go to https://console.firebase.google.com -> create a project (free "Spark" plan is enough).
// 2. In the project, click the "</>" (web app) icon to register a web app and copy the config below.
// 3. Enable "Authentication" -> Sign-in method -> Email/Password.
// 4. Enable "Firestore Database" -> create database (production mode) -> then paste firestore.rules
//    (see the file firestore.rules in the project root) into Firestore -> Rules -> Publish.
const firebaseConfig = {
  apiKey: "AIzaSyB2UFZU0sOcngndLRLx6_RWI7i7fdev7Po",
  authDomain: "pegasus-competition.firebaseapp.com",
  projectId: "pegasus-competition",
  storageBucket: "pegasus-competition.firebasestorage.app",
  messagingSenderId: "673542698440",
  appId: "1:673542698440:web:53659d2ed526cb1139bcfd"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
