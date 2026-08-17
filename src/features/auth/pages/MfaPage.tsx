// Guard already blocks this route; redirects here cover refresh / back button.

import { Container, Paper, Stack, Typography, Button } from '@mui/material'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../authProvider'
import { MfaForm } from '../components/MfaForm'


export function MfaPage() {
  const { status, user, signOut } = useAuth()
  const navigate = useNavigate()

  if (status === 'authenticated') {
    return <Navigate to="/app" replace />
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace />
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1">
            Check your authenticator
          </Typography>
          <Typography color="text.secondary">
            Enter the 6-digit code for {user?.email}.
          </Typography>
          <MfaForm onSuccess={() => navigate('/app')} />
          <Button
            onClick={() => { signOut(); navigate('/login') }}>
            Use a different account
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}