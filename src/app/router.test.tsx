import { render, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../features/auth/authProvider'
import { routes } from './router'

describe('routes', () => {
  it('redirects / to /login', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login')
    })
  })
})