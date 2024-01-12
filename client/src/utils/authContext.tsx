import { useReducer, createContext } from "react";

import { BASE_URL } from "./helper";
import { AUTH_ACTION_TYPE, AuthState, authInitialState, authReducer } from "./authReducer";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "./requestReducer";
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
  receive: (updatedBalance: number) => void;
  send: (updatedBalance: number) => void;
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
  receive: () => {},
  send: () => {},
});

export const useAuthContext = () => {
  const [authState, dispatchAuth] = useReducer(authReducer, authInitialState);

  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);

  const isLogged = !!authState.token;

  const login = (token: string, user: string) => {
    // console.log("authState.user", authState.user);

    dispatchAuth({ type: AUTH_ACTION_TYPE.LOGIN, payload: { token, user } });

    addNotification(AUTH_ACTION_TYPE.LOGIN, Date.now(), "Warning");
  };

  const logout = () => {
    dispatchAuth({ type: AUTH_ACTION_TYPE.LOGOUT });
    addNotification(AUTH_ACTION_TYPE.LOGOUT, Date.now(), "Warning");
  };

  const dataUpdate = (updatedToken: string, updatedUser: string) => {
    dispatchAuth({
      type: AUTH_ACTION_TYPE.LOGIN,
      payload: { token: updatedToken, user: updatedUser },
    });

    addNotification(AUTH_ACTION_TYPE.DATA_UPDATE, Date.now(), "Announcement");
  };

  const recovery = (updatedToken: string, updatedUser: string) => {
    dispatchAuth({
      type: AUTH_ACTION_TYPE.LOGIN,
      payload: { token: updatedToken, user: updatedUser },
    });

    addNotification(AUTH_ACTION_TYPE.RECOVERY, Date.now(), "Warning");
  };

  const changePassword = (updatedToken: string, updatedUser: string) => {
    dispatchAuth({
      type: AUTH_ACTION_TYPE.LOGIN,
      payload: { token: updatedToken, user: updatedUser },
    });

    addNotification(AUTH_ACTION_TYPE.CHANGE_PASSWORD, Date.now(), "Warning");
  };

  const changeEmail = (updatedToken: string, updatedUser: string) => {
    dispatchAuth({
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

      const res = await fetch(`${BASE_URL}/user-notifications`, {
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
        dispatchAuth({
          type: AUTH_ACTION_TYPE.ADD_NOTIFICATION,
          payload: { eventTitle, eventTime, eventType },
        });

        dispatchRequest({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: data.message,
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

  const receive = (updatedBalance: number) => {
    dispatchAuth({
      type: AUTH_ACTION_TYPE.RECEIVE,
      payload: { balance: updatedBalance },
    });

    addNotification(AUTH_ACTION_TYPE.RECEIVE, Date.now(), "Announcement");
  };

  const send = (updatedBalance: number) => {
    dispatchAuth({
      type: AUTH_ACTION_TYPE.SEND,
      payload: { balance: updatedBalance },
    });

    addNotification(AUTH_ACTION_TYPE.SEND, Date.now(), "Announcement");
  };

  return {
    authState,
    isLogged,
    login,
    logout,
    dataUpdate,
    recovery,
    changePassword,
    changeEmail,
    receive,
    send,
  };
};
