import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import { ButtonBack } from "../components/button-back";
import { Divider } from "../components/divider";

const TransactionPage: FC = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const [transaction, setTransaction] = useState<any>(null);

  // console.log("TransactionPage id:", transactionId);
  // console.log("TransactionPage transaction:", transaction);

  // Отримання транзакції за її ID
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch(`http://localhost:4000/user-transaction/${transactionId}`);
        if (res.ok) {
          const data = await res.json();
          setTransaction(data.transaction);
        } else {
          console.error("Failed to fetch transaction");
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  if (!transaction) {
    return <div>Loading...</div>; // Чекаємо на завантаження
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

          <div className="form__item form__item--slim">
            <span className="alert alert--disabled">Увага, помилка!</span>
          </div>
        </form>
      </div>
    </main>
  );
};

export default TransactionPage;
