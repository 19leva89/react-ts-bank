import { FC } from "react";
import { Button } from "../components/button";
import background from "./../img/background.png";
import backgroundSafe from "./../img/background-safe.png";

const WelcomePage: FC = () => {
  return (
    <main>
      <img className="background--img" src={background} alt="Background" />

      <section className="wrapper">
        <h1 className="wrapper__title">Hello!</h1>
        <p className="wrapper__text">Welcome to bank app</p>
        <img className="background-safe--img" src={backgroundSafe} alt="Background safe" />
      </section>

      <div className="wrapper__button">
        <Button className="button button__primary" link="/register">
          <span className="button--name">Register</span>
        </Button>

        <Button className="button button__transparent" link="/login">
          <span className="button--name">Login</span>
        </Button>
      </div>
    </main>
  );
};

export default WelcomePage;
