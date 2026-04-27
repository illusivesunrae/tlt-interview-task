import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const offline = import.meta.env.VITE_demo_mode === 'true'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_firebaseApiKey,
  authDomain: import.meta.env.VITE_firebaseAuthDomain,
  databaseURL: import.meta.env.VITE_firebaseDatabaseURL,
  projectId: import.meta.env.VITE_firebaseProjectId,
  storageBucket: import.meta.env.VITE_firebaseStorageBucket,
  messagingSenderId: import.meta.env.VITE_firebaseMessagingSenderId,
  appId: import.meta.env.VITE_firebaseAppId,
}

export const firebaseApp = !offline ? initializeApp(firebaseConfig) : null
export const db = !offline ? getDatabase(firebaseApp) : null
export const auth = !offline ? getAuth(firebaseApp) : null
