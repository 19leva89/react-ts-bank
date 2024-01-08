import { FC, useState, useEffect, useContext, useReducer } from "react";
import { AuthContext } from "../utils/authProvider";
import { validateEmail, validateAmount } from "../utils/validators";
import { getTokenSession } from "../script/session";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { useNavigate } from "react-router-dom";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { Alert, Loader } from "../components/load";

const SendPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isAmountValid = parseFloat(amount as string) > 0;

    setIsFormValid(isEmailValid && isAmountValid);
  }, [email, amount]);

  // console.log("email:", email);
  // console.log("amount:", amount);

  const handleInput = (name: string, value: string | number) => {
    if (name === "email") {
      const isValidEmail = validateEmail(value as string);

      if (isValidEmail) {
        setEmail(value as string);
      } else {
        setEmail("");
      }
    }

    if (name === "amount") {
      const isValidAmount = validateAmount(value as string);

      if (isValidAmount) {
        setAmount(value as string);
      } else {
        setAmount("");
      }
    }
  };

  const handleSubmit = async (paymentSystem: string) => {
    if (isFormValid && authContext) {
      if (typeof amount !== "undefined" && Number(amount) > 0 && !isNaN(Number(amount))) {
        // Логіка, якщо amount не є undefined і є числом більшим за 0
      } else {
        console.error("Invalid amount");
        return;
      }

      const userData = {
        email: email,
        amount: Number(amount),
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

          authContext.send(Number(amount));

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
              placeholder="example@mail.com"
              label="Email"
              onEmailChange={handleInput}
            />
          </div>

          <div className="form__item">
            <Field
              type="number"
              name="amount"
              placeholder="$"
              label="Amount"
              onAmountChange={handleInput}
            />
          </div>
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="button"
          disabled={!isFormValid}
          onClick={() => handleSubmit(email)}
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
