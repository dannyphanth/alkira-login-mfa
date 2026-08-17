// Permission checks in one place so buttons don't each inspect user.role.

import type { User } from './types/auth'

export type Permission = 'view' | 'edit'

export function can(user: User | null, permission: Permission): boolean {
    if (!user) {
        return false
    }

    if (permission === 'view') {
        return true
    }

    return user.role === 'readwrite'
}