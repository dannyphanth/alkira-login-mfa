// Same table for both roles. Protect hides write actions for viewers.

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { User } from '../../../shared/types/auth'
import { AuthProvider } from '../../auth/authProvider'
import { DashboardPage } from './DashboardPage'

const reader: User = {
    id: 'user-reader',
    email: 'reader@alkira.dev',
    name: 'Riley Miller',
    role: 'readonly',
}

const editor: User = {
    id: 'user-editor',
    email: 'editor@alkira.dev',
    name: 'Jordan Glover',
    role: 'readwrite',
}

function renderDashboard(sessionUser: User) {
    const user = userEvent.setup()
    sessionStorage.setItem('alkira-auth', JSON.stringify({ status: 'authenticated', user: sessionUser }))
    render(
        <AuthProvider>
            <DashboardPage />
        </AuthProvider>,
    )
    return { user }
}

describe('DashboardPage', () => {
    it('hides write actions for a viewer', () => {
        renderDashboard(reader)

        expect(screen.getByText('Viewer')).toBeInTheDocument()
        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Add site' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /Delete/ })).not.toBeInTheDocument()
    })

    it('shows write actions for an editor', () => {
        renderDashboard(editor)

        expect(screen.getByText('Editor')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Add site' })).toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(4)
        expect(screen.getByRole('button', { name: 'Delete San Jose HQ' })).toBeInTheDocument()
    })

    it('lets an editor add a site', async () => {
        const { user } = renderDashboard(editor)

        await user.click(screen.getByRole('button', { name: 'Add site' }))
        await user.type(screen.getByLabelText('Name'), 'Austin office')
        await user.click(screen.getByRole('button', { name: 'Save' }))

        expect(screen.getByText('Austin office')).toBeInTheDocument()
    })

    it('lets an editor delete a site after confirming', async () => {
        const { user } = renderDashboard(editor)

        await user.click(screen.getByRole('button', { name: 'Delete San Jose HQ' }))
        const dialog = screen.getByRole('dialog')
        await user.click(within(dialog).getByRole('button', { name: 'Delete' }))
        expect(screen.queryByText('San Jose HQ')).not.toBeInTheDocument()
    })
})
