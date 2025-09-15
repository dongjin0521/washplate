import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import './styles.css'
import { AppShell } from './ui/AppShell'
import { UserStatus } from './views/user/Status'
import { UserVehicles } from './views/user/Vehicles'
import { UserPayments } from './views/user/Payments'
import { UserMerchants } from './views/user/Merchants'
import { UserSettings } from './views/user/Settings'
import { AdminStatus } from './views/admin/Status'
import { AdminVehicles } from './views/admin/Vehicles'
import { AdminSettlements } from './views/admin/Settlements'
import { AdminFranchises } from './views/admin/Franchises'
import { AdminSettings } from './views/admin/Settings'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/u/status" replace /> },
  {
    path: '/u',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="status" replace /> },
      { path: 'status', element: <UserStatus /> },
      { path: 'vehicles', element: <UserVehicles /> },
      { path: 'payments', element: <UserPayments /> },
      { path: 'merchants', element: <UserMerchants /> },
      { path: 'settings', element: <UserSettings /> },
    ],
  },
  {
    path: '/admin',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="status" replace /> },
      { path: 'status', element: <AdminStatus /> },
      { path: 'vehicles', element: <AdminVehicles /> },
      { path: 'settlements', element: <AdminSettlements /> },
      { path: 'franchises', element: <AdminFranchises /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)




