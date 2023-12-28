import { FC, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { validateEmail } from "../utils/validators";
import { Field } from "../components/field";
import { FieldPasswordLogin } from "../components/field-password-login";
import { ButtonBack } from "../components/button-back";

const LoginPage: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  // console.log("email:", email);
  // console.log("password:", password);

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

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Логіка для відправки форми, якщо isFormValid === true
  };

  return (
    <main className="main__container">
      <ButtonBack />

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Login</h1>

        <p className="form__text">Select login method</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="email"
              name="email"
              placeholder="Електронна пошта"
              label="Email"
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

        <div className="form__item">
          <span className="link__prefix">
            Forgot your password?
            <NavLink to="/recovery" className="link">
              <> </>Restore
            </NavLink>
          </span>
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Continue
        </button>

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>
    </main>
  );
};

export default LoginPage;
