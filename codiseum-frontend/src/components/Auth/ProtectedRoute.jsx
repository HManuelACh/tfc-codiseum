import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../api/AuthService';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isLoggedIn = await AuthService.isLogged();
        if (!isLoggedIn) {
          setLoading(false);
          setIsAllowed(false);
          return;
        }

        if (!allowedRoles || allowedRoles.length === 0) {
          setLoading(false);
          setIsAllowed(true);
          return;
        }

        const isAdmin = await AuthService.isAdmin();
        if (isAdmin || allowedRoles.includes('ROLE_USER')) {
          setLoading(false);
          setIsAllowed(true);
        } else {
          setLoading(false);
          setIsAllowed(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setLoading(false);
        setIsAllowed(false);
      }
    };

    checkAuthStatus();
  }, [allowedRoles]);

  if (loading) return <div>Cargando...</div>;

  return isAllowed ? children : <Navigate to="/info" replace />;
};

export default ProtectedRoute;