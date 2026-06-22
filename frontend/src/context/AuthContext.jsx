"use client";

import { createContext, useContext, useEffect, useState } from "react";
// import { loginUser } from "@/utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setAccessToken(token);
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);

      const data = await loginUser(username, password);

      if (!data?.token) {
        setError("Token invalide.");
        return false;
      }

      localStorage.setItem("accessToken", data.token);
      setAccessToken(data.token);

      return true;
    } catch (err) {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        isAuthenticated: !!accessToken,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);