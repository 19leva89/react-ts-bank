import { FC, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/url";
import { AuthContext } from "../utils/authContext";
import { saveSession } from "../script/session";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import useForm from "./../script/form";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { FieldPassword } from "../components/field-password";
import { Alert, Loader } from "../components/load";

const RecoveryConfirmPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const { fields, errors, disabled, change, validateAll } = useForm();

  // console.log("code:", code);
  // console.log("password:", password);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    validateAll();

    const userData = {
      code: Number(fields["code"]),
      password: fields["password"],
    };
    // console.log("recovery-confirm userData:", userData);

    try {
      dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

      const res = await fetch(`${BASE_URL}/recovery-confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      // console.log("Data from server:", data);

      if (res.ok) {
        dispatchRequest({ type: REQUEST_ACTION_TYPE.SUCCESS, payload: data.message });

        saveSession(data.session);

        const { token, user } = data.session;
        authContext.recovery(token, user);

        navigate("/balance");
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

  return (
    <main className="main__container">
      {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}

      <ButtonBack />

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Changing the password</h1>

        <p className="form__text">Write the code you received</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="number"
              name="code"
              label="Code"
              placeholder="Enter your code"
              value={fields["code"] || ""}
              onChange={(value) => change("code", value)}
              error={errors["code"]}
            />
          </div>

          <div className="form__item">
            <FieldPassword
              name="password"
              label="New password"
              placeholder="Enter your new password"
              value={fields["password"] || ""}
              onChange={(value) => change("password", value)}
              error={errors["password"]}
            />
          </div>
        </div>

        <button
          className={`button button__primary ${disabled ? "button--disabled" : ""}`}
          type="submit"
          disabled={disabled}
        >
          Change password
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

export default RecoveryConfirmPage;
