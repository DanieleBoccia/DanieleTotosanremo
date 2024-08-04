import React, { useState, useEffect } from 'react';
import UtentiTable from './UtentiTable';
import CantantiAdminTable from './CantantiAdminTable';

const AdminDashboard = () => {
  
  const [cantanti, setCantanti] = useState([]);
  const isAdmin = true;


  useEffect(() => {
    const fetchCantanti = async () => {
      try {
        const response = await fetch('/api/admin/cantanti');
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
      <h2>Dashboard Admin</h2>
      <UtentiTable />
      <CantantiAdminTable cantanti={cantanti} isAdmin={isAdmin} />
    </div>
  );
};

export default AdminDashboard;
