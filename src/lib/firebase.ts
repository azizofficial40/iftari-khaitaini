import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA2QRDordz1nZ1GaKgzRdkkF4EL1wPJ0Ds",
  authDomain: "iftar-kaitaini.firebaseapp.com",
  projectId: "iftar-kaitaini",
  storageBucket: "iftar-kaitaini.firebasestorage.app",
  messagingSenderId: "636122784051",
  appId: "1:636122784051:web:64e289d526a1f8e26ede46",
  measurementId: "G-TS7M1REDXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
