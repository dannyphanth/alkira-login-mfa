import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Vitest doesn't enable RTL's Jest auto-cleanup unless globals are on.
afterEach(() => {
  cleanup()
})
