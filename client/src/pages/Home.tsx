import { FC, useState } from "react";
import { Button } from "../components/button";
import background from "./../img/background.png";
import backgroundSafe from "./../img/background-safe.png";

const WelcomePage: FC = () => {
  const [clickInfo, setClickInfo] = useState("");
  console.log(clickInfo);

  const handleRegisterClick = () => {
    // Логіка для обробки кліку на кнопку Register
    setClickInfo("Register button clicked");
  };

  const handleLoginClick = () => {
    // Логіка для обробки кліку на кнопку Login
    setClickInfo("Login button clicked");
  };

  return (
    <main>
      <img className="background-img" src={background} alt="Background" />

      <section className="wrapper">
        <h1 className="wrapper__title">Hello!</h1>
        <p className="wrapper__text">Welcome to bank app</p>
        <img className="background-safe" src={backgroundSafe} alt="Background safe" />
      </section>

      <Button
        name="Register"
        className="button button__register"
        href="/register"
        onClick={handleRegisterClick}
      />
      <Button
        name="Login"
        className="button button__login"
        href="/login"
        onClick={handleLoginClick}
      />
    </main>
  );
};

export default WelcomePage;
