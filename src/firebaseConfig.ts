import { initializeApp } from "firebase/app";
import * as firestore from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZzmxmJmpR2pXhgFkSapl8iCGQ53gKtis",
  authDomain: "solar-pv-monitoring-system.firebaseapp.com",
  projectId: "solar-pv-monitoring-system",
  storageBucket: "solar-pv-monitoring-system.firebasestorage.app",
  messagingSenderId: "191594305690",
  appId: "1:191594305690:web:7a03766d4fbbeb3a1d6723",
  measurementId: "G-SZB6QBWC6K"
};

const app = initializeApp(firebaseConfig);
export const db = (firestore as any).getFirestore(app);
export const auth = getAuth(app);