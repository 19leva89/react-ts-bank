import { FC, ReactNode, useContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContext, AuthProvider } from "./utils/AuthProvider";

import WelcomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import RegisterConfirmPage from "./pages/RegisterConfirm";
import RecoveryPage from "./pages/Recovery";
import RecoveryConfirmPage from "./pages/RecoveryConfirm";
import BalancePage from "./pages/Balance";
import SettingsPage from "./pages/Settings";
import NotificationsPage from "./pages/Notifications";
import RecivePage from "./pages/Recive";
import SendPage from "./pages/Send";
import TransactionPage from "./pages/Transaction";
import NotFound from "./pages/NotFound";

const AuthRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  // Перевіряємо, чи є токен у контексті аутентифікації
  if (authContext && authContext.authState && authContext.authState.token) {
    // Якщо токен є, перенаправляємо на сторінку балансу
    return <BalancePage />;
  }

  // Якщо токен відсутній, відображаємо передані дочірні компоненти
  return <>{children}</>;
};

const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.isLogged) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              <AuthRoute>
                <WelcomePage />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <RegisterPage />
              </AuthRoute>
            }
          />
          <Route
            path="/register-confirm"
            element={
              <PrivateRoute>
                <RegisterConfirmPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/recovery"
            element={
              <AuthRoute>
                <RecoveryPage />
              </AuthRoute>
            }
          />
          <Route
            path="/recovery-confirm"
            element={
              <AuthRoute>
                <RecoveryConfirmPage />
              </AuthRoute>
            }
          />
          <Route
            path="/balance"
            element={
              <PrivateRoute>
                <BalancePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <NotificationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/recive"
            element={
              <PrivateRoute>
                <RecivePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/send"
            element={
              <PrivateRoute>
                <SendPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/transaction/:transactionId"
            element={
              <PrivateRoute>
                <TransactionPage />
              </PrivateRoute>
            }
          />
          <Route path="*" Component={NotFound} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
