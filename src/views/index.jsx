import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import Layout from './Layout.jsx'
import Chat from './chat/Chat.jsx'
import ChatRoom from './chat/ChatRoom.jsx'
import Login from './Login.jsx'
import MyLayout from './my/index.jsx'
import Account from './my/Account.jsx'
import Setting from './my/Setting.jsx'

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'chat',
        element: <Chat />,
        children: [{ path: ':id', element: <ChatRoom /> }],
      },
      {
        path: 'my',
        element: <MyLayout />,
        children: [
          { path: 'account', element: <Account /> },
          { path: 'setting', element: <Setting /> },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Navigate to="/chat/" replace />,
  },
]

export default function View() {
  return useRoutes(routes)
}
