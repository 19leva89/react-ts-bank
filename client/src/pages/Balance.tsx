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
            <img className="movement__img" src={stripe} alt="Stripe" />

            <div className="movement__details">
              <div className="movement__name">Stripe</div>
              <div className="movement__specialty">
                <div className="movement__time">12:25</div>
                <div className="movement__status">Receipt</div>
              </div>
            </div>
          </div>

          <div className="movement__cost movement__cost--plus">+$125.00</div>
        </div>

        <div className="movement">
          <div className="movement__content">
            <img className="movement__img" src={user} alt="Stripe" />

            <div className="movement__details">
              <div className="movement__name">Oleg V.</div>
              <div className="movement__specialty">
                <div className="movement__time">12:25</div>
                <div className="movement__status">Sending</div>
              </div>
            </div>
          </div>

          <div className="movement__cost movement__cost--minus">-$200.50</div>
        </div>

        <div className="movement">
          <div className="movement__content">
            <img className="movement__img" src={coinbase} alt="Stripe" />

            <div className="movement__details">
              <div className="movement__name">Coinbase</div>
              <div className="movement__specialty">
                <div className="movement__time">10:20</div>
                <div className="movement__status">Receipt</div>
              </div>
            </div>
          </div>

          <div className="movement__cost movement__cost--plus">+$1,200.00</div>
        </div>
      </section>
    </main>
  );
};

export default BalancePage;
