// Navigation-only signup — we don't add anyone to mockUsers.

import { useState } from 'react'
import { Button, Container, Paper, Snackbar, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { SignupForm } from '../components/SignupForm'

export function SignupPage() {
  const navigate = useNavigate()
  const [showNotice, setShowNotice] = useState(false)

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}
    >
      <Paper sx={{ p: 4, width: '100%' }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1">
            Create an account
          </Typography>
          <SignupForm
            onSubmit={() => {
              setShowNotice(true)
            }}
          />
          <Button component={RouterLink} to="/login">
            Back to sign in
          </Button>
        </Stack>
      </Paper>
      <Snackbar
        open={showNotice}
        autoHideDuration={2000}
        message="Account creation isn't enabled in this demo"
        onClose={() => {
          setShowNotice(false)
          navigate('/login')
        }}
      />
    </Container>
  )
}