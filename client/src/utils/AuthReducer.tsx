import { AuthState } from "./AuthContext";
import { AuthAction } from "./AuthProvider";

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  const createTime = new Date().getTime();

  switch (action.type) {
    case "LOGIN":
      const newLogin = { eventType: "Login", time: createTime };
      return {
        ...state,
        notifications: [...state.notifications, newLogin],
        token: action.payload.token,
        user: action.payload.user,
      };

    case "LOGOUT":
      const newLogout = { eventType: "Logout", time: createTime };
      return {
        ...state,
        notifications: [...state.notifications, newLogout],
        token: null,
        user: null,
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case "UPDATE_NOTIFICATIONS":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    default:
      return state;
  }
};
