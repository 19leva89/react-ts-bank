import { FC } from "react";
import backgroundBalance from "./../img/background-balance.png";
import settings from "./../img/settings.svg";
import menuNotification from "./../img/notification-ico.svg";
import receive from "./../img/receive.svg";
import send from "./../img/send.svg";
import stripe from "./../img/stripe.svg";
import coinbase from "./../img/coinbase.svg";
import user from "./../img/user.svg";
import { Button } from "../components/button";

const BalancePage: FC = () => {
  const handleSettingsClick = () => {
    // Логіка для обробки кліку на кнопку Login
    // console.log("Login button clicked");
  };

  const handleNotificationClick = () => {
    // Логіка для обробки кліку на кнопку Login
    // console.log("Login button clicked");
  };

  const handleReciveClick = () => {
    // Логіка для обробки кліку на кнопку Login
    // console.log("Login button clicked");
  };

  const handleSendClick = () => {
    // Логіка для обробки кліку на кнопку Login
    // console.log("Login button clicked");
  };

  return (
    <main>
      <img className="background-balance--img" src={backgroundBalance} alt="background balance" />

      <section className="wrapper__menu">
        <Button className="" link="/settings" onClick={handleSettingsClick}>
          <img className="menu__settings" src={settings} alt="Menu" />
        </Button>

        <p className="menu__text">Main wallet</p>

        <Button className="" link="/notifications" onClick={handleNotificationClick}>
          <img className="menu__notification" src={menuNotification} alt="Notification" />
        </Button>
      </section>

      <section className="wrapper__balance">
        <h1 className="balance__title">$ 100.20</h1>
      </section>

      <section className="wrapper__transaction">
        <div className="transaction__receive">
          <Button className="" link="/recive" onClick={handleReciveClick}>
            <img className="transaction__img" src={receive} alt="Receive" />
          </Button>
          <span className="transaction__title">Receive</span>
        </div>

        <div className="transaction__send">
          <Button className="" link="/send" onClick={handleSendClick}>
            <img className="transaction__img" src={send} alt="Send" />
          </Button>
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
