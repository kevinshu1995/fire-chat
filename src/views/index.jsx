import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import { useAuth } from '/src/hooks/useAuth.jsx'

import Layout from './Layout.jsx'
import Chat from './chat/Chat.jsx'
import ChatRoom from './chat/ChatRoom.jsx'
import Login from './Login.jsx'
import SignUp from './SignUp.jsx'
import MyLayout from './my/index.jsx'
import Account from './my/Account.jsx'
import Setting from './my/Setting.jsx'

const redirect = {
  isLogin: '/chat/1',
  isNotLogin: '/login',
}

export default function View() {
  const { isLogin } = useAuth()

  const routes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '',
          element: <GeneralNavigate />,
        },
        {
          path: 'chat',
          element: (
            <RequireAuth>
              <Chat />
            </RequireAuth>
          ),
          children: [
            {
              path: '',
              element: <GeneralNavigate />,
            },
            { path: ':id', element: <ChatRoom /> },
          ],
        },
        {
          path: 'my',
          element: (
            <RequireAuth>
              <MyLayout />
            </RequireAuth>
          ),
          children: [
            { path: 'account', element: <Account /> },
            // { path: 'setting', element: <Setting /> },
          ],
        },
      ],
    },
    {
      path: 'login',
      element: isLogin ? <Navigate to={redirect.isLogin} /> : <Login />,
    },
    {
      path: 'sign-up',
      element: isLogin ? <Navigate to={redirect.isLogin} /> : <SignUp />,
    },
    {
      path: '*',
      element: <GeneralNavigate />,
    },
  ]
  return useRoutes(routes)
}

function GeneralNavigate() {
  const { isLogin } = useAuth()
  return (
    <Navigate to={isLogin ? redirect.isLogin : redirect.isNotLogin} replace />
  )
}

function RequireAuth({ children }) {
  const { isLogin } = useAuth()

  if (isLogin === false) {
    console.log('Not login!')
    return <Navigate to={redirect.isNotLogin} replace />
  }

  return children
}
