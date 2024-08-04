import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';



const RegisterPage = () => {
  const { register } = useAuth();
  let navigate = useNavigate();
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailRequest, setEmailRequest] = useState('');
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');

  const handleRequestEmailApproval = async (e) => {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess('');

    try {
      // Qui dovrai inserire l'URL effettivo del tuo endpoint API
      const response = await fetch('/api/admin/request-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailRequest }),
      });
      if (response.ok) {
        setRequestSuccess('La tua richiesta di approvazione è stata inviata.');
        setEmailRequest('');
      } else {
        throw new Error('Impossibile inviare la richiesta di approvazione.');
      }
    } catch (error) {
      setRequestError(error.message);
    }
  };

  // Funzione per controllare se l'email è approvata
  const checkEmailApproval = async (email) => {
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data; // Ritorna l'intero oggetto data
    } catch (error) {
      console.error('Errore durante il controllo dell\'email:', error);
      throw new Error('Errore di connessione al server per il controllo dell\'email.');
    }
  };
  

  const checkEmailRegistered = async (email) => {
    try {
      const response = await fetch('/api/auth/check-email-registered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      return data.registered; // Ritorna true se l'email è già registrata, false altrimenti
    } catch (error) {
      console.error('Errore durante il controllo dell\'email:', error);
      setError('Errore di connessione al server.');
      return false; // In caso di errore, procedi con cautela
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
  
    if (password !== confirmPassword) {
      setPasswordError('Le password non corrispondono');
      return;
    }
  
    try {
      const { found, status } = await checkEmailApproval(email);
      if (!found) {
        setError('Email non trovata. Richiedere approvazione');
        return;
      }
      if (status === 'PENDING') {
        setError('La tua email è in stato di approvazione, riprovare più tardi.');
        return;
      } else if (status !== 'APPROVED') {
        setError('Email non approvata per la registrazione.');
        return;
      }
      // Se lo status è APPROVED, procedi con la registrazione
    } catch (approvalError) {
      setError(approvalError.message);
      return;
    }
  
    // Prosegui con il controllo se l'email è già registrata e la successiva logica di registrazione
  

    // Verifica se l'email è approvata
    try {
      const emailApproved = await checkEmailApproval(email);
      if (!emailApproved) {
        setError('Email non approvata per la registrazione.');
        return;
      }
    } catch (approvalError) {
      setError(approvalError.message);
      return;
    }

    // Verifica se l'email è già registrata
      const emailAlreadyRegistered = await checkEmailRegistered(email);
      if (emailAlreadyRegistered) {
        setError('Email già registrata.');
        return; // Interrompi il processo di registrazione se l'email è già utilizzata
      }

    // Procedi con la registrazione se l'email è approvata
    try {
      await register(email, password);
      navigate('/login', { state: { message: "Controlla la tua email per verificare l'account." } });
    } catch (registrationError) {
      console.error('Errore di registrazione:', registrationError);
      setError(registrationError.message || 'Errore di registrazione');
    }
  };
  

  return (
    <>
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 10  }}>
      <Paper sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2,
        mt: 8, borderRadius: 2, boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
      }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Registrati
        </Typography>
        <form noValidate sx={{ width: '100%', mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Nome"
            name="name"
            autoComplete="name"
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Indirizzo Email"
            name="email"
            autoComplete="email"
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
            autoComplete="new-password"
            sx={{ mb: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Conferma Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            sx={{ mb: 2 }}
          />
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {passwordError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{passwordError}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3, mb: 2, bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Registrati
          </Button>
        </form>
      </Paper>
    </Container>
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 10  }}>
    <Paper sx={{ p: 2, mt: 4, borderRadius: 2, boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)' }}>
        <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Richiesta di Approvazione Email
        </Typography>
        <form noValidate sx={{ width: '100%', mt: 1 }} onSubmit={handleRequestEmailApproval}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="emailRequest"
            label="Indirizzo Email per la Richiesta"
            name="emailRequest"
            value={emailRequest}
            onChange={(e) => setEmailRequest(e.target.value)}
            autoComplete="email"
            sx={{ mb: 2 }}
          />
          {requestError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{requestError}</Alert>}
          {requestSuccess && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{requestSuccess}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Invia Richiesta
          </Button>
        </form>
      </Paper>
      </Container>
    </>
  );
};

export default RegisterPage;
