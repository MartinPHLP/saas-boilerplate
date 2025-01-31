import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomeView } from "./pages/home/HomeView";
import { LoginView } from "./pages/login/LoginView";
import { RegisterView } from "./pages/RegisterView";
import { DashboardView } from "./pages/dashboard/DashboardView";
import { useAuth } from "./hooks/useAuth";
import { ResetPasswordView } from "./pages/ResetPasswordView";
import { VerifyEmailView } from "./pages/VerifyEmailView";
import { SuccessPage } from "./pages/dashboard/modals/upgrade/pages/SuccessPage";
import { FailurePage } from "./pages/dashboard/modals/upgrade/pages/FailurePage";
import { ThemeProvider } from "styled-components";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const { isAuthenticated, login, register, logout } = useAuth();

  useEffect(() => {
    if (window.location.pathname.startsWith("/reset-password/")) {
      setCurrentView("reset-password");
    } else if (window.location.pathname.startsWith("/verify-email/")) {
      setCurrentView("verify-email");
    } else if (isAuthenticated) {
      setCurrentView("dashboard");
    } else {
      setCurrentView("home");
    }
  }, [isAuthenticated]);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  return (
    <ThemeProvider theme={{}}>
      <Router>
        <div>
          <Routes>
            <Route
              path="/reset-password/:uid/:token"
              element={
                !isAuthenticated && (
                  <ResetPasswordView onNavigate={handleNavigate} />
                )
              }
            />
            <Route
              path="/verify-email/:uid/:token"
              element={<VerifyEmailView />}
            />
            <Route path="/subscription-success" element={<SuccessPage />} />
            <Route path="/subscription-cancel" element={<FailurePage />} />
            <Route
              path="*"
              element={
                <>
                  {currentView === "home" && !isAuthenticated && (
                    <HomeView onNavigate={handleNavigate} />
                  )}
                  {currentView === "login" && !isAuthenticated && (
                    <LoginView onLogin={login} onNavigate={handleNavigate} />
                  )}
                  {currentView === "register" && !isAuthenticated && (
                    <RegisterView
                      onRegister={register}
                      onNavigate={handleNavigate}
                    />
                  )}
                  {isAuthenticated && <DashboardView onLogout={logout} />}
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
