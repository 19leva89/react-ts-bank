import { FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "../class/session";
import { AuthContext } from "./../utils/AuthProvider";
import { Button } from "../components/button";
import background from "./../img/background.png";
import backgroundSafe from "./../img/background-safe.png";

const WelcomePage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleRegisterClick = () => {
    console.log("Register button clicked");

    if (authContext) {
      const userData = {
        email: "",
        isConfirm: false,
        id: "",
      };
      const newSession = Session.create(userData);
      const token = newSession.token;

      authContext.login(token, userData);

      navigate("/register");
    } else {
      navigate("/");
    }
  };

  const handleLoginClick = () => {
    // Логіка для обробки кліку на кнопку Login
    console.log("Login button clicked");

    if (authContext) {
      const userData = {
        email: "",
        isConfirm: false,
        id: "",
      };
      const newSession = Session.create(userData);
      const token = newSession.token;

      authContext.login(token, userData);

      navigate("/login");
    } else {
      navigate("/");
    }
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
        <Button
          name="Register"
          className="button button__primary"
          href="/register"
          onClick={handleRegisterClick}
        />
        <Button
          name="Login"
          className="button button__transparent"
          href="/login"
          onClick={handleLoginClick}
        />
      </div>
    </main>
  );
};

export default WelcomePage;
