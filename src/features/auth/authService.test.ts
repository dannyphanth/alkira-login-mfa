// Covers happy path and failures for signIn / verifyMfa,
// and that the returned user has no password or MFA code.

import { describe, expect, it } from 'vitest'
import { signIn, verifyMfa } from './authService'

describe('signIn', () => {
    it('returns the user for valid credentials', async () => {
        const result = await signIn('reader@alkira.dev', 'Password123!')

        expect(result.ok).toBe(true)
        if (result.ok) {
            expect(result.user.role).toBe('readonly')
            expect(result.user).not.toHaveProperty('password')
            expect(result.user).not.toHaveProperty('mfaCode')
        }
    })

    it('rejects a wrong password', async () => {
        const result = await signIn('reader@alkira.dev', 'wrong')
        expect(result).toEqual({ ok: false, error: 'INVALID_CREDENTIALS' })
    })
})

describe('verifyMfa', () => {
    it('accepts the matching code', async () => {
        const result = await verifyMfa('editor@alkira.dev', '654321')
        expect(result.ok).toBe(true)
    })

    it('rejects a wrong code', async () => {
        const result = await verifyMfa('editor@alkira.dev', '000000')
        expect(result).toEqual({ ok: false, error: 'INVALID_MFA' })
    })
})