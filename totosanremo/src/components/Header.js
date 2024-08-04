import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {jwtDecode} from 'jwt-decode';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState({ email: '', roles: [] });
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decoded = jwtDecode(token);
      setUserInfo({
        email: decoded.sub, // Verifica se il campo 'sub' è utilizzato per l'email o l'ID utente
        roles: decoded.roles ? decoded.roles.map(role => roleMapping(role)) : [] // Applica la mappatura per i ruoli
      });
    }
  }, [user]);

  const roleMapping = (role) => {
    switch(role) {
      case 'ROLE_ADMIN':
        return 'Amministratore';
      case 'ROLE_USER':
        return 'Utente';
      // Aggiungi qui altri casi se necessario
      default:
        return role;
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="logo" onClick={() => navigate('/')}>
            {/* Inserisci il logo qui */}
          </IconButton>
          <Typography variant="h6" onClick={() => navigate('/')}
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
            TOTOSANREMO DEL GRUPPO TELEGRAM "COMMENTIAMO SANREMO"
          </Typography>
        </Box>
        {user && (
          <>
            <Typography sx={{ margin: '0 10px' }}>
              {userInfo.email} - {Array.isArray(userInfo.roles) ? userInfo.roles.join(', ') : ''}
            </Typography>
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar src="/static/images/avatar/2.jpg" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>Profilo</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </>
        )}
        {!user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/register')}>Registrati</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;











