// src/firebaseConfig.js
// IMPORTANTE: Reemplazar con tus propias credenciales de Firebase
// Instrucciones en README.md

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC6sSnSCtFehljhv1baeIII6eiMq05NjlU",
  authDomain: "azzaro2-reservas.firebaseapp.com",
  projectId: "azzaro2-reservas",
  storageBucket: "azzaro2-reservas.firebasestorage.app",
  messagingSenderId: "185561829322",
  appId: "1:185561829322:web:9ffff9b4a4f0d1f5260933",
  measurementId: "G-LDW0261RET"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
