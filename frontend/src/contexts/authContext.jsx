// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
} from "../services/authServices.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true); // importante!

  useEffect(() => {
    async function checkSession() {
      try {
        const dados = await getMe();
        setUser(dados.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  async function login(data) {
    try {
      const dados = await loginUser(data);
      setUser(dados.user);
    } catch (error) {
      throw error;
    }
  }

  async function userRegister(data) {
    try {
      await registerUser(data);
    } catch (error) {
      console.error("Erro AuthContext - ", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Erro AuthContext - ", error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, userRegister, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
