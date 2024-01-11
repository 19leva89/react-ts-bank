import { FC, useContext, useReducer } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { AuthContext } from "../utils/authContext";
import { saveSession } from "../script/session";
import useForm from "./../script/form";

import { Field } from "../components/field";
import { FieldPassword } from "../components/field-password";
import { ButtonBack } from "../components/button-back";
import { Alert, Loader } from "../components/load";

const LoginPage: FC = () => {
  const { fields, errors, disabled, change, validateAll } = useForm();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    validateAll();

    const userData = {
      email: fields["email"],
      password: fields["password"],
    };
    // console.log("userData:", userData);

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

  return (
    <main className="main__container">
      {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}

      <ButtonBack />

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Login</h1>

        <p className="form__text">Select login method</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="email"
              name="email"
              label="Email"
              placeholder="Enter your email"
              value={fields["email"] || ""}
              onChange={(value) => change("email", value)}
              error={errors["email"]}
            />
          </div>

          <div className="form__item">
            <FieldPassword
              name="password"
              label="Password"
              placeholder="Enter your password"
              value={fields["password"] || ""}
              onChange={(value) => change("password", value)}
              error={errors["password"]}
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
          className={`button button__primary ${disabled ? "button--disabled" : ""}`}
          type="submit"
          disabled={disabled}
        >
          Continue
        </button>

        {requestState.status === REQUEST_ACTION_TYPE.SUCCESS && (
          <section className="form__item form__alert">
            <Alert status={requestState.status} message={requestState.message} />
          </section>
        )}

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
