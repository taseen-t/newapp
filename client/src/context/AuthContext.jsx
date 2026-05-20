import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!localStorage.getItem('medstudy_token')) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      localStorage.removeItem('medstudy_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (emailOrUsername, password) => {
    const { token, user } = await api.login({ emailOrUsername, password });
    localStorage.setItem('medstudy_token', token);
    setUser(user);
  };

  const register = async (username, email, password) => {
    const { token, user } = await api.register({ username, email, password });
    localStorage.setItem('medstudy_token', token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('medstudy_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
