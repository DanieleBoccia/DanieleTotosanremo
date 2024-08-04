import React, { useEffect, useState } from 'react';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Assicura che il percorso sia corretto
import { useSearchParams, useNavigate } from 'react-router-dom';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const { resetPassword, validateResetToken } = useAuth(); // Aggiungi validateResetToken al tuo AuthContext

  // Inizializza useNavigate
  const navigate = useNavigate();
  const [resetSuccessful, setResetSuccessful] = useState(false);

  useEffect(() => {
    // Se il reset è già stato confermato con successo, evita la validazione del token
    if (resetSuccessful) {
      return;
    }
  
    const validateToken = async () => {
      if (!token) {
        setError('Token non fornito.');
        return;
      }
      setLoading(true);
      try {
        const isValid = await validateResetToken(token);
        if (isValid) {
          setTokenValidated(true);
          setMessage('Inserisci la tua nuova password.');
        } else {
          setError('Token non valido o scaduto.');
        }
      } catch (err) {
        setError('Errore durante la verifica del token.');
      } finally {
        setLoading(false);
      }
    };
  
    validateToken();
  }, [token, validateResetToken, resetSuccessful]); // Aggiungi resetSuccessful come dipendenza
  

  const isPasswordValid = () => {
    // Regole di validazione
    return password.length > 7 && password === confirmPassword;
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid()) {
      setError('La password non soddisfa i criteri di sicurezza o non corrisponde alla conferma.');
      return;
    }
    setLoading(true);
    setError(''); // Assicurati di resettare gli errori precedenti
    setMessage(''); // Pulisci anche i messaggi precedenti per buona misura
    try {
      await resetPassword(token, password);
      setResetSuccessful(true); // Indica che il reset è avvenuto con successo
      setMessage('La tua password è stata reimpostata con successo. Verrai reindirizzato alla pagina di login.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      if (!resetSuccessful) { // Mostra l'errore solo se il reset non è già avvenuto con successo
        setError('Errore nella reimpostazione della password.');
      }
    } finally {
      setLoading(false);
    }
};

  // Se il token non è stato ancora verificato, mostra un messaggio o un loader
  if (!tokenValidated) {
    return loading ? <CircularProgress /> : <Alert severity="error">{error}</Alert>;
  }

  return (
    <div>
      <h2>Reimposta Password</h2>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nuova Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Conferma Nuova Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Reimposta Password'}
        </Button>
      </form>
    </div>
  );
};

export default PasswordReset;


