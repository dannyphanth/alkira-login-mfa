// /mfa is only for the in-between state — not logged out, not fully in.

import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../features/auth/authProvider'

export function RequireMfaPending({ children }: { children: ReactNode }) {
    const { status } = useAuth()

    if (status === 'anonymous') {
        return <Navigate to="/login" replace />
    }

    if (status === 'authenticated') {
        return <Navigate to="/app" replace />
    }

    return children
}