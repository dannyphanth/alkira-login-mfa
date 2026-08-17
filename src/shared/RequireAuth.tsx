// /app is only for people who finished password and MFA.

import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../features/auth/authProvider'

export function RequireAuth({ children }: { children: ReactNode }) {
    const { status } = useAuth()

    if (status === 'anonymous') {
        return <Navigate to="/login" replace />
    }

    if (status === 'mfaPending') {
        return <Navigate to="/mfa" replace />
    }

    return children
}