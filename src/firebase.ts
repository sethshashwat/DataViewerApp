// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDR3-vNcc3JgBHNMldpQsplGtyt5Ssfs6M",
    authDomain: "data-viewer-app-edcc8.firebaseapp.com",
    projectId: "data-viewer-app-edcc8",
    storageBucket: "data-viewer-app-edcc8.firebasestorage.app",
    messagingSenderId: "291791729006",
    appId: "1:291791729006:web:981726d59471f34102117f",
    measurementId: "G-C3WRPFLEW4"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
