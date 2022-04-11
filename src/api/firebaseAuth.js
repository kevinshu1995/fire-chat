import { firebase } from './firebase.js'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth'

const auth = getAuth(firebase)

export function signUpEmail({ email, password }) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function loginEmail({ email, password }) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function onAuthStateChanged(cb) {
  firebaseOnAuthStateChanged(auth, (user) => {
    if (typeof cb !== 'function')
      throw new TypeError(
        "onAuthStateChange's parameter cb need to be a function"
      )
    cb(user)
  })
}

export function signOut() {
  return firebaseSignOut(auth)
}
