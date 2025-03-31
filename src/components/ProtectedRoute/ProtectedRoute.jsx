import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // O desde tu estado global (Redux/Context)

  useEffect(() => {
    if (!token) {
      navigate('/error'); // Redirige si no hay token
    }
  }, [token, navigate]);

  return token ? children : null; // Renderiza children solo si hay token
};

export default ProtectedRoute;