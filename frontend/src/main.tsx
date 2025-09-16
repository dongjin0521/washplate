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
import { Login } from './views/auth/Login'
import { Register } from './views/auth/Register'
import { useWashStore } from './store/useWashStore'

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const user = useWashStore.getState().user
  if (!user) {
    const next = window.location.pathname + window.location.search
    window.location.replace('/auth/login?next=' + encodeURIComponent(next))
    return null
  }
  return <>{children}</>
}

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/u/status" replace /> },
  { path: '/auth/login', element: <Login /> },
  { path: '/auth/register', element: <Register /> },
  {
    path: '/u',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="status" replace /> },
      { path: 'status', element: <RequireAuth><UserStatus /></RequireAuth> },
      { path: 'vehicles', element: <RequireAuth><UserVehicles /></RequireAuth> },
      { path: 'payments', element: <RequireAuth><UserPayments /></RequireAuth> },
      { path: 'merchants', element: <RequireAuth><UserMerchants /></RequireAuth> },
      { path: 'settings', element: <RequireAuth><UserSettings /></RequireAuth> },
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




