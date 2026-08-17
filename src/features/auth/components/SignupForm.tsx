import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Stack, TextField } from '@mui/material'
import { signupSchema, type SignupValues } from '../schema'

export function SignupForm({ onSubmit }: { onSubmit: (values: SignupValues) => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
    })

    return (
        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2}>
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
                autoComplete="new-password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                {...register('password')}
            />
            <Button type="submit" variant="contained" loading={isSubmitting}>
                Create account
            </Button>
        </Stack>
    )
}