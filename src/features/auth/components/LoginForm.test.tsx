// Schema messages vs the generic signIn failure.

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../authProvider'
import { LoginForm } from './LoginForm'

function renderForm(onSuccess = vi.fn()) {
    const user = userEvent.setup()
    render(
        <AuthProvider>
            <LoginForm onSuccess={onSuccess} />
        </AuthProvider>,
    )
    return { user, onSuccess }
}

describe('LoginForm', () => {
    it('shows field errors when empty', async () => {
        const { user } = renderForm()
        await user.click(screen.getByRole('button', { name: 'Sign in' }))

        expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
    })

    it('shows a generic error for a wrong password', async () => {
        const { user } = renderForm()
        await user.type(screen.getByLabelText('Email'), 'reader@alkira.dev')
        await user.type(screen.getByLabelText('Password'), 'wrongpass')
        await user.click(screen.getByRole('button', { name: 'Sign in' }))

        expect(await screen.findByText('Email or password is incorrect')).toBeInTheDocument()
    })

    it('calls onSuccess for valid credentials', async () => {
        const { user, onSuccess } = renderForm()
        await user.type(screen.getByLabelText('Email'), 'reader@alkira.dev')
        await user.type(screen.getByLabelText('Password'), 'Password123!')
        await user.click(screen.getByRole('button', { name: 'Sign in' }))

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalled()
        })
    })
})