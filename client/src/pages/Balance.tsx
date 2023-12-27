import { FC } from "react";
import backgroundBalance from "./../img/background-balance.png";
import menu from "./../img/menu.svg";
import menuNotification from "./../img/bell-ringing.svg";
import receive from "./../img/receive.svg";
import send from "./../img/send.svg";
import stripe from "./../img/stripe.svg";
import coinbase from "./../img/coinbase.svg";
import user from "./../img/user.svg";

const BalancePage: FC = () => {
  return (
    <main>
      <img className="background-balance--img" src={backgroundBalance} alt="background balance" />

      <section className="wrapper__menu">
        <img className="menu" src={menu} alt="Menu" />
        <p className="menu__text">Main wallet</p>
        <img className="menu__notification" src={menuNotification} alt="Notification" />
      </section>

      <section className="wrapper__balance">
        <h1 className="balance__title">$ 100.20</h1>
      </section>

      <section className="wrapper__transaction">
        <div className="transaction__receive">
          <img className="transaction__img" src={receive} alt="Receive" />
          <span className="transaction__title">Receive</span>
        </div>

        <div className="transaction__send">
          <img className="transaction__img" src={send} alt="Send" />
          <span className="transaction__title">Send</span>
        </div>
      </section>

      <section className="wrapper__movement">
        <div className="movement">
          <div className="movement__content">
            <img className="transaction__img" src={stripe} alt="Stripe" />

            <div className="transaction__details">
              <div className="transaction__name">Oleg V.</div>
              <div className="transaction__specialty">
                <div className="transaction__time">12:25</div>
                <div className="transaction__status">Sending</div>
              </div>
            </div>
          </div>

          <div className="movement__cost">+$125.00</div>
        </div>
      </section>
    </main>
  );
};

export default BalancePage;
