import { Reducer } from "react";

export enum AUTH_ACTION_TYPE {
  LOGIN = "login",
  LOGOUT = "logout",
  RECOVERY = "recovery",
  CHANGE_PASSWORD = "change password",
  CHANGE_EMAIL = "change email",
  DATA_UPDATE = "data update",
  SEND = "send",
  RECEIVE = "receive",
  ADD_NOTIFICATION = "add notification",
  UPD_NOTIFICATION = "upd notification",
}

export type User = {
  id: string;
  email: string;
  isConfirm: boolean;
  balance: number;
};

export interface AuthState {
  token: string | null;
  user: User | string | null;
  notifications: { eventTitle: string; eventTime: number; eventType: string }[];
}

export type AuthAction =
  | { type: AUTH_ACTION_TYPE.LOGIN; payload: { token: string; user: string } }
  | { type: AUTH_ACTION_TYPE.LOGOUT; payload?: undefined }
  | {
      type: AUTH_ACTION_TYPE.ADD_NOTIFICATION;
      payload: { eventTitle: string; eventTime: number; eventType: string };
    }
  | {
      type: AUTH_ACTION_TYPE.UPD_NOTIFICATION;
      payload: { notifications: { eventTitle: string; eventTime: number; eventType: string }[] };
    }
  | {
      type: AUTH_ACTION_TYPE.RECEIVE;
      payload: { balance: number };
    }
  | {
      type: AUTH_ACTION_TYPE.SEND;
      payload: { balance: number };
    };

const storedSessionAuth = localStorage.getItem("sessionAuth");
const parsedSessionAuth = storedSessionAuth !== null ? JSON.parse(storedSessionAuth) : null;
const storedToken = parsedSessionAuth?.token || null;
const storedUser = parsedSessionAuth?.user || null;

export const authInitialState: AuthState = {
  token: storedToken,
  user: storedUser,
  notifications: [],
};

export const authReducer: Reducer<AuthState, AuthAction> = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case AUTH_ACTION_TYPE.LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };

    case AUTH_ACTION_TYPE.LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
      };

    case AUTH_ACTION_TYPE.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case AUTH_ACTION_TYPE.UPD_NOTIFICATION:
      return {
        ...state,
        notifications: action.payload.notifications,
      };

    case AUTH_ACTION_TYPE.RECEIVE:
      return {
        ...state,
        user:
          state.user && typeof state.user === "object"
            ? { ...state.user, balance: action.payload.balance }
            : state.user,
      };

    case AUTH_ACTION_TYPE.SEND:
      return {
        ...state,
        user:
          state.user && typeof state.user === "object"
            ? { ...state.user, balance: action.payload.balance }
            : state.user,
      };

    default:
      return state;
  }
};
