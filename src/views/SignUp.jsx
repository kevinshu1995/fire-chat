import { useAuth } from '/src/hooks/useAuth.jsx'

import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import clsx from 'clsx'

export default function SignUp() {
  const [errorMsg, setErrorMsg] = useState('')
  const { emailSignUp, emailLogin } = useAuth()
  const [wrongInputAry, setWrongInputAry] = useState([])
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()

    setWrongInputAry([])
    setErrorMsg('')

    const userData = Object.fromEntries(new FormData(e.target).entries())

    if (userData.password !== userData['password-confirm']) {
      setWrongInputAry(['password', 'password-confirm'])
      setErrorMsg('Your password fields are not the same.')
      return
    }

    const { userCredential, redirect, error, isSuccess } = await emailSignUp(
      userData
    )

    if (isSuccess) {
      if (userCredential) {
        // 已登入
        navigate(redirect)
      } else {
        // 成功登入
        const { redirect } = await emailLogin(userData)
        navigate(redirect)
      }
    } else {
      // 發生問題
      console.error(error)
      switch (error.code) {
        case 'auth/email-already-in-use':
          setWrongInputAry(['email'])
          break
        case 'auth/invalid-email':
          setWrongInputAry(['email'])
          break
        case 'auth/weak-password':
          setWrongInputAry(['password'])
          break
        case 'auth/too-many-requests':
          setWrongInputAry([])
          break
      }
      setErrorMsg(error.message)
    }
  }

  return (
    <div className="mx-auto flex h-full max-w-xs flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-cyan-500">Sign Up</h1>
      </div>
      <form className="flex w-full flex-col gap-4 " onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="cursor-pointer">
                E-mail
              </label>
              <input
                className={clsx([
                  wrongInputAry.includes('email') && '!ring-red-400',
                  'p-2',
                ])}
                id="email"
                type="email"
                name="email"
                autoSave="true"
                autoFocus
                placeholder="Your Email"
                required
              />
            </div>
            {/* <p className="text-xs text-gray-400">
              This E-mail will be your account.
            </p> */}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="cursor-pointer">
                Password
              </label>
              <input
                className={clsx([
                  wrongInputAry.includes('password') && '!ring-red-400',
                  'p-2',
                ])}
                id="password"
                type="password"
                name="password"
                placeholder="Your Password"
                required
              />
            </div>
            <p className="text-xs text-gray-400">
              Password should be at least 6
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="cursor-pointer">
                Confirm Password
              </label>
              <input
                className={clsx([
                  wrongInputAry.includes('password-confirm') && '!ring-red-400',
                  'p-2',
                ])}
                id="password-confirm"
                type="password"
                name="password-confirm"
                placeholder="Type your Password again"
                required
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-red-500">{errorMsg}</p>
        <button
          className="bg-cyan-500 p-2 text-white hover:bg-cyan-400"
          type="submit"
        >
          Sign up with E-mail
        </button>
      </form>

      <p>or</p>

      <div className="flex w-full flex-col gap-2 text-center">
        <button className="bg-gray-200">
          <Link className="block h-full w-full py-1" to="/login">
            Log in with E-mail
          </Link>
        </button>
      </div>
    </div>
  )
}
