import { useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { saveSession } from "./../../script/session";
import useForm from "./../../script/form";
import { AuthContext } from "./../../utils/authProvider";
import {
  REQUEST_ACTION_TYPE,
  requestInitialState,
  requestReducer,
} from "../../utils/requestReducer";

import "./style.css";

interface LoginData {
  email: string;
  password: string;
}

const useLoginContainer = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const { fields, validateAll } = useForm();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    validateAll();

    const userData: LoginData = {
      email: fields["email"],
      password: fields["password"],
    };

    try {
      dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      // console.log("Data from server:", data);

      if (res.ok) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: data.message,
        });

        saveSession(data.session);

        const { token, user } = data.session;
        authContext.login(token, user);

        if (data.session.user.isConfirm) {
          navigate("/balance");
        } else {
          navigate("/register-confirm");
        }
      } else {
        if (data && data.message) {
          // Обробка повідомлення про помилку з сервера
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: data.message,
          });
        } else {
          // Обробка загальної помилки від сервера
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: `Server error: ${res.statusText}`,
          });
        }
      }
    } catch (err) {
      dispatchRequest({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: `Fetch error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  };

  return { requestState, handleSubmit };
};

export default useLoginContainer;
