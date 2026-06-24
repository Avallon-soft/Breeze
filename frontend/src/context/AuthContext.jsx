"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "@/utils/api";
import userService from "@/core/services/me.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);          // ← nouveau
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage : si un token existe, on restaure l'utilisateur
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setAccessToken(token);
      userService
        .getProfile()
        .then((result) => {
          if (result) setUser(result);
        })
        .catch(() => {
          // Token expiré ou invalide → on nettoie
          localStorage.removeItem("accessToken");
          setAccessToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
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

      // On récupère l'utilisateur juste après le login
      const result = await userService.getProfile();
      if (result?.data?.profile) setUser(result.data.profile);

      return true;
    } catch (err) {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);          // ← reset
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,                             // ← exposé : { id, username }
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