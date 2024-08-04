import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header'; // Assicurati che il percorso sia corretto
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PrivateRoute from './routes/PrivateRoute';
import PostListenVotingPage from './components/PostListenVotingPage';
import VotazionePreAscolto from './components/VotazionePreAscolto';
import ClassifichePage from './components/ClassifichePage';
import ConfirmEmail from './components/ConfirmEmail';
import Footer from './components/Footer';
import { Box } from '@mui/material';
import GlobalStyles from './globalStyles';
// index.js o App.js
import './global.css';
import PasswordReset from './components/PasswordReset';
import PasswordResetRequest from './components/PasswordResetRequest';
import Navbar from './components/Navbar';
import AdminDashboard from './components/adminlayout/AdminDashboard';
import UtentiTable from './components/adminlayout/UtentiTable';
//import { createTheme, ThemeProvider } from '@mui/material/styles';
//import { AlertProvider } from './context/AlertContext';
import CantantiPage from './components/cantanti/CantantiPage';


/*
const theme = createTheme({
  palette: {
    primary: {
      main: 'primary', // Colore primario nero
    },
    // Aggiungi altre personalizzazioni qui...
  },
});
*/

function App() {
  return (
    //<ThemeProvider theme={theme}> 
    <AuthProvider>
            <GlobalStyles /> {/* Inserisci GlobalStyles senza avvolgere gli altri componenti */}
      <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header /> {/* L'Header è posizionato qui, fuori dalle Routes */}
        
        <ConditionalNavbar />
        
        <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />
          <Route path="/admin/dashboard" element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } />
          <Route path="/admin/users" element={
            <PrivateRoute>
              <UtentiTable />
            </PrivateRoute>
          }/>
          <Route path="/cantanti" element={
            <PrivateRoute>
              <CantantiPage />
            </PrivateRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/reset-password-request" element={<PasswordResetRequest />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/postListen" element={
                <PrivateRoute>
                  <PostListenVotingPage />
                </PrivateRoute>
              } />
              <Route path="/votazionePreAscolto" element={
                <PrivateRoute>
                  <VotazionePreAscolto />
                </PrivateRoute>
              } />
              <Route path="/classifiche" element={
                <PrivateRoute>
                  <ClassifichePage />
                </PrivateRoute>
              } />
          {/* Altre rotte */}
        </Routes>
        </Box>
        <Footer /> {/* Aggiungi il Footer qui, così sarà visibile in tutte le pagine */}
        </Box>
      </Router>
    </AuthProvider>
    //</ThemeProvider>
  );
}

function ConditionalNavbar() {
  const { user } = useAuth(); // Usa useAuth per accedere allo stato dell'utente

  // Se l'utente è loggato, mostra la Navbar, altrimenti non renderizzare nulla
  return user ? <Navbar /> : null;
}

export default App;




