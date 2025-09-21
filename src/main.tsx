import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './i18n'

import Splash from './screens/Splash'
import Language from './screens/Language'
import { LoginScreen } from './screens/LoginScreen'
import OtpScreen from './screens/OtpScreen'
import VerificationSuccess from './screens/VerificationSuccess'
import PermissionsScreen from './screens/PermissionsScreen'
import AdminPush from './screens/AdminPush'
import App from './App'
import Home from './screens/Home'
import AddCustomer from './screens/AddCustomer'
import MapPicker from './screens/MapPicker'
import CustomerDetail from './screens/CustomerDetail'
import Screen from './screens/Screen'

import './index.css'

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },            // Splash decides next screen
  { path: '/language', element: <Language /> },  // Language selection
  { path: '/login', element: <LoginScreen /> },  // Phone login screen
  { path: '/otp', element: <OtpScreen /> },      // OTP verification
  { path: '/verified', element: <VerificationSuccess /> },
  { path: '/permissions', element: <PermissionsScreen /> },
  { path: '/admin/push', element: <AdminPush /> },
  { path: '/share', element: <App /> },          // Share target fallback
  { path: '/home', element: <Home /> },           // Home listing
  { path: '/customers/add', element: <AddCustomer /> },
  { path: '/map-picker', element: <MapPicker /> },
  { path: '/customers/:id', element: <CustomerDetail /> },
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
