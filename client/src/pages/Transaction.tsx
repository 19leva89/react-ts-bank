import { FC, useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/helper";
import { REQUEST_ACTION_TYPE, requestInitialState, requestReducer } from "../utils/requestReducer";
import { format } from "date-fns";

import { ButtonBack } from "../components/button-back";
import { Divider } from "../components/divider";
import { Alert, Loader } from "../components/load";

const TransactionPage: FC = () => {
  const [requestState, dispatchRequest] = useReducer(requestReducer, requestInitialState);
  const { transactionId } = useParams<{ transactionId: string }>();
  const [transaction, setTransaction] = useState<any>(null);

  // console.log("TransactionPage id:", transactionId);
  // console.log("TransactionPage transaction:", transaction);

  // Отримання транзакції за її ID
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        dispatchRequest({ type: REQUEST_ACTION_TYPE.PROGRESS });

        const res = await fetch(`${BASE_URL}/user-transaction/${transactionId}`);

        const data = await res.json();

        if (res.ok) {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.SUCCESS,
            payload: data.message,
          });

          setTransaction(data.transaction);
        } else {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.ERROR,
            payload: "Failed to fetch transaction",
          });
        }
      } catch (err) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: `Error fetching transaction: ${err}`,
        });
      }
    };

    fetchTransaction();
  }, [transactionId]);

  if (!transaction) {
    return <Loader />;
  }

  return (
    <main className="main__container main__container--gray">
      <div className="menu__container">
        <ButtonBack />
        <h1 className="form__title">Transaction</h1>
        <div className="stub"></div>
      </div>

      <div className="transaction__container">
        <form action="" method="" className="form__container">
          <div className="form">
            <h1
              className={`form__text--h1 movement__cost ${
                transaction.status === "Receive" ? "movement__cost--plus" : "movement__cost--minus"
              }`}
            >
              {transaction.status === "Receive"
                ? `+$${Math.abs(transaction.amount)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                : `-$${Math.abs(transaction.amount)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
            </h1>

            <div className="form__item">
              <div className="transaction__wrapper">
                <div className="transaction__date">
                  <div>Date</div>
                  <div>{format(new Date(transaction.date), "dd MMM, HH:mm")}</div>
                </div>
                <Divider className="divider__transaction" />
                <div className="transaction__address">
                  <div>Address</div>
                  <div>{transaction.paymentSystem}</div>
                </div>
                <Divider className="divider__transaction" />
                <div className="transaction__type">
                  <div>Type</div>
                  <div>{transaction.status}</div>
                </div>
              </div>
            </div>
          </div>

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

export default TransactionPage;
