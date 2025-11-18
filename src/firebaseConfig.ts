import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZzmxmJmP2RpxHgFkSapI8lCGQ53gKtis",
  authDomain: "solar-pv-monitoring-system.firebaseapp.com",
  projectId: "solar-pv-monitoring-system",
  storageBucket: "solar-pv-monitoring-system.firebaseapp.com",
  messagingSenderId: "191594305690",
  appId: "1:191594305690:web:7a03766d4fbbeb3a1d6723",
  measurementId: "G-SZB6QBWC6K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);