import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Landing from './routes/landing/landing'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { SessionProvider } from './contexts/SessionContext'
import Home from './routes/home/home'
import Chat from './routes/chat/chat'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path:'/chat',
    element:<Chat/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <SessionProvider>
    <RouterProvider router={router} />
  </SessionProvider>
)
