import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../core/services/authService';

export const useAuth = () => {
  const navigate = useNavigate();

  const isAuthenticated = (): boolean => {
    const token = authService.getToken();
    return !!token;
  };

  const checkAuth = () => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  };

  const logout = () => {
    authService.logout();
    navigate('/auth/login', { replace: true });
  };

  return {
    isAuthenticated,
    checkAuth,
    logout
  };
}; 