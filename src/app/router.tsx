import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { MfaPage } from '../features/auth/pages/MfaPage'
import { SignupPage } from '../features/auth/pages/SignupPage'

export const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/mfa', element: <MfaPage /> },
  { path: '/app', element: <DashboardPage /> },
  { path: '*', element: <Navigate to="/login" replace /> },
]

export const router = createBrowserRouter(routes)
