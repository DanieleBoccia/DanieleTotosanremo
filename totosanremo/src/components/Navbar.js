import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    isAdmin = decoded.roles && decoded.roles.includes('ROLE_ADMIN');
  }

  return (
    <AppBar position="static" sx={{ bgcolor: '#f5f5f5' }}>
      <Toolbar>
        <Button 
          sx={{ color: 'black', marginRight: 2 }} 
          onClick={() => navigate('/')}
        >
          Home
        </Button>
        <Button 
          sx={{ color: 'black', marginRight: 2 }} 
          onClick={() => navigate('/cantanti')}
        >
          Cantanti Sanremo
        </Button>
        <Button 
          sx={{ color: 'black', marginRight: 2 }} 
          onClick={() => navigate('/votazionePreAscolto')}
        >
          Votazione Pre-Ascolto
        </Button>
        <Button 
          sx={{ color: 'black', marginRight: 2 }} 
          onClick={() => navigate('/postListen')}
        >
          Votazione Post-Ascolto
        </Button>
        <Button 
          sx={{ color: 'black', marginRight: 2 }} 
          onClick={() => navigate('/classifiche')}
        >
          Classifiche
        </Button>
        {isAdmin && (
          <Button 
            sx={{ color: 'black' }} 
            onClick={() => navigate('/admin/users')}
          >
            Gestione Utenti
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;