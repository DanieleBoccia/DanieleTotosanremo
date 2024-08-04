import React, { createContext, useContext, useState, useEffect } from 'react';
import ConfirmEmail from '../components/ConfirmEmail';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [successMessage, setSuccessMessage] = useState(null);


  useEffect(() => {
    const verifyTokenAndSetUser = async () => {
        setIsLoading(true); // Inizia a verificare lo stato di autenticazione
        const token = localStorage.getItem('jwt');
        if (!token) {
          setUser(null);
          setIsLoading(false); // Completa la verifica dello stato di autenticazione
          return;
        }
        
        try {
          const response = await fetch('/api/auth/verifyToken', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
      
          if (!response.ok) throw new Error("Token verification failed");
      
          const userData = await response.json();
          setUser(userData); // Imposta i dati utente recuperati dalla verifica del token
        } catch (error) {
          console.error("Errore nella verifica del token", error);
          setUser(null);
        } finally {
          setIsLoading(false); // Completa la verifica dello stato di autenticazione
        }
      };
      
    verifyTokenAndSetUser();
  }, []);
  
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Qui potresti voler validare il token con una richiesta al backend
      setUser({ token });
    }
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        try {
            // Tenta di analizzare la risposta come JSON
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('jwt', data.jwt); // Salva il token JWT
                setUser({ ...data, email }); // Salva i dati dell'utente nello stato
                return true;
            } else {
                // Gestisci errori specifici in base al messaggio di errore JSON
                const errorMessage = data.message || "Errore durante il login. Riprova più tardi.";
                throw new Error(errorMessage);
            }
        } catch (jsonError) {
            // Gestisci il caso in cui il corpo della risposta non è JSON valido
            if (!response.ok) {
                // Se la risposta è un errore ma non è in formato JSON, usa un messaggio di errore generico
                throw new Error("Credenziali non valide o problema di connessione.");
            }
            throw jsonError; // Rilancia l'errore di parsing JSON se la risposta era OK
        }
    } catch (error) {
        console.error("Errore di login:", error);
        setError(error.toString()); // Imposta il messaggio di errore per mostrarlo nell'UI
        return false;
    }
};



  
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt'); // Rimuove il token dal localStorage
    setSuccessMessage(null);
    setError(null);
  };


  const register = async (email, password) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setSuccessMessage("Registration successful! Please check your email to confirm.");
        // Qui puoi decidere se reindirizzare l'utente o mantenere sulla stessa pagina
      } else {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.toString());
    }
  };

  const requestPasswordReset = async (email) => {
    try {
        const response = await fetch('/api/auth/request-reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (response.ok) {
            setSuccessMessage(data.message || 'Check your email for reset password instructions.');
        } else {
            throw new Error(data.message || 'Failed to request password reset.');
        }
    } catch (error) {
        console.error("Request password reset error:", error);
        setError(error.toString());
    }
};

const resetPassword = async (token, newPassword) => {
    try {
        // Aggiungi il token come parametro della query
        const url = `https://localhost:8443/api/auth/reset-password?token=${encodeURIComponent(token)}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Invia solo newPassword nel corpo della richiesta
            body: JSON.stringify({ newPassword }),
        });
        const data = await response.json();
        if (response.ok) {
            setSuccessMessage(data.message || 'Your password has been reset successfully.');
        } else {
            throw new Error(data.message || 'Failed to reset password.');
        }
    } catch (error) {
        console.error("Reset password error:", error);
        setError(error.toString());
    }
};

const validateResetToken = async (token) => {
    const response = await fetch(`https://localhost:8443/api/auth/validate-reset-password-token?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Token validation failed');
    return true; // o analizza la risposta se necessario
  };


  // Potresti voler aggiungere altre funzioni qui, come confirmEmail()

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, requestPasswordReset, resetPassword, validateResetToken, ConfirmEmail, error, successMessage }}>
      {children}
    </AuthContext.Provider>
  );
};
