import { useAuth } from '/src/hooks/useAuth.jsx'

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import clsx from 'clsx'

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('')
  const { emailLogin } = useAuth()
  const [wrongInputAry, setWrongInputAry] = useState([])
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()

    // reset
    setWrongInputAry([])
    setErrorMsg('')

    const userData = Object.fromEntries(new FormData(e.target).entries())
    const { redirect, isSuccess, error } = await emailLogin(userData)

    if (isSuccess) {
      // 已登入 或 成功登入
      navigate(redirect)
    } else {
      // 發生錯誤
      console.log(error)
      switch (error.code) {
        case 'auth/user-not-found':
          setWrongInputAry(['email'])
          break
        case 'auth/wrong-password':
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
        <h1 className="text-3xl font-bold text-cyan-500">Log in</h1>
      </div>
      <form className="flex w-full flex-col gap-4" onSubmit={onSubmit}>
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
          </div>
        </div>
        <p className="text-sm text-red-500">{errorMsg}</p>
        <button
          className="bg-cyan-500 p-2 text-white hover:bg-cyan-400"
          type="submit"
        >
          Log in with E-mail
        </button>
      </form>

      <p>or</p>

      <div className="flex w-full flex-col gap-2 text-center">
        <button className="bg-gray-200">
          <Link className="block h-full w-full py-1" to="/sign-up">
            Sign up with E-mail
          </Link>
        </button>
      </div>
    </div>
  )
}
