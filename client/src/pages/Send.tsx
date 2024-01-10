import { FC, useState, useEffect, useContext, useReducer } from "react";
import { AuthContext } from "../utils/authProvider";
import { getTokenSession } from "../script/session";
import useForm from "./../script/form";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { useNavigate } from "react-router-dom";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { Alert, Loader } from "../components/load";

const SendPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const { fields, errors, disabled, change, validateAll, alertStatus, alertText, setAlert } =
    useForm();

  // const handleInput = (name: string, value: string) => {
  //   change(name, value);
  // };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    // if (typeof amount !== "undefined" && Number(amount) > 0 && !isNaN(Number(amount))) {
    //   // Логіка, якщо amount не є undefined і є числом більшим за 0
    // } else {
    //   console.error("Invalid amount");
    //   return;
    // }
    event.preventDefault();
    validateAll();

    const userData = {
      email: fields["email"],
      amount: Number(fields["amount"]),
      paymentSystem: "TestPayment",
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

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Send</h1>

        <div className="form">
          <div className="form__item">
            <Field
              type="email"
              name="email"
              placeholder="example@mail.com"
              label="Email"
              // onEmailChange={handleInput}
            />
          </div>

          <div className="form__item">
            <Field
              type="number"
              name="amount"
              placeholder="$"
              label="Amount"
              // onAmountChange={handleInput}
            />
          </div>
        </div>

        <button
          className={`button button__primary ${disabled ? "button--disabled" : ""}`}
          type="submit"
          disabled={disabled}
          // onClick={() => handleSubmit(email)}
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
