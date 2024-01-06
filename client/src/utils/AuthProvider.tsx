import { FC, useReducer, ReactNode, createContext } from "react";

import { AUTH_ACTION_TYPE, AuthState, authInitialState, authReducer } from "./authReducer";
import { getTokenSession } from "../script/session";

interface AuthContextType {
  authState: AuthState;
  isLogged: boolean;
  login: (token: string, user: string) => void;
  logout: () => void;
  dataUpdate: (updatedToken: string, updatedUser: string) => void;
  recovery: (updatedToken: string, updatedUser: string) => void;
  changePassword: (updatedToken: string, updatedUser: string) => void;
  changeEmail: (updatedToken: string, updatedUser: string) => void;
  loadNotification: () => Promise<void>;
  receive: (updatedBalance: number) => void;
  send: (updatedBalance: number) => void;
  loadBalance: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  authState: authInitialState,
  isLogged: false,
  login: () => {},
  logout: () => {},
  dataUpdate: () => {},
  recovery: () => {},
  changePassword: () => {},
  changeEmail: () => {},
  loadNotification: () => Promise.resolve(),
  receive: () => {},
  send: () => {},
  loadBalance: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, authInitialState);

  const isLogged = !!authState.token;

  const login = (token: string, user: string) => {
    // console.log("authState.user", authState.user);

    dispatch({ type: AUTH_ACTION_TYPE.LOGIN, payload: { token, user } });

    addNotification(AUTH_ACTION_TYPE.LOGIN, Date.now(), "Warning");
  };

  const logout = () => {
    dispatch({ type: AUTH_ACTION_TYPE.LOGOUT });
    addNotification(AUTH_ACTION_TYPE.LOGOUT, Date.now(), "Warning");
  };

  const dataUpdate = (updatedToken: string, updatedUser: string) => {
    dispatch({
      type: AUTH_ACTION_TYPE.LOGIN,
      payload: { token: updatedToken, user: updatedUser },
    });

    addNotification(AUTH_ACTION_TYPE.DATA_UPDATE, Date.now(), "Announcement");
  };

  const recovery = (updatedToken: string, updatedUser: string) => {
    dispatch({
      type: AUTH_ACTION_TYPE.LOGIN,
      payload: { token: updatedToken, user: updatedUser },
    });

    addNotification(AUTH_ACTION_TYPE.RECOVERY, Date.now(), "Warning");
  };

  const changePassword = (updatedToken: string, updatedUser: string) => {
    dispatch({
      type: AUTH_ACTION_TYPE.LOGIN,
      payload: { token: updatedToken, user: updatedUser },
    });

    addNotification(AUTH_ACTION_TYPE.CHANGE_PASSWORD, Date.now(), "Warning");
  };

  const changeEmail = (updatedToken: string, updatedUser: string) => {
    dispatch({
      type: AUTH_ACTION_TYPE.LOGIN,
      payload: { token: updatedToken, user: updatedUser },
    });

    addNotification(AUTH_ACTION_TYPE.CHANGE_EMAIL, Date.now(), "Warning");
  };

  const addNotification = async (eventTitle: string, eventTime: number, eventType: string) => {
    try {
      if (!eventTitle || !eventTime || !eventType) {
        console.error("Required fields are missing");
        return;
      }

      const token = getTokenSession(); // Отримання токену сесії

      if (!token) {
        console.error("Session token not found");
        return;
      }

      const res = await fetch("http://localhost:4000/user-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ eventTitle, eventTime, eventType }),
      });

      const data = await res.json();
      // console.log("Data from server addNotification:", data);

      if (res.ok) {
        dispatch({
          type: AUTH_ACTION_TYPE.ADD_NOTIFICATION,
          payload: { eventTitle, eventTime, eventType },
        });
      } else {
        if (data && data.message) {
          console.error("Server error:", data.message);
        } else {
          console.error("Server error:", res.statusText);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const loadNotification = async () => {
    try {
      const token = getTokenSession();

      if (!token) {
        console.error("Session token not found");
        return;
      }

      const res = await fetch("http://localhost:4000/user-notifications", {
        headers: {
          Authorization: token, // Додавання токену до заголовків
        },
      });

      if (res.ok) {
        const data = await res.json();

        dispatch({
          type: AUTH_ACTION_TYPE.UPD_NOTIFICATION,
          payload: { notifications: data.notifications },
        });
      } else {
        throw new Error("Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const receive = (updatedBalance: number) => {
    dispatch({
      type: AUTH_ACTION_TYPE.RECEIVE,
      payload: { balance: updatedBalance },
    });

    addNotification(AUTH_ACTION_TYPE.RECEIVE, Date.now(), "Announcement");
  };

  const send = (updatedBalance: number) => {
    dispatch({
      type: AUTH_ACTION_TYPE.SEND,
      payload: { balance: updatedBalance },
    });

    addNotification(AUTH_ACTION_TYPE.SEND, Date.now(), "Announcement");
  };

  const loadBalance = async () => {
    try {
      const token = getTokenSession();

      if (!token) {
        console.error("Session token not found");
        return;
      }

      const res = await fetch("http://localhost:4000/user-balance", {
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        const data = await res.json();

        if (data && data.userBalance !== undefined) {
          dispatch({ type: AUTH_ACTION_TYPE.RECEIVE, payload: { balance: data.userBalance } });
        } else {
          throw new Error("Invalid balance data received");
        }
      } else if (res.status === 401) {
        console.error("Invalid token or unauthorized access");
        // Обробка помилки - неправильний токен або неавторизований доступ
        return;
      } else if (res.status === 404) {
        console.error("User not found");
        // Обробка помилки - користувач не знайдений
        return;
      } else {
        throw new Error("Failed to fetch balance");
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
      // Обробка інших помилок, які можуть виникнути під час завантаження балансу
      return;
    }
  };

  const authContextData: AuthContextType = {
    authState,
    isLogged,
    login,
    logout,
    dataUpdate,
    recovery,
    changePassword,
    changeEmail,
    loadNotification,
    receive,
    send,
    loadBalance,
  };

  // console.log(authState, isLogged);

  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};
// console.log(AuthProvider);
