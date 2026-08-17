import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Stack, TextField } from '@mui/material'
import { useAuth } from '../authProvider'
import { mfaSchema, type MfaValues } from '../schema'

export function MfaForm({ onSuccess }: { onSuccess: () => void }) {
    const { verifyMfa } = useAuth()
    const [authError, setAuthError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<MfaValues>({
        resolver: zodResolver(mfaSchema),
    })

    async function onSubmit(values: MfaValues) {
        setAuthError(null)
        const result = await verifyMfa(values.code)
        if (result.ok) {
            onSuccess()
            return
        }
        setAuthError('Invalid verification code')
    }

    return (
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
            {authError && <Alert severity="error">{authError}</Alert>}

            <TextField
                label="Verification code"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                fullWidth
                error={!!errors.code}
                helperText={errors.code?.message}
                disabled={isSubmitting}
                {...register('code')}
            />

            <Button type="submit" variant="contained" loading={isSubmitting}>
                Verify
            </Button>
        </Stack>
    )
}