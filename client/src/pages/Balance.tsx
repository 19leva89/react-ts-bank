import { FC, useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { getTokenSession } from "../script/session";
import {
  requestReducer,
  requestInitialState,
  REQUEST_ACTION_TYPE,
} from "./../utils/requestReducer";
import { format } from "date-fns";

import { Button } from "../components/button";
import { Alert, Loader, Skeleton } from "../components/load";
import backgroundBalance from "./../img/background-balance.png";
import settings from "./../img/settings.svg";
import menuNotification from "./../img/notification-ico.svg";
import receive from "./../img/receive.svg";
import send from "./../img/send.svg";
import stripe from "./../img/payment/stripe.svg";
import coinbase from "./../img/payment/coinbase.svg";
import { AUTH_ACTION_TYPE, authInitialState, authReducer } from "../utils/authReducer";

interface Transaction {
  id: number;
  paymentSystem: string;
  amount: number;
  status: string;
  date: string | number | Date;
  userImg?: string;
}

type PaymentSystemImages = {
  [key: string]: string;
};

const paymentSystemImages: PaymentSystemImages = {
  Stripe: stripe,
  Coinbase: coinbase,
  // Додайте інші системи оплати, які вам потрібні тут
};

const BalancePage: FC = () => {
  const [authState, dispatchAuth] = useReducer(authReducer, authInitialState);
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState([]);
  // console.log(transactions);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const token = getTokenSession();
        if (!token) {
          console.error("Session token not found");
          return;
        }

        const res = await fetch("http://localhost:4000/user-balance", {
          headers: {
            Authorization: token,
          },
        });

        if (res.ok) {
          const data = await res.json();

          if (data && data.userBalance !== undefined) {
            dispatchRequest({
              type: REQUEST_ACTION_TYPE.SUCCESS,
              payload: data.message,
            });

            dispatchAuth({
              type: AUTH_ACTION_TYPE.RECEIVE,
              payload: { balance: data.userBalance },
            });
          } else {
            dispatchRequest({
              type: REQUEST_ACTION_TYPE.ERROR,
              payload: "Invalid balance data received",
            });
          }
        } else if (res.status === 401) {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: "Invalid token or unauthorized access",
          });
          return;
        } else if (res.status === 404) {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: "User not found",
          });
          return;
        } else {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: "Failed to fetch balance",
          });
        }
      } catch (err) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: `Error fetching balance: ${err}`,
        });
        return;
      }
    };

    loadBalance();
  }, []);

  useEffect(() => {
    if (
      typeof authState.user === "object" &&
      authState.user !== null &&
      "balance" in authState.user
    ) {
      const balance = authState.user.balance;
      setUserBalance(balance);
    }
  }, [authState.user]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

        const token = getTokenSession();
        if (!token) {
          dispatchRequest({ type: REQUEST_ACTION_TYPE.ERROR, payload: "Session token not found" });
          return;
        }

        const res = await fetch("http://localhost:4000/user-transactions", {
          headers: {
            Authorization: token,
          },
        });

        if (res.ok) {
          const data = await res.json();

          dispatchRequest({
            type: REQUEST_ACTION_TYPE.SUCCESS,
            payload: data.message,
          });

          setTransactions(data.transactions);
        } else {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: "Failed to fetch transactions",
          });
        }
      } catch (err) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: `Error fetching transactions: ${err}`,
        });
      }
    };

    fetchTransactions();
  }, []);

  return (
    <main>
      {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}

      <img className="background-balance--img" src={backgroundBalance} alt="background balance" />

      <section className="wrapper__menu">
        <Button className="" link="/settings">
          <img className="menu__settings" src={settings} alt="Menu" />
        </Button>

        <p className="menu__text">Main wallet</p>

        <Button className="" link="/notifications">
          <img className="menu__notification" src={menuNotification} alt="Notification" />
        </Button>
      </section>

      <section className="wrapper__balance">
        <h1 className="balance__title">
          {userBalance !== null ? `$ ${Math.abs(userBalance).toFixed(2)}` : "..."}
        </h1>
      </section>

      <section className="wrapper__transaction">
        <div className="transaction__receive">
          <Button className="" link="/receive">
            <img className="transaction__img" src={receive} alt="Receive" />
          </Button>
          <span className="transaction__title">Receive</span>
        </div>

        <div className="transaction__send">
          <Button className="" link="/send">
            <img className="transaction__img" src={send} alt="Send" />
          </Button>
          <span className="transaction__title">Send</span>
        </div>
      </section>

      {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && (
        <section className="wrapper__movement">
          <Skeleton />
        </section>
      )}

      {requestState.status === REQUEST_ACTION_TYPE.ERROR && (
        <section className="wrapper__movement">
          <Alert status={requestState.status} message={requestState.message} />
        </section>
      )}

      {transactions.length > 0 && (
        <section className="wrapper__movement">
          {transactions
            .reverse()
            .slice(0, 20)
            .map((transaction: Transaction) => (
              <Link className="" to={`/transaction/${transaction.id}`} key={transaction.id}>
                <div className="movement">
                  <div className="movement__content">
                    <img
                      className="movement__img"
                      src={
                        transaction.userImg
                          ? transaction.userImg // якщо оплата через пошту
                          : paymentSystemImages[transaction.paymentSystem] // якщо через Stripe або Coinbase
                      }
                      alt={transaction.paymentSystem}
                    />

                    <div className="movement__details">
                      <div className="movement__name">{transaction.paymentSystem}</div>
                      <div className="movement__specialty">
                        <div className="movement__time">
                          {format(new Date(transaction.date), "HH:mm")}
                        </div>
                        <div className="movement__status">{transaction.status}</div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`movement__cost ${
                      transaction.status === "Receive"
                        ? "movement__cost--plus"
                        : "movement__cost--minus"
                    }`}
                  >
                    {transaction.status === "Receive"
                      ? `+$${Math.abs(transaction.amount)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                      : `-$${Math.abs(transaction.amount)
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
                  </div>
                </div>
              </Link>
            ))}
        </section>
      )}
    </main>
  );
};

export default BalancePage;
