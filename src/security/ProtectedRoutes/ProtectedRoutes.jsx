import  { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth/AuthContext';

const ProtectedRoute = ({ allowedRoles=[], children, redirectTo = '/login' }) => {
    const { user,logout } = useAuth()
    console.log(user)
  
  if (!allowedRoles.includes(user?.role)) {
    // Puedes personalizar a dónde redirigir si no tiene permiso
    return <Navigate to={redirectTo} replace />;
  }

  if (!user) return <Navigate to={redirectTo} replace />
  return (
    <>
      {children} {/* Renderiza los hijos si hay un token */}
    </>
  );
};

export default ProtectedRoute;