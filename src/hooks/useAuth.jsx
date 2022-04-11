import {
  signUpEmail as firebaseSignUpEmail,
  loginEmail as firebaseLoginEmail,
  onAuthStateChanged,
  signOut,
} from '/src/api/firebaseAuth.js'
import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const authContext = createContext(null)

const authResult = {
  userCredential: null,
  isSuccess: null,
  redirect: null,
  error: null,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const emailSignUp = async ({ email, password }) => {
    if (user !== null) {
      return { ...authResult, isSuccess: true, redirect: '/' }
    }
    try {
      const { userCredential } = await firebaseSignUpEmail({ email, password })
      return { ...authResult, userCredential, isSuccess: true, redirect: '/' }
    } catch (error) {
      return {
        ...authResult,
        isSuccess: false,
        error: rewriteErrorMsg({ code: error.code, message: error.message }),
      }
    }
  }

  const emailLogin = async ({ email, password }) => {
    if (user !== null) {
      return { ...authResult, isSuccess: true, redirect: '/' }
    }
    try {
      const { userCredential } = await firebaseLoginEmail({ email, password })
      return {
        ...authResult,
        userCredential,
        isSuccess: true,
        redirect: '/chat/1',
      }
    } catch (error) {
      return {
        ...authResult,
        isSuccess: false,
        error: rewriteErrorMsg({ code: error.code, message: error.message }),
      }
    }
  }

  const logout = async () => {
    await signOut()
    navigate('/login')
  }

  useEffect(() => {
    onAuthStateChanged((user) => {
      const isLogin = !!user
      console.log(user ? 'Login' : 'Logout', `user: `, user)
      setUser(isLogin ? user : null)
    })
  }, [])

  const value = { user, isLogin: !!user, emailSignUp, emailLogin, logout }
  return <authContext.Provider value={value}>{children}</authContext.Provider>
}

export function useAuth() {
  return useContext(authContext)
}

function rewriteErrorMsg({ code, message }) {
  switch (code) {
    case 'auth/email-already-in-use':
      message = 'This email has been signed up.'
      break
    case 'auth/invalid-email':
      message = 'Please ensure typing Your email correctly.'
      break
    case 'auth/weak-password':
      message = 'Please ensure typing Your email correctly.'
      break
    case 'auth/too-many-requests':
      message =
        'You have attempted to login too many time, please try login later.'
      break
    case 'auth/user-not-found':
      message = "Couldn't find this user."
      break
    case 'auth/wrong-password':
      message = 'Wrong password'
      break
    case 'auth/too-many-requests':
      message =
        'You have attempted to login too many time, please try login later.'
      break
  }
  return {
    code,
    message,
  }
}
