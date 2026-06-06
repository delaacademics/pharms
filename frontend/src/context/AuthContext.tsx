"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

// Intercept all axios requests to rewrite http://localhost:5000 to /api-proxy for public tunnels
axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith("http://localhost:5000")) {
    config.url = config.url.replace("http://localhost:5000", "/api-proxy");
  }
  return config;
});

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    } else if (pathname !== "/login" && pathname !== "/patient/register") {
      router.push("/login");
    }
    setLoading(false);

    // Add global interceptor for 401 and 403 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Token expired or invalid
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
          router.push("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [pathname, router]);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    
    if (newUser.role === "PATIENT") {
      router.push("/patient/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
