import { FC, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import { saveSession } from "../script/session";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { BASE_URL } from "../utils/helper";
import useForm from "./../script/form";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { Alert, Loader } from "../components/load";

const RecoveryPage: FC = () => {
  const navigate = useNavigate();
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const { fields, errors, disabled, change, validateAll } = useForm();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    validateAll();

    const userData = {
      email: fields["email"],
    };

    try {
      dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

      const res = await fetch(`${BASE_URL}/recovery`, {
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
              label="Email"
              placeholder="Enter your email"
              value={fields["email"] || ""}
              onChange={(value) => change("email", value)}
              error={errors["email"]}
            />
          </div>
        </div>

        <button
          className={`button button__primary ${disabled ? "button--disabled" : ""}`}
          type="submit"
          disabled={disabled}
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
