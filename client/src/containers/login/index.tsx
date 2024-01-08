import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "./../../utils/validators";
import { saveSession } from "./../../script/session";
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
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  // console.log("email:", email);
  // console.log("password:", password);

  const handleInput = (name: string, value: string | boolean) => {
    if (name === "email") {
      const isValidEmail = validateEmail(value as string);

      if (isValidEmail) {
        setEmail(value as string);
      } else {
        setEmail("");
      }
    }

    if (name === "password") {
      setPassword(value as string);
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isFormValid && authContext) {
      const userData: LoginData = {
        email,
        password,
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
    }
  };

  return { isFormValid, requestState, handleInput, handleSubmit };
};

export default useLoginContainer;
