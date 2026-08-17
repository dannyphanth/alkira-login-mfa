import type { Role } from '../../shared/types/auth'

export type MockUser = {
    id: string
    email: string
    name: string
    password: string
    mfaCode: string
    role: Role
}

export const mockUsers: MockUser[] = [
    {
        id: 'user-reader',
        email: 'reader@alkira.dev',
        name: 'Riley Miller',
        password: 'Password123!',
        mfaCode: '123456',
        role: 'readonly'
    },
    {
        id: 'user-editor',
        email: 'editor@alkira.dev',
        name: 'Jordan Glover',
        password: 'Password123!',
        mfaCode: '654321',
        role: 'readwrite'
    }
]