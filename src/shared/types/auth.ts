export type Role = 'readonly' | 'readwrite'

export type User = {
    id: string
    email: string
    name: string
    role: Role
}

export type AuthStatus = 'anonymous' | 'mfaPending' | 'authenticated'

