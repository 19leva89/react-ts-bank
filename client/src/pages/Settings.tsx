import { FC, useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../utils/authProvider";
import { validateEmail, validatePassword } from "../utils/validators";

import { ButtonBack } from "../components/button-back";
import { Field } from "../components/field";
import { FieldPasswordLogin } from "../components/field-password-login";
import { FieldPasswordRenew } from "../components/field-password-renew";
import { Divider } from "../components/divider";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { Alert, Loader } from "../components/load";

const SettingsPage: FC = () => {
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isFormEmailValid, setIsFormEmailValid] = useState(false);
  const [isFormPasswordValid, setIsFormPasswordValid] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const isNewEmailValid = newEmail.trim() !== "";
    const isPasswordValid = password.trim() !== "";
    const isNewPasswordValid = newPassword.trim() !== "";

    setIsFormEmailValid(isNewEmailValid && isPasswordValid);

    setIsFormPasswordValid(isPasswordValid && isNewPasswordValid);
  }, [newEmail, password, newPassword]);

  const handleInputChangeEmail = (name: string, value: string | boolean) => {
    if (name === "newEmail") {
      const isValidEmail = validateEmail(value as string);

      if (isValidEmail) {
        setNewEmail(value as string);
      } else {
        setNewEmail("");
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

  const handleInputChangePassword = (name: string, value: string | boolean) => {
    if (name === "password") {
      setPassword(value as string);
    }

    if (name === "newPassword") {
      const isValidPassword = validatePassword(value as string);

      if (isValidPassword) {
        setNewPassword(value as string);
      } else {
        setNewPassword("");
      }
    }
  };

  const handleSubmitChangeEmail = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isFormEmailValid && authContext) {
      const storedSessionAuth = localStorage.getItem("sessionAuth");
      const sessionAuth = storedSessionAuth ? JSON.parse(storedSessionAuth) : null;
      const userId = sessionAuth?.user?.id;

      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const userData = {
        id: userId,
        newEmail: newEmail,
        password: password,
      };

      try {
        dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

        const res = await fetch("http://localhost:4000/user-new-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await res.json();
        // console.log("Data from server:", data);

        if (res.ok) {
          const token: string | null = authContext.authState.token;
          const updatedToken: string = token !== null ? token : "";
          authContext.changeEmail(updatedToken, data.user.email);

          // Отримання поточних даних з localStorage
          const storedSessionAuth = localStorage.getItem("sessionAuth");
          const sessionAuth = storedSessionAuth ? JSON.parse(storedSessionAuth) : null;

          // Оновлення email у збережених даних
          if (sessionAuth) {
            sessionAuth.user.email = data.user.email;

            // Збереження оновлених даних у localStorage
            localStorage.setItem("sessionAuth", JSON.stringify(sessionAuth));
          }
        } else {
          if (data && data.message) {
            dispatchRequest({ type: REQUEST_ACTION_TYPE.ERROR, payload: data.message });
          } else {
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

  const handleSubmitChangePassword = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isFormPasswordValid && authContext) {
      const storedSessionAuth = localStorage.getItem("sessionAuth");
      const sessionAuth = storedSessionAuth ? JSON.parse(storedSessionAuth) : null;
      const userId = sessionAuth?.user?.id;

      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const userData = {
        id: userId,
        password: password,
        newPassword: newPassword,
      };

      try {
        dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

        const res = await fetch("http://localhost:4000/user-new-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await res.json();
        // console.log("Data from server:", data);

        if (res.ok) {
          const token: string | null = authContext.authState.token;
          const updatedToken: string = token !== null ? token : "";
          authContext.changePassword(updatedToken, data.user.password);
        } else {
          if (data && data.message) {
            dispatchRequest({ type: REQUEST_ACTION_TYPE.ERROR, payload: data.message });
          } else {
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

  const handleSubmitLogout = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

      logout();
      localStorage.removeItem("sessionAuth");

      dispatchRequest({ type: REQUEST_ACTION_TYPE.RESET });

      navigate("/");
    } catch (err) {
      dispatchRequest({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: `Logout error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  };

  return (
    <main className="main__container">
			{/* {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />} */}
			
      <div className="menu__container">
        <ButtonBack />
        <h1 className="form__title">Settings</h1>
        <div className="stub"></div>
      </div>

      <form action="" method="" className="form__container" onSubmit={handleSubmitChangeEmail}>
        <p className="form__text form__text--big">Change email</p>

        <div className="form form--slim">
          <div className="form__item form__item--slim">
            <Field
              type="email"
              name="newEmail"
              placeholder="Email"
              label="New email"
              onNewEmailChange={handleInputChangeEmail}
            />
          </div>

          <div className="form__item form__item--slim">
            <FieldPasswordLogin
              label="Password"
              name="password"
              placeholder="Password"
              onPasswordChangeLog={handleInputChangeEmail}
            />
          </div>
        </div>

        <button
          className={`button button__transparent button__slim ${
            isFormEmailValid ? "" : "button--disabled"
          }`}
          type="submit"
          disabled={!isFormEmailValid}
        >
          Save Email
        </button>
      </form>

      <Divider className="divider" />

      <form action="" method="" className="form__container" onSubmit={handleSubmitChangePassword}>
        <p className="form__text form__text--big">Change password</p>

        <div className="form form--slim">
          <div className="form__item form__item--slim">
            <FieldPasswordLogin
              label="Old password"
              name="password"
              placeholder="Password"
              onPasswordChangeLog={handleInputChangePassword}
            />
          </div>

          <div className="form__item form__item--slim">
            <FieldPasswordRenew
              label="New password"
              name="newPassword"
              placeholder="Password"
              onPasswordNewChangeLog={handleInputChangePassword}
            />
          </div>
        </div>

        <button
          className={`button button__transparent button__slim ${
            isFormPasswordValid ? "" : "button--disabled"
          }`}
          type="submit"
          disabled={!isFormPasswordValid}
        >
          Save Password
        </button>
      </form>

      <Divider className="divider" />

      <form action="" method="" className="form__container" onSubmit={handleSubmitLogout}>
        <button className={"button button__warning button__slim"} type="submit">
          Logout
        </button>

        {requestState.status === REQUEST_ACTION_TYPE.ERROR && (
          <section className="form__item form__item--slim form__alert">
            <Alert status={requestState.status} message={requestState.message} />
          </section>
        )}
      </form>
    </main>
  );
};

export default SettingsPage;
