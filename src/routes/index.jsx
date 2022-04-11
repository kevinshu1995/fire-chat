import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import Layout from './Layout.jsx'
import Chat from './chat/Chat.jsx'
import ChatRoom from './chat/ChatRoom.jsx'
import Login from './Login.jsx'

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
