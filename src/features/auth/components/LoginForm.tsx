// Field errors come from the schema. The Alert is only for a failed signIn.

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { useAuth } from '../authProvider'
import { loginSchema, type LoginValues } from '../schema'

export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
    const { signIn } = useAuth()
    const [authError, setAuthError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    })

    async function onSubmit(values: LoginValues) {
        setAuthError(null)
        const result = await signIn(values.email, values.password)
        if (result.ok) {
            onSuccess()
            return
        }
        setAuthError('Email or password is incorrect')
    }

    return (
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
            {authError && <Alert severity="error">{authError}</Alert>}

            <TextField
                label="Email"
                type="email"
                autoComplete="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                {...register('email')}
            />

            <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                {...register('password')}
            />

            <Button type="submit" variant="contained" loading={isSubmitting}>
                Sign in
            </Button>
        </Stack>
    )
}