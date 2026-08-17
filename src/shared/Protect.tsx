// Hide edit actions unless can() says yes.

import type { ReactNode } from 'react'
import { useAuth } from '../features/auth/authProvider'
import { can, type Permission } from './can'

export function Protect({
    permission,
    children,
}: {
    permission: Permission
    children: ReactNode
}) {
    const { user } = useAuth()

    if (!can(user, permission)) {
        return null
    }

    return children
}