import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_firebaseApiKey,
    authDomain: import.meta.env.VITE_firebaseAuthDomain,
    databaseURL: import.meta.env.VITE_firebaseDatabaseURL,
    projectId: import.meta.env.VITE_firebaseProjectId,
    storageBucket: import.meta.env.VITE_firebaseStorageBucket,
    messagingSenderId: import.meta.env.VITE_firebaseMessagingSenderId,
    appId: import.meta.env.VITE_firebaseAppId
}

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);