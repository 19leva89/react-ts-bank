import { FC } from "react";
import { Button } from "../components/button";
import background from "./../img/background.png";
import backgroundSafe from "./../img/background-safe.png";

const WelcomePage: FC = () => {
  const handleRegisterClick = () => {
    // Логіка для обробки кліку на кнопку Register
    // console.log("Register button clicked");
  };

  const handleLoginClick = () => {
    // Логіка для обробки кліку на кнопку Login
    // console.log("Login button clicked");
  };

  return (
    <main>
      <img className="background--img" src={background} alt="Background" />

      <section className="wrapper">
        <h1 className="wrapper__title">Hello!</h1>
        <p className="wrapper__text">Welcome to bank app</p>
        <img className="background-safe--img" src={backgroundSafe} alt="Background safe" />
      </section>

      <div className="wrapper__button">
        <Button className="button button__primary" link="/register" onClick={handleRegisterClick}>
          <span className="button--name">Register</span>
        </Button>

        <Button className="button button__transparent" link="/login" onClick={handleLoginClick}>
          <span className="button--name">Login</span>
        </Button>
      </div>
    </main>
  );
};

export default WelcomePage;
