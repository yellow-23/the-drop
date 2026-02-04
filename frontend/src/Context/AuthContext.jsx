import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { normalizeUserUrls } from "../utils/imageUrlHelper";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    const normalizedUser = normalizeUserUrls(data.user);
    setUser(normalizedUser);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    const normalizedUser = normalizeUserUrls(data.user);
    setUser(normalizedUser);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (data) => {
    const updateUser = await authService.updateProfile(data);
    const normalizedUser = normalizeUserUrls(updateUser);
    setUser(normalizedUser);
    // Force localStorage update para sincronización inmediata
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      const userData = data.user || data;
      const normalizedUser = normalizeUserUrls(userData);
      setUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    } catch (error) {
      console.error('Error fetching profile:', error);
      const cachedUser = authService.getCurrentUser();
      if (cachedUser) {
        const normalizedUser = normalizeUserUrls(cachedUser);
        setUser(normalizedUser);
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
      const normalizedUser = normalizeUserUrls(cachedUser);
      setUser(normalizedUser);
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

