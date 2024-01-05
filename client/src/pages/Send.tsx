import { FC, useState, useEffect, useContext } from "react";
import { AuthContext } from "../utils/authProvider";
import { validateEmail, validateAmount } from "../utils/validators";
import { getTokenSession } from "../script/session";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { useNavigate } from "react-router-dom";

const SendPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isAmountValid = parseFloat(amount as string) > 0;

    setIsFormValid(isEmailValid && isAmountValid);
  }, [email, amount]);

  console.log("email:", email);
  console.log("amount:", amount);

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
        status: "Sending",
      };
      console.log("Sending userData", userData);

      try {
        const token = getTokenSession(); // Отримання токену сесії

        if (!token) {
          console.error("Session token not found");
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
        console.log("Data from server:", data);

        if (res.ok) {
          console.log("Balance successfully updated!");

          // saveSession(data.session);
          authContext.send(Number(amount));

          navigate("/balance");
        } else {
          if (data && data.message) {
            // Обробка повідомлення про помилку з сервера
            console.error("Server error:", data.message);
          } else {
            // Обробка загальної помилки від сервера
            console.error("Server error:", res.statusText);
          }
        }
      } catch (err) {
        // Обробити помилку від fetch
        console.error("Fetch error:", err);
      }
    }
  };

  return (
    <main className="main__container">
      <ButtonBack />

      <form action="" method="" className="form__container">
        <h1 className="form__title">Send</h1>

        <div className="form">
          <div className="form__item">
            <Field
              type="email"
              name="email"
              placeholder="Електронна пошта"
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

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>
    </main>
  );
};

export default SendPage;
