// Fake auth API. Checks email/password and MFA against mock users,
// and returns a User that doesn't include password or MFA code.

import type { User } from '../../shared/types/auth'
import { mockUsers, type MockUser } from './mockUsers'

// Fake latency so the UI can show a loading state
const DELAY_MS = 400

function delay(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

// Strip password and MFA code so they never sit on the session user
function toUser(record: MockUser): User {
    return {
        id: record.id,
        email: record.email,
        name: record.name,
        role: record.role,
    }
}

export type SignInResult =
    | { ok: true; user: User }
    | { ok: false; error: 'INVALID_CREDENTIALS' }

export type VerifyMfaResult =
    | { ok: true; user: User }
    | { ok: false; error: 'INVALID_MFA' }

export async function signIn(email: string, password: string): Promise<SignInResult> {
    await delay(DELAY_MS)

    const record = mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase())

    // Don't tell the client whether the email exists - good security practice.
    if (!record || record.password !== password) {
        return { ok: false, error: 'INVALID_CREDENTIALS' }
    }

    return { ok: true, user: toUser(record) }
}

export async function verifyMfa(email: string, code: string): Promise<VerifyMfaResult> {
    await delay(DELAY_MS)

    const record = mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase())

    if (!record || record.mfaCode !== code) {
        return { ok: false, error: 'INVALID_MFA' }
    }

    return { ok: true, user: toUser(record) }
}