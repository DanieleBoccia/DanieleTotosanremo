import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Paper, Alert, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, isLoading, login, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) navigate('/'); // Reindirizza se non in caricamento e l'utente è loggato
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <CircularProgress />; // o qualsiasi altro indicatore di caricamento preferisci
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/'); // Naviga verso la home o una dashboard dopo il login riuscito
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, mt: 8, borderRadius: 2, boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Accedi
        </Typography>
        <form noValidate sx={{ width: '100%', mt: 1 }} onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Indirizzo Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
            >
              Accedi
            </Button>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Hai dimenticato la password?
              <Link component="button" variant="body2" onClick={() => navigate('/reset-password-request')} sx={{ textTransform: 'none' }}>
                Clicca qui per reimpostarla
              </Link>
            </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;




