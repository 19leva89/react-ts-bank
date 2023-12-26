import { FC } from "react";
import { Button } from "../components/button";
import background from "./../img/background.png";
import backgroundSafe from "./../img/background-safe.png";

const WelcomePage: FC = () => {
  return (
    <main>
      <img className="background-img" src={background} alt="Background" />

      <section className="wrapper">
        <h1 className="wrapper__title">Hello!</h1>
        <p className="wrapper__text">Welcome to bank app</p>

        <img className="background-safe" src={backgroundSafe} alt="Background safe" />

        <Button name="Register" className="button button__register" onClick={undefined} />
        <Button name="Login" className="button button__login" onClick={undefined} />
      </section>
    </main>
  );
};

export default WelcomePage;
