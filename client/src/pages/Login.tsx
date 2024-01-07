import { FC, useState, useEffect, useContext, useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/validators";
import { AuthContext } from "../utils/authProvider";
import { saveSession } from "../script/session";
import {
  requestReducer,
  requestInitialState,
  REQUEST_ACTION_TYPE,
} from "./../utils/requestReducer";

import { Field } from "../components/field";
import { FieldPasswordLogin } from "../components/field-password-login";
import { ButtonBack } from "../components/button-back";
import { Alert, Loader } from "../components/load";

const LoginPage: FC = () => {
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
      const userData = {
        email: email,
        password: password,
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

  return (
    <main className="main__container">
      <ButtonBack />

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Login</h1>

        <p className="form__text">Select login method</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="email"
              name="email"
              placeholder="example@mail.com"
              label="Email"
              onEmailChange={handleInput}
            />
          </div>

          <div className="form__item">
            <FieldPasswordLogin
              label="Password"
              name="password"
              placeholder="password"
              onPasswordChangeLog={handleInput}
            />
          </div>
        </div>

        <div className="form__item">
          <span className="link__prefix">
            Forgot your password?
            <NavLink to="/recovery" className="link">
              <> </>Restore
            </NavLink>
          </span>
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Continue
        </button>

        {requestState.status === REQUEST_ACTION_TYPE.ERROR && (
          <section className="form__item form__alert">
            <Alert status={requestState.status} message={requestState.message} />
          </section>
        )}
      </form>
    </main>
  );
};

export default LoginPage;
