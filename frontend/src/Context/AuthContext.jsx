import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const register = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find((u) => u.email === email);
    if (exists) {
      return { success: false, message: "Usuario ya existe" };
    }

    const newUser = { email, password };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    

    return { success: true };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      return { success: false, message: "Credenciales incorrectas" };
    }

    localStorage.setItem("currentUser", JSON.stringify(found));
    setUser(found);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
