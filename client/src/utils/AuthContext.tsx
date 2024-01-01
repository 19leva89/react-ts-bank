import { createContext } from "react";

export interface AuthState {
  token: string | null;
  user: string | null;
  notifications: { eventType: string; time: number }[];
}

export interface AuthContextProps {
  authState: AuthState;
  isLogged: boolean;
  login: (token: string, user: string) => void;
  logout: () => void;
  update: (updatedToken: string, updatedUser: string) => void;
  addEvent: (eventType: string, time: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  authState: {
    token: null,
    user: null,
    notifications: [],
  },
  isLogged: false,
  login: () => {},
  logout: () => {},
  update: () => {},
  addEvent: () => {},
});
