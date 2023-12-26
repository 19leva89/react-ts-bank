import { FC, useContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContext, AuthProvider } from "./utils/AuthProvider";

import { BalancePage } from "./component/balance-page";
import { LoginPage } from "./component/login-page";
import { NotificationsPage } from "./component/notifications-page";
import { RecivePage } from "./component/recive-page";
import { RecoveryConfirmPage } from "./component/recovery-confirm-page";
import { RecoveryPage } from "./component/recovery-page";
import { RegisterConfirmPage } from "./component/register-confirm-page";
import { RegisterPage } from "./component/register-page";
import { SendPage } from "./component/send-page";
import { SettingsPage } from "./component/settings-page";
import { TransactionPage } from "./component/transaction-page";
import { WelcomePage } from "./component/welcome-page";
import { Error } from "./component/error";

const AuthRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.authState || !authContext.authState.token) {
    return <BalancePage />;
  }

  return authContext.authState.token ? <>{children}</> : <LoginPage />;
};

const PrivateRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.authState) {
    return <WelcomePage />;
  }

  return authContext.authState.token ? <>{children}</> : <LoginPage />;
};

function App() {
  const [isLogged, login] = useState(false);

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
          <Route path="*" Component={Error} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
