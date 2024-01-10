import { FC, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../utils/authProvider";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import useForm from "./../script/form";

import { ButtonBack } from "../components/button-back";
import { Field } from "../components/field";
import { FieldPassword } from "../components/field-password";
import { Divider } from "../components/divider";
import { Alert, Loader } from "../components/load";

const SettingsPage: FC = () => {
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { fields, errors, disabled, change, validateAll } = useForm();

  const handleSubmitChangeEmail = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    validateAll();

    const storedSessionAuth = localStorage.getItem("sessionAuth");
    const sessionAuth = storedSessionAuth ? JSON.parse(storedSessionAuth) : null;
    const userId = sessionAuth?.user?.id;

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const userData = {
      id: userId,
      newEmail: fields["newEmail"],
      password: fields["password"],
    };
    // console.log("userData", userData);

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
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: data.message,
        });

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
  };

  const handleSubmitChangePassword = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    validateAll();

    const storedSessionAuth = localStorage.getItem("sessionAuth");
    const sessionAuth = storedSessionAuth ? JSON.parse(storedSessionAuth) : null;
    const userId = sessionAuth?.user?.id;

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const userData = {
      id: userId,
      password: fields["oldPassword"],
      newPassword: fields["newPassword"],
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
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: data.message,
        });

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
      {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}

      <div className="menu__container">
        <ButtonBack />
        <h1 className="form__title">Settings</h1>
        <div className="stub"></div>
      </div>

      <div className="wrapper__settings">
        <form action="" method="" className="form__container" onSubmit={handleSubmitChangeEmail}>
          <p className="form__text form__text--big">Change email</p>

          <div className="form form--slim">
            <div className="form__item form__item--slim">
              <Field
                type="email"
                name="newEmail"
                label="New email"
                placeholder="Enter your new email"
                value={fields["newEmail"] || ""}
                onChange={(value) => change("newEmail", value)}
                error={errors["newEmail"]}
              />
            </div>

            <div className="form__item form__item--slim">
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

          <button
            className={`button button__transparent button__slim ${
              disabled ? "button--disabled" : ""
            }`}
            type="submit"
            disabled={disabled}
          >
            Save Email
          </button>
        </form>

        <Divider className="divider" />

        <form action="" method="" className="form__container" onSubmit={handleSubmitChangePassword}>
          <p className="form__text form__text--big">Change password</p>

          <div className="form form--slim">
            <div className="form__item form__item--slim">
              <FieldPassword
                name="password"
                label="Old password"
                placeholder="Enter your old password"
                value={fields["oldPassword"] || ""}
                onChange={(value) => change("oldPassword", value)}
                error={errors["oldPassword"]}
              />
            </div>

            <div className="form__item form__item--slim">
              <FieldPassword
                name="newPassword"
                label="New password"
                placeholder="Enter your new password"
                value={fields["newPassword"] || ""}
                onChange={(value) => change("newPassword", value)}
                error={errors["newPassword"]}
              />
            </div>
          </div>

          <button
            className={`button button__transparent button__slim ${
              disabled ? "button--disabled" : ""
            }`}
            type="submit"
            disabled={disabled}
          >
            Save Password
          </button>
        </form>

        <Divider className="divider" />

        <form action="" method="" className="form__container" onSubmit={handleSubmitLogout}>
          <button className={"button button__warning button__slim"} type="submit">
            Logout
          </button>

          {requestState.status === REQUEST_ACTION_TYPE.SUCCESS && (
            <section className="form__item form__item--slim form__alert">
              <Alert status={requestState.status} message={requestState.message} />
            </section>
          )}

          {requestState.status === REQUEST_ACTION_TYPE.ERROR && (
            <section className="form__item form__item--slim form__alert">
              <Alert status={requestState.status} message={requestState.message} />
            </section>
          )}
        </form>
      </div>
    </main>
  );
};

export default SettingsPage;
