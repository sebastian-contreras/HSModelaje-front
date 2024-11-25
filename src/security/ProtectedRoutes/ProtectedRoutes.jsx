import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Si no hay token, redirige al login
    if (!token) {
      navigate('/login'); // Cambia '/login' a la ruta de tu página de inicio de sesión
    }
  }, [navigate]);

  return (
    <>
      {children} {/* Renderiza los hijos si hay un token */}
    </>
  );
};

export default ProtectedRoute;