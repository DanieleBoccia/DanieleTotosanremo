import React, { useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Assumendo che useAuth esponga una funzione per iniziare il reset

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { requestPasswordReset } = useAuth(); // Assumendo che questa funzione sia implementata nel tuo AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await requestPasswordReset(email);
      setMessage('Controlla la tua email per le istruzioni di reset della password.');
    } catch (err) {
      setError('Impossibile inviare la richiesta di reset password.');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Invia Richiesta</Button>
      </form>
    </div>
  );
};

export default PasswordResetRequest;
