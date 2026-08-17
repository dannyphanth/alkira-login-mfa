import { render, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { routes } from './router'

describe('routes', () => {
  it('redirects / to /login', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login')
    })
  })
})
