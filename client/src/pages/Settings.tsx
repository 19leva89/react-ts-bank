import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthProvider";
import { validateEmail } from "../utils/validators";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { FieldPasswordLogin } from "../components/field-password-login";
import { Divider } from "../components/divider";

const SettingsPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  const handleInput = (name: string, value: string | boolean) => {
    if (name === "email") {
      const isValidEmail = validateEmail(value as string);

      if (isValidEmail) {
        setEmail(value as string);
      } else {
        setEmail("");
      }
    }

    if (name === "password") {
      setPassword(value as string);
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  return (
    <main className="main__container">
      <ButtonBack />

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Settings</h1>

        <p className="form__text">Change email</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="email"
              name="emailNew"
              placeholder="Електронна пошта"
              label="New email"
              onEmailChange={handleInput}
            />
          </div>

          <div className="form__item">
            <FieldPasswordLogin
              label="Password"
              name="password"
              placeholder="Пароль"
              onPasswordChangeLog={handleInput}
            />
          </div>
        </div>

        <button
          className={`button button__transparent ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Save Email
        </button>

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>

      <Divider />

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <p className="form__text">Change password</p>

        <div className="form">
          <div className="form__item">
            <FieldPasswordLogin
              label="Old password"
              name="password"
              placeholder="Пароль"
              onPasswordChangeLog={handleInput}
            />
          </div>

          <div className="form__item">
            <FieldPasswordLogin
              label="New password"
              name="password"
              placeholder="Пароль"
              onPasswordChangeLog={handleInput}
            />
          </div>
        </div>

        <button
          className={`button button__transparent ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Save Password
        </button>

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>

      <Divider />

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <button
          className={`button button__transparent ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Logout
        </button>

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>
    </main>
  );
};

export default SettingsPage;
