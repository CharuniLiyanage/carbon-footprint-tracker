import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCIqaf5RKtRdJh3YXIW4g8QvIjgrSGr6xo",
  authDomain: "carbontrack-bc947.firebaseapp.com",
  projectId: "carbontrack-bc947",
  storageBucket: "carbontrack-bc947.firebasestorage.app",
  messagingSenderId: "854805306667",
  appId: "1:854805306667:web:abc3e9ea4739dc9044b96e",
  measurementId: "G-Z760R1KKR0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);