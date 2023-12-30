import { createContext, useReducer, ReactNode, Dispatch, FC } from "react";

interface AuthState {
  token: string | null;
  user: string | null;
}

interface AuthContextProps {
  authState: AuthState;
  isLogged: boolean;
  login: (token: string, user: string) => void;
  logout: () => void;
  update: (updatedToken: string, updatedUser: string) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

type AuthAction = { type: "LOGIN"; payload: { token: string; user: string } } | { type: "LOGOUT" };

const storedSessionAuth = localStorage.getItem("sessionAuth");
const parsedSessionAuth = storedSessionAuth !== null ? JSON.parse(storedSessionAuth) : null;
const storedToken = parsedSessionAuth?.token || null;
const storedUser = parsedSessionAuth?.user || null;

// console.log(storedToken);
// console.log(storedUser);

const initialState: AuthState = {
  token: storedToken,
  user: storedUser,
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

export const AuthContext = createContext<AuthContextProps>({
  authState: { token: null, user: null },
  isLogged: false,
  login: () => {},
  logout: () => {},
  update: () => {},
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch]: [AuthState, Dispatch<AuthAction>] = useReducer(
    authReducer,
    initialState
  );

  const isLogged = !!authState.token;

  const update = (updatedToken: string, updatedUser: string) => {
    dispatch({ type: "LOGIN", payload: { token: updatedToken, user: updatedUser } });
  };

  const login = (token: string, user: string) => {
    dispatch({ type: "LOGIN", payload: { token, user } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  console.log(authState, isLogged);

  const authContextData: AuthContextProps = {
    authState,
    isLogged,
    login,
    logout,
    update,
  };

  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};
// console.log(AuthProvider);
