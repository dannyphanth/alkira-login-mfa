// Holds the current session (e.g., logged out, waiting on MFA, or fully in).
// Calls authService, then remembers the result.
// sessionStorage so a refresh in this tab doesn't kick you out.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AuthStatus, User } from '../../shared/types/auth'
import {
    signIn as requestSignIn,
    verifyMfa as requestVerifyMfa,
    type SignInResult,
    type VerifyMfaResult,
} from './authService'

const STORAGE_KEY = 'alkira-auth'

type Session = {
    status: AuthStatus
    user: User | null
}

type AuthContextValue = Session & {
    signIn: (email: string, password: string) => Promise<SignInResult>
    verifyMfa: (code: string) => Promise<VerifyMfaResult>
    signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): Session {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (!raw) {
            return { status: 'anonymous', user: null }
        }
        return JSON.parse(raw) as Session
    } catch {
        return { status: 'anonymous', user: null }
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    // Load from this tab so a refresh doesn't reset the flow
    const [session, setSession] = useState<Session>(readSession)

    useEffect(() => {
        if (session.status === 'anonymous') {
            sessionStorage.removeItem(STORAGE_KEY)
            return
        }
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    }, [session])

    async function signIn(email: string, password: string): Promise<SignInResult> {
        const result = await requestSignIn(email, password)
        if (result.ok) {
            // Password is step 1 - MFA still required
            setSession({ status: 'mfaPending', user: result.user })
        }
        return result
    }

    async function verifyMfa(code: string): Promise<VerifyMfaResult> {
        // Email comes from pending session, not the form
        if (!session.user) {
            return { ok: false, error: 'INVALID_MFA' }
        }

        const result = await requestVerifyMfa(session.user.email, code)
        if (result.ok) {
            setSession({ status: 'authenticated', user: result.user })
        }
        return result
    }

    function signOut() {
        setSession({ status: 'anonymous', user: null })
    }

    return (
        <AuthContext.Provider value={{ ...session, signIn, verifyMfa, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const value = useContext(AuthContext)
    if (!value) {
        throw new Error('useAuth must be used inside AuthProvider')
    }
    return value
}