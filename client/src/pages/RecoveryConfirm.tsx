import { FC, useState, useEffect, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authProvider";
import { validateCode } from "../utils/validators";
import { saveSession } from "../script/session";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { FieldPassword } from "../components/field-password";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { Alert, Loader } from "../components/load";

const RecoveryConfirmPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isCodeValid = code.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsFormValid(isCodeValid && isPasswordValid);
  }, [code, password]);

  // console.log("code:", code);
  // console.log("password:", password);

  const handleInput = (name: string, value: string | number) => {
    if (name === "code") {
      const isValidCode = validateCode(value as string);

      if (isValidCode) {
        setCode(value as string);
      } else {
        setCode("");
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
        code: Number(code),
        password: password,
      };
      // console.log("recovery-confirm userData:", userData);

      try {
        dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

        const res = await fetch("http://localhost:4000/recovery-confirm", {
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
              type="code"
              name="code"
              placeholder="1234"
              label="Code"
              onCodeChange={handleInput}
            />
          </div>

          <div className="form__item">
            <FieldPassword
              label="New password"
              name="password"
              placeholder="password"
              onPasswordChange={handleInput}
            />
          </div>
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
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
