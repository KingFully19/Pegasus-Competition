import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 1. Go to https://console.firebase.google.com -> create a project (free "Spark" plan is enough).
// 2. In the project, click the "</>" (web app) icon to register a web app and copy the config below.
// 3. Enable "Authentication" -> Sign-in method -> Email/Password.
// 4. Enable "Firestore Database" -> create database (production mode) -> then paste firestore.rules
//    (see the file firestore.rules in the project root) into Firestore -> Rules -> Publish.
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
