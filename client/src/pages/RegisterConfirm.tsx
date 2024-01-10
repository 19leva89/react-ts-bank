import { FC, useState, useEffect, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authProvider";
import { getTokenSession, saveSession } from "../script/session";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import useForm from "./../script/form";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { Alert, Loader } from "../components/load";

const RegisterConfirmPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const { fields, errors, disabled, change, validateAll, alertStatus, alertText, setAlert } =
    useForm();

  // console.log(code);

  // const handleInput = (name: string, value: string) => {
  //   change(name, value);
  // };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const token = getTokenSession();
    const userData = {
      code: Number(fields["code"]),
      token: token,
    };
    // console.log("register-confirm userData:", userData);

    try {
      dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

      const res = await fetch("http://localhost:4000/register-confirm", {
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
        authContext.dataUpdate(token, user);

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

      <form action="/check" method="post" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Confirm account</h1>

        <p className="form__text">Write the code you received</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="code"
              name="code"
              label="Code"
              placeholder="1234"
              value={fields["code"]}
              onChange={(value) => change("code", value)}
            />
          </div>
        </div>

        <button
          className={`button button__primary ${disabled ? "button--disabled" : ""}`}
          type="submit"
          disabled={disabled}
        >
          Confirm
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

export default RegisterConfirmPage;
