import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Dashboard from './pages/Dashboard.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import Auth from './pages/Auth.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
