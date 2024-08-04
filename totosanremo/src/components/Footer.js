import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ 
      width: '100%', // Assicura che il footer si estenda per tutta la larghezza
      height: '60px', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginTop: 'auto', 
      backgroundColor: 'primary.main', 
      color: 'white',
      boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
      padding: '20px 0',
      position: 'relative', // Modificabile in 'fixed' se desideri che sia sempre visibile
      bottom: 0, // Utile se scegli 'fixed' come posizione
    }}>
      <Typography variant="body1"
      /*
      sx={{
        cursor: 'pointer',
        background: 'linear-gradient(45deg, #00c6ff 30%, #0072ff 50%, #ff77ab 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        MozBackgroundClip: 'text',
        MozTextFillColor: 'transparent',
        display: 'inline', // Assicurati che il Typography sia impostato su inline per applicare correttamente il gradiente
      }}
      */
      >
        &copy; {new Date().getFullYear()} Totosanremo. Tutti i diritti riservati.
      </Typography>
    </Box>
  );
};

export default Footer;

