import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '@/firebase'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useFirebaseStore = defineStore('firebase', () => {
  const errorMessage = ref('')
  const successMessage = ref('')
  const isLoggedIn = ref(false)
  const router = useRouter()

  const userChange = () => {
    onAuthStateChanged(auth, (user) => {
      user ? (isLoggedIn.value = true) : (isLoggedIn.value = false)
    })
  }

  const register = (payload) => {
    createUserWithEmailAndPassword(auth, payload.newEmail, payload.newPassword)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user

        successMessage.value = 'Your account was successfully created!'
      })
      .catch((error) => {
        const errorCode = error.code

        switch (errorCode) {
          case 'auth/invalid-email':
            errorMessage.value = 'Invalid email address.'
            break
          default:
            errorMessage.value = 'Email or password was incorrect.'
            break
        }
      })
  }

  const login = (payload) => {
    signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user

        const username = payload.email.split('@')

        localStorage.setItem('username', username[0])

        isLoggedIn.value = true

        router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code

        switch (errorCode) {
          case 'auth/invalid-email':
            errorMessage.value = 'Invalid email address.'
            break
          case 'auth/user-not-found':
            errorMessage.value = 'No account with that email was found.'
            break
          case 'auth/wrong-password':
            errorMessage.value = 'Incorrect password.'
            break
          default:
            errorMessage.value = 'Email or password was incorrect.'
            break
        }
      })
  }

  const logout = () => {
    signOut(auth).then(() => {
      isLoggedIn.value = false
      router.push('/auth')
    })
  }

  return { errorMessage, successMessage, isLoggedIn, userChange, register, login, logout }
})
