import { FC, useState, useEffect, useContext, useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authProvider";
import { validateEmail, validatePassword } from "../utils/validators";
import { saveSession } from "../script/session";

import { Field } from "../components/field";
import { FieldPasswordRegister } from "../components/field-password-register";
import { ButtonBack } from "../components/button-back";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { Alert } from "../components/load";

const RegisterPage: FC = () => {
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
      const isValidPassword = validatePassword(value as string);

      if (isValidPassword) {
        setPassword(value as string);
      } else {
        setPassword("");
      }
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

        const res = await fetch("http://localhost:4000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await res.json();
        // console.log("Data from server:", data);

        if (res.ok) {
          dispatchRequest({ type: REQUEST_ACTION_TYPE.SUCCESS, payload: data });
          saveSession(data.session);
          navigate("/register-confirm");
        } else {
          if (data && data.message) {
            dispatchRequest({ type: REQUEST_ACTION_TYPE.ERROR, payload: data.message });
          } else {
            // Обробка загальної помилки від сервера
            dispatchRequest({ type: REQUEST_ACTION_TYPE.ERROR, payload: res.statusText });
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
        <h1 className="form__title">Register</h1>

        <p className="form__text">Choose a registration method</p>

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
            <FieldPasswordRegister label="Password" onPassChangeReg={handleInput} />
          </div>
        </div>

        <div className="form__item">
          <span className="link__prefix">
            Already have an account?
            <NavLink to="/login" className="link">
              <> </>Login
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

export default RegisterPage;
