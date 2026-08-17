import { Button, Container, Paper, Stack, Typography } from '@mui/material'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../authProvider'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  const { status } = useAuth()
  const navigate = useNavigate()

  if (status === 'authenticated') {
    return <Navigate to="/app" replace />
  }

  if (status === 'mfaPending') {
    return <Navigate to="/mfa" replace />
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1">
            Sign in
          </Typography>
          <LoginForm onSuccess={() => navigate('/mfa')} />
          <Button component={RouterLink} to="/signup">
            Create an account
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}