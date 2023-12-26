import { createContext, useReducer, ReactNode, Dispatch, FC } from "react";

interface AuthState {
  token: string | null;
  user: any;
}

interface AuthContextProps {
  authState: AuthState;
  isLogged: boolean;
  login: (token: string, user: any) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
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

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch]: [AuthState, Dispatch<AuthAction>] = useReducer(
    authReducer,
    initialState
  );

  const isLogged = !!authState.token;

  const login = (token: string, user: any) => {
    dispatch({ type: "LOGIN", payload: { token, user } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const authContextData: AuthContextProps = {
    authState,
    isLogged,
    login,
    logout,
  };

  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};
