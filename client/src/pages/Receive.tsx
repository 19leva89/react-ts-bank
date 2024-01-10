import { FC, useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../utils/authProvider";
import { getTokenSession } from "../script/session";
import useForm from "./../script/form";

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
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { Alert, Loader } from "../components/load";

const ReceivePage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const { fields, errors, disabled, change, validateAll, alertStatus, alertText, setAlert } =
    useForm();

  // console.log("amount:", amount);

  // const handleInput = (name: string, value: string) => {
  //   change(name, value);
  // };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    validateAll();

    const userData = {
      amount: Number(fields["amount"]),
      paymentSystem: "Test",
      status: "Receive",
    };

    try {
      dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

      const token = getTokenSession(); // Отримання токену сесії
      if (!token) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: "Session token not found",
        });
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
      // console.log("Data from server:", data);

      if (res.ok) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: data.message,
        });

        authContext.receive(Number(fields["amount"]));

        setTimeout(() => {
          navigate("/balance");
        }, 1000);
      } else {
        if (data && data.message) {
          // Обробка повідомлення про помилку з сервера
          dispatchRequest({ type: REQUEST_ACTION_TYPE.ERROR, payload: data.message });
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
      dispatchRequest({ type: REQUEST_ACTION_TYPE.ERROR, payload: `Fetch error: ${err}` });
    }
  };

  return (
    <main className="main__container main__container--gray">
      <div className="menu__container">
        {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}

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
                // onAmountChange={handleInput}
              />
            </div>
          </div>

          <Divider className="divider" />

          <p className="form__text form__text--big form__text--left">Payment system</p>
          <button
            className={`button button__transparent button__fat ${
              disabled ? "button--disabled" : ""
            }`}
            type="button"
            disabled={disabled}
            // onClick={() => handleSubmit("Stripe")}
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
              disabled ? "button--disabled" : ""
            }`}
            type="button"
            disabled={disabled}
            // onClick={() => handleSubmit("Coinbase")}
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

          {requestState.status === REQUEST_ACTION_TYPE.SUCCESS && (
            <section className="form__item form__item--slim form__alert">
              <Alert status={requestState.status} message={requestState.message} />
            </section>
          )}

          {requestState.status === REQUEST_ACTION_TYPE.ERROR && (
            <section className="form__item form__item--slim form__alert">
              <Alert status={requestState.status} message={requestState.message} />
            </section>
          )}
        </form>
      </div>
    </main>
  );
};

export default ReceivePage;
