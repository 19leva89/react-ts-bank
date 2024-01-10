import { FC, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authProvider";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { getTokenSession } from "../script/session";
import useForm from "./../script/form";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { Alert, Loader } from "../components/load";

const SendPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const { fields, errors, disabled, change, validateAll } = useForm();

  const handleSubmit = async (paymentSystem: string) => {
    validateAll();

    const userData = {
      email: fields["email"],
      amount: Number(fields["amount"]),
      paymentSystem: paymentSystem,
      status: "Send",
    };
    // console.log("Send userData", userData);

    try {
      dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

      const token = getTokenSession(); // Отримання токену сесії
      if (!token) {
        dispatchRequest({ type: REQUEST_ACTION_TYPE.ERROR, payload: "Session token not found" });
        return;
      }

      const res = await fetch("http://localhost:4000/user-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
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
        // console.log("Balance successfully updated!");

        authContext.send(Number(fields["amount"]));

        setTimeout(() => {
          navigate("/balance");
        }, 1000);
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

      <form action="" method="" className="form__container">
        <h1 className="form__title">Send</h1>

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
            <Field
              type="number"
              name="amount"
              label="Amount"
              placeholder="$"
              value={fields["amount"] || ""}
              onChange={(value) => change("amount", value)}
              error={errors["amount"]}
            />
          </div>
        </div>

        <button
          className={`button button__primary ${disabled ? "button--disabled" : ""}`}
          type="button"
          disabled={disabled}
          onClick={() => handleSubmit(fields["email"])}
        >
          Send
        </button>

        {requestState.status === REQUEST_ACTION_TYPE.SUCCESS && (
          <section className="form__item form__item--slim form__alert">
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

export default SendPage;
