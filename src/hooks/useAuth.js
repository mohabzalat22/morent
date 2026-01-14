import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_API_PATH}/user`, {
        validateStatus: (status) => status === 200 || status === 401,
      });

      if (response.status === 401) {
        localStorage.setItem("auth", "false");
        setIsAuthenticated(false);
        setUser(null);
      } else {
        localStorage.setItem("auth", "true");
        setIsAuthenticated(true);
        setUser(response.data);
      }
    } catch (error) {
      localStorage.setItem("auth", "false");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      try {
        const userCheck = await api.get(
          `${import.meta.env.VITE_API_PATH}/user`,
          {
            validateStatus: (status) => status === 200 || status === 401,
          }
        );

        if (userCheck.status === 401) {
          const res = await api.post(`${import.meta.env.VITE_API_PATH}/login`, {
            email,
            password,
          });
          if (res.status === 200) {
            localStorage.setItem("auth", "true");
            setIsAuthenticated(true);
            navigate("/profile");
            return { success: true };
          }
        } else {
          navigate("/profile");
          return { success: true, message: "Already authenticated" };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [navigate]
  );

  const register = useCallback(
    async (name, email, password) => {
      try {
        await api.post(`${import.meta.env.VITE_API_PATH}/register`, {
          name,
          email,
          password,
        });
        navigate("/profile");
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await api.post(`${import.meta.env.VITE_API_PATH}/logout`);
      localStorage.setItem("auth", "false");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    loading,
    user,
    login,
    register,
    logout,
    checkAuth,
  };
}

export default useAuth;
