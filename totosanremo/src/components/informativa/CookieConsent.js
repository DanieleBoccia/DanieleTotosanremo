import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Controlla se l'avviso sui cookie è già stato accettato
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true); // Mostra il componente se non è stato ancora accettato
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted'); // Salva l'accettazione nel localStorage
    setIsVisible(false); // Nasconde il messaggio di avviso
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Box sx={{
      position: 'fixed',
      bottom: 0,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      textAlign: 'center',
      padding: '10px',
      zIndex: 1000, // Assicurati che appaia sopra gli altri elementi della pagina
    }}>
      <Typography variant="body1">
        Questo sito utilizza cookie per migliorare l'esperienza utente. Continuando a navigare, accetti l'uso dei cookie.
      </Typography>
      <Button
        onClick={handleAccept}
        sx={{
            mt: 2,
            bgcolor: 'primary.main',
            color: 'white', // Imposta il colore del testo a bianco per contrasto
            '&:hover': {
            bgcolor: 'primary.dark',
            color: 'white' // Assicurati che il testo rimanga bianco anche al passaggio del mouse
            }
        }}
        >
        Accetto
        </Button>
    </Box>
  );
};

export default CookieConsent;
