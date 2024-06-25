import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Landing from './routes/landing/landing'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
