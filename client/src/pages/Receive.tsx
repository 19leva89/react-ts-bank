import { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/authProvider";
import { validateAmount } from "../utils/validators";
import { getTokenSession } from "../script/session";

import { ButtonBack } from "../components/button-back";
import { Field } from "../components/field";
import stripe from "./../img/payment/stripe.svg";
import coinbase from "./../img/payment/coinbase.svg";
import mastercard from "./../img/payment/mastercard-ico.svg";
import tronGreen from "./../img/payment/tron-green-ico.svg";
import bitcoin from "./../img/payment/bitcoin-ico.svg";
import tronRed from "./../img/payment/tron-red-ico.svg";
import ethereum from "./../img/payment/ethereum-ico.svg";
import binance from "./../img/payment/binance-ico.svg";
import { Divider } from "../components/divider";
import { useNavigate } from "react-router-dom";

const ReceivePage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [isFormAmountValid, setIsFormAmountValid] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const isAmountValid = parseFloat(amount as string) > 0;

    setIsFormAmountValid(isAmountValid);
  }, [amount]);

  // console.log("amount:", amount);

  const handleInputChangeAmount = (name: string, value: string) => {
    if (name === "amount") {
      const isValidAmount = validateAmount(value as string);

      if (isValidAmount) {
        setAmount(value as string);
      } else {
        setAmount("");
      }
    }
  };

  const handleSubmitChangeAmount = async (paymentSystem: string) => {
    if (isFormAmountValid && authContext) {
      if (typeof amount !== "undefined" && Number(amount) > 0 && !isNaN(Number(amount))) {
        // Логіка, якщо amount не є undefined і є числом більшим за 0
      } else {
        console.error("Invalid amount");
        return;
      }

      const userData = {
        amount: Number(amount),
        paymentSystem: paymentSystem,
        status: "Receipt",
      };

      try {
        const token = getTokenSession(); // Отримання токену сесії

        if (!token) {
          console.error("Session token not found");
          return;
        }

        const res = await fetch("http://localhost:4000/user-receive", {
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
          authContext.receive(Number(amount));

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
    <main className="main__container main__container--gray">
      <div className="menu__container">
        <ButtonBack />
        <h1 className="form__title">Receive</h1>
        <div className="stub"></div>
      </div>

      <div className="receive__container">
        <form action="" method="" className="form__container">
          <div className="form form--slim">
            <p className="form__text form__text--big form__text--left">Receive amount</p>
            <div className="form__item form__item--slim">
              <Field
                type="number"
                name="amount"
                placeholder="$"
                onAmountChange={handleInputChangeAmount}
              />
            </div>
          </div>

          <Divider />

          <p className="form__text form__text--big form__text--left">Payment system</p>
          <button
            className={`button button__transparent button__fat ${
              isFormAmountValid ? "" : "button--disabled"
            }`}
            type="button"
            disabled={!isFormAmountValid}
            onClick={() => handleSubmitChangeAmount("Stripe")}
          >
            <div className="payment__container">
              <div className="payment__wrapper">
                <img src={stripe} alt="Stripe" />
                <div className="payment__title">Stripe</div>
              </div>

              <div className="payment__ico">
                <img src={mastercard} alt="Mastercard" />
                <img src={tronGreen} alt="Tron green" />
                <img src={bitcoin} alt="Bitcoin" />
                <img src={tronRed} alt="Tron red" />
                <img src={ethereum} alt="Ethereum" />
                <img src={binance} alt="Binance" />
              </div>
            </div>
          </button>

          <button
            className={`button button__transparent button__fat ${
              isFormAmountValid ? "" : "button--disabled"
            }`}
            type="button"
            disabled={!isFormAmountValid}
            onClick={() => handleSubmitChangeAmount("Coinbase")}
          >
            <div className="payment__container">
              <div className="payment__wrapper">
                <img src={coinbase} alt="Coinbase" />
                <div className="payment__title">Coinbase</div>
              </div>

              <div className="payment__ico">
                <img src={tronGreen} alt="Tron green" />
                <img src={mastercard} alt="Mastercard" />
                <img src={tronRed} alt="Tron red" />
                <img src={bitcoin} alt="Bitcoin" />
                <img src={binance} alt="Binance" />
                <img src={ethereum} alt="Ethereum" />
              </div>
            </div>
          </button>

          <div className="form__item form__item--slim">
            <span className="alert alert--disabled">Увага, помилка!</span>
          </div>
        </form>
      </div>

      <div className="payment__container"></div>
    </main>
  );
};

export default ReceivePage;
