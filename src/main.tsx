import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './i18n'

import Splash from './screens/Splash'
import Language from './screens/Language'
import { LoginScreen } from './screens/LoginScreen'
import App from './App'
import Screen from './screens/Screen'

import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },            // Splash decides next screen
  { path: '/language', element: <Language /> },  // Language selection
  { path: '/login', element: <LoginScreen /> },  // Phone login screen
  { path: '/home', element: <App /> },           // post-login “home”
])

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
