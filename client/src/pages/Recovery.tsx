import { useState, useEffect, FC, SetStateAction, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authProvider";
import { validateEmail } from "../utils/validators";
import { saveSession } from "../script/session";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { Alert, Loader } from "../components/load";

const RecoveryPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";

    setIsFormValid(isEmailValid);
  }, [email]);

  // console.log("email:", email);

  const handleInput = (name: string, value: SetStateAction<string>) => {
    if (name === "email") {
      const isValidEmail = validateEmail(value as string);

      if (isValidEmail) {
        setEmail(value as string);
      } else {
        setEmail("");
      }
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isFormValid && authContext) {
      const userData = {
        email: email,
      };

      try {
        dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

        const res = await fetch("http://localhost:4000/recovery", {
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
					
          navigate("/recovery-confirm");
        } else {
          if (data && data.message) {
            dispatchRequest({
              type: REQUEST_ACTION_TYPE.ERROR,
              payload: `Server error: ${data.message}`,
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
        // Обробити помилку від fetch
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
        <h1 className="form__title">Recover password</h1>

        <p className="form__text">Choose a recovery method</p>

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
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Send code
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

export default RecoveryPage;
