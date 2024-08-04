import React, { useState, useEffect } from 'react';
import CantantiAdminTable from '../adminlayout/CantantiAdminTable.js'; // Componente per gli admin
import CantantiListView from './CantantiListView.js'; // Componente in sola lettura
import {jwtDecode} from 'jwt-decode';

const CantantiPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.roles && decoded.roles.includes('ROLE_ADMIN'));
    }
  }, []);

  // Esempio di chiamata per ottenere i cantanti (da sostituire con la tua logica)
  const [cantanti, setCantanti] = useState([]);
  useEffect(() => {
    const fetchCantanti = async () => {
      let url = '/api/public/cantanti/list'; // Endpoint di default per gli utenti non amministratori
      const token = localStorage.getItem('jwt');
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.roles && decoded.roles.includes('ROLE_ADMIN')) {
          url = '/api/admin/cantanti/list'; // Cambia l'endpoint per gli amministratori
        }
      }
  
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : undefined, // Includi il token solo se presente
          },
        });
        if (!response.ok) {
          throw new Error('Risposta di rete non valida.');
        }
        const data = await response.json();
        setCantanti(data);
      } catch (error) {
        console.error("Errore nel caricamento dei cantanti:", error);
      }
    };
  
    fetchCantanti();
  }, []);
  
  

  return (
    <div>
      {isAdmin ? (
        <CantantiAdminTable cantanti={cantanti} setCantanti={setCantanti} isAdmin={isAdmin} />
      ) : (
        <CantantiListView cantanti={cantanti} />
      )}
    </div>
  );
};

export default CantantiPage;
