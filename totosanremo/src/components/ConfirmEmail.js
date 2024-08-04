import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmEmail = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
  
      if (token) {
        try {
          const response = await fetch(`/api/auth/confirm?token=${token}`);
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || "An error occurred while verifying your account.");
          }
          
          navigate('/login', { state: { message: "Your account has been verified. Please log in." } });
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError("No token provided.");
        setLoading(false);
      }
    };
  
    verifyEmail();
  }, [location.search, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error ? <p>Error: {error}</p> : <p>Your account has been successfully verified.</p>}
    </div>
  );
};

export default ConfirmEmail;
