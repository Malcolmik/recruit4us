import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import Candidates from './pages/Candidates'
import Settings from './pages/Settings'
import Booking from './pages/Booking'

const router = createBrowserRouter([
  { path: '/', element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'candidates', element: <Candidates /> },
      { path: 'settings', element: <Settings /> },
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/booking/:token', element: <Booking /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
)
