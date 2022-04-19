import {
  signUpEmail as firebaseSignUpEmail,
  loginEmail as firebaseLoginEmail,
  onAuthStateChanged,
  signOut,
  updateProfile,
  updateEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  auth,
} from '/src/api/firebaseAuth.js'
import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoading } from './useLoading.jsx'

export const authContext = createContext(null)

const authResult = {
  userCredential: null,
  isSuccess: null,
  redirect: null,
  error: null,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const { isLoading, setIsLoading } = useLoading()
  const navigate = useNavigate()

  const emailSignUp = async ({ email, password }) => {
    if (user !== null) {
      return { ...authResult, isSuccess: true, redirect: '/' }
    }
    setIsLoading(true)
    try {
      const { userCredential } = await firebaseSignUpEmail({ email, password })
      return { ...authResult, userCredential, isSuccess: true, redirect: '/' }
    } catch (error) {
      return {
        ...authResult,
        isSuccess: false,
        error: rewriteErrorMsg({ code: error.code, message: error.message }),
      }
    } finally {
      setIsLoading(false)
    }
  }

  const emailLogin = async ({ email, password }) => {
    if (user !== null) {
      return { ...authResult, isSuccess: true, redirect: '/' }
    }
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    await signOut()
    setIsLoading(false)
    navigate('/login')
  }

  const updateUserProfile = async ({ displayName = null, photoURL = null }) => {
    if (!!auth?.currentUser === false) {
      return {
        message: 'Not login yet.',
        isSuccess: false,
      }
    }
    if (displayName === null && photoURL === null) {
      return {
        message: 'Receive empty data.',
        isSuccess: false,
      }
    }
    setIsLoading(true)
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      })
      setUser({
        ...user,
        displayName,
      })
      return {
        displayName,
        message: 'Update profile success!',
        isSuccess: true,
      }
    } catch (error) {
      console.error(error)
      return {
        message: 'Sorry, updating profile failed.',
        isSuccess: false,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserEmail = async (newEmail) => {
    if (!!auth?.currentUser === false) {
      return {
        message: 'Not login yet.',
        isSuccess: false,
      }
    }

    if (!!newEmail === false) {
      return {
        message: 'Receive wrong value.',
        isSuccess: false,
      }
    }
    setIsLoading(true)
    try {
      await updateEmail(auth.currentUser, newEmail)

      setUser({
        ...user,
        email: newEmail,
      })

      return {
        email,
        message: 'Update profile success!',
        isSuccess: true,
      }
    } catch (error) {
      console.error(error)
      return {
        message: 'Sorry, updating email failed.',
        isSuccess: false,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const sendEmailVerification = async () => {
    if (!!auth?.currentUser === false) {
      return {
        message: 'Not login yet.',
        isSuccess: false,
      }
    }
    setIsLoading(true)
    try {
      await firebaseSendEmailVerification(auth.currentUser)
      return {
        message: 'Verification Email has sent!',
        isSuccess: true,
      }
    } catch (error) {
      console.error(error)
      return {
        message: 'Sorry, send verification email failed.',
        isSuccess: false,
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    onAuthStateChanged((user) => {
      const isLogin = !!user
      console.log(user ? 'Login' : 'Logout', `user: `, user)

      const randomPhoto = `https://i.pravatar.cc/100?u=${Math.random()
        .toString(36)
        .substring(2)}`

      setUser(
        isLogin
          ? {
              ...user,
              photoURL: user?.photoURL ?? randomPhoto,
              randomPhoto: !user?.photoURL,
            }
          : null
      )

      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    })
  }, [])

  const value = {
    user,
    isLogin: !!user,
    emailSignUp,
    emailLogin,
    logout,
    updateUserProfile,
    updateUserEmail,
    sendEmailVerification,
  }
  return (
    <authContext.Provider value={value}>
      {!isLoading && children}
    </authContext.Provider>
  )
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
  }
  return {
    code,
    message,
  }
}
