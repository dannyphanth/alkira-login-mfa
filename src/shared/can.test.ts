import { describe, expect, it } from 'vitest'
import type { User } from './types/auth'
import { can } from './can'

const reader: User = {
    id: '1',
    email: 'reader@alkira.dev',
    name: 'Riley',
    role: 'readonly',
}

const editor: User = {
    id: '2',
    email: 'editor@alkira.dev',
    name: 'Jordan',
    role: 'readwrite',
}

describe('can', () => {
    it('lets both roles view', () => {
        expect(can(reader, 'view')).toBe(true)
        expect(can(editor, 'view')).toBe(true)
    })

    it('lets only readwrite edit', () => {
        expect(can(reader, 'edit')).toBe(false)
        expect(can(editor, 'edit')).toBe(true)
    })

    it('denies everything when there is no user', () => {
        expect(can(null, 'view')).toBe(false)
        expect(can(null, 'edit')).toBe(false)
    })
})