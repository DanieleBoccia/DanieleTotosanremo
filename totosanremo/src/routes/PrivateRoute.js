import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';


const PrivateRoute = ({ children, requiredRoles }) => {
  const { user } = useAuth();
  let userRoles = [];

  if (user) {
    // Assumendo che il token sia salvato in localStorage sotto 'jwt'
    const token = localStorage.getItem('jwt');
    if (token) {
        const decoded = jwtDecode(token);
      userRoles = decoded.roles || [];
    }
  }

  const hasRequiredRole = requiredRoles
    ? requiredRoles.some(role => userRoles.includes(role))
    : true; // Se non ci sono 'requiredRoles', permetti l'accesso

  return user && hasRequiredRole ? children : <Navigate to="/login" />;
};

export default PrivateRoute;


