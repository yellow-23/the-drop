import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (data) => {
    const updateUser = await authService.updateProfile(data);
    setUser(updateUser);
    // Force localStorage update para sincronización inmediata
    localStorage.setItem('user', JSON.stringify(updateUser));
  };

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      const userData = data.user || data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching profile:', error);
      const cachedUser = authService.getCurrentUser();
      if (cachedUser) {
        setUser(cachedUser);
      } else {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const cachedUser = authService.getCurrentUser();
    
    if (token && cachedUser) {
      setUser(cachedUser);
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: authService.isAuthenticated,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

