import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

interface AuthState {
  token: string | null;
  user: any; // Замість 'any' можна використовувати тип користувача
}

interface AuthContextProps {
  authState: AuthState;
  login: (token: string, user: any) => void;
  logout: () => void;
}

type AuthAction = { type: "LOGIN"; payload: { token: string; user: any } } | { type: "LOGOUT" };

const initialState: AuthState = {
  token: null,
  user: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch]: [AuthState, Dispatch<AuthAction>] = useReducer(
    authReducer,
    initialState
  );

  const login = (token: string, user: any) => {
    dispatch({ type: "LOGIN", payload: { token, user } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const authContextData: AuthContextProps = {
    authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};
