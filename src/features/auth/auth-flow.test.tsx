// Full click path: login → MFA → /app, plus the route guards.

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routes } from '../../app/router'
import { AuthProvider } from './authProvider'

function renderAt(path: string) {
    const user = userEvent.setup()
    const router = createMemoryRouter(routes, { initialEntries: [path] })
    render(
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>,
    )
    return { user, router }
}

async function signInAsReader(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText('Email'), 'reader@alkira.dev')
    await user.type(screen.getByLabelText('Password'), 'Password123!')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('heading', { name: 'Check your authenticator' })).toBeInTheDocument()
}

describe('auth flow', () => {
    it('sends a valid login to MFA, then /app after the code', async () => {
        const { user, router } = renderAt('/login')
        await signInAsReader(user)

        await user.type(screen.getByLabelText('Verification code'), '123456')
        await user.click(screen.getByRole('button', { name: 'Verify' }))

        await waitFor(() => {
            expect(router.state.location.pathname).toBe('/app')
        })
    })

    it('stays on MFA when the code is wrong', async () => {
        const { user, router } = renderAt('/login')
        await signInAsReader(user)

        await user.type(screen.getByLabelText('Verification code'), '000000')
        await user.click(screen.getByRole('button', { name: 'Verify' }))

        expect(await screen.findByText('Invalid verification code')).toBeInTheDocument()
        expect(router.state.location.pathname).toBe('/mfa')
    })

    it('sends /app and /mfa to login when logged out', async () => {
        const app = renderAt('/app')
        await waitFor(() => {
            expect(app.router.state.location.pathname).toBe('/login')
        })

        const mfa = renderAt('/mfa')
        await waitFor(() => {
            expect(mfa.router.state.location.pathname).toBe('/login')
        })
    })

    it('opens signup from login', async () => {
        const { user, router } = renderAt('/login')
        await user.click(screen.getByRole('link', { name: 'Create an account' }))
        expect(router.state.location.pathname).toBe('/signup')
        expect(screen.getByRole('heading', { name: 'Create an account' })).toBeInTheDocument()
    })
})