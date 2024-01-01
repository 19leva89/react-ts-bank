import { FC, useReducer, ReactNode, Dispatch } from "react";
import { AuthContext, AuthContextProps, AuthState } from "./AuthContext";
import { authReducer } from "./AuthReducer";

interface AuthProviderProps {
  children: ReactNode;
}

export type AuthAction =
  | { type: "LOGIN"; payload: { token: string; user: string } }
  | { type: "LOGOUT"; payload?: undefined }
  | { type: "SET_EVENT"; payload: { eventType: string; time: string } }
  | { type: "ADD_NOTIFICATION"; payload: { eventType: string; time: number } }
  | { type: "UPDATE_NOTIFICATIONS"; payload: { eventType: string; time: number } };

const storedSessionAuth = localStorage.getItem("sessionAuth");
const parsedSessionAuth = storedSessionAuth !== null ? JSON.parse(storedSessionAuth) : null;
const storedToken = parsedSessionAuth?.token || null;
const storedUser = parsedSessionAuth?.user || null;

const initialState: AuthState = {
  token: storedToken,
  user: storedUser,
  notifications: [],
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch]: [AuthState, Dispatch<AuthAction>] = useReducer(
    authReducer,
    initialState
  );

  const isLogged = !!authState.token;

  const getFormattedTime = (): string => {
    return new Date().toLocaleString();
  };

  const addEvent = (eventType: string, time: string) => {
    dispatch({ type: "SET_EVENT", payload: { eventType, time } });
  };

  const authContextData: AuthContextProps = {
    authState,
    isLogged,
    login: (token: string, user: string) => {
      dispatch({ type: "LOGIN", payload: { token, user } });

      const loginTime = getFormattedTime();
      // console.log("Login Time:", loginTime);
      addEvent("LOGIN", loginTime);
    },
    logout: () => {
      dispatch({ type: "LOGOUT" });

      const logoutTime = getFormattedTime();
      // console.log("Logout Time:", logoutTime);
      addEvent("LOGOUT", logoutTime);
    },
    update: (updatedToken: string, updatedUser: string) => {
      dispatch({ type: "LOGIN", payload: { token: updatedToken, user: updatedUser } });
    },
    addEvent,
  };

  console.log(authState, isLogged);

  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};
// console.log(AuthProvider);
