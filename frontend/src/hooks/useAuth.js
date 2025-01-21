import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../config";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = Cookies.get("access_token");
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getAuthHeaders = () => {
    const token = Cookies.get("access_token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error:", errorData);
      }

      if (response.ok) {
        const data = await response.json();
        Cookies.set("access_token", data.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return false;
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          email: email,
          password: password,
          password2: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Register error:", errorData);
        return {
          success: false,
          message: errorData.error || "Registration failed",
        };
      }

      const data = await response.json();
      return {
        success: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      };
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  };

  const logout = () => {
    Cookies.remove("access_token");
    checkAuth();
  };

  return { isAuthenticated, login, logout, register };
}
