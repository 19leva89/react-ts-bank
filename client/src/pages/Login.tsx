import { FC, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { validateEmail } from "../utils/validators";
import { Field } from "../components/field";
import { FieldPasswordLogin } from "../components/field-password-login";

const LoginPage: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password, checkbox]);

  console.log("email:", email);
  console.log("password:", password);
  console.log("checkbox:", checkbox);

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

    if (name === "checkbox") {
      setCheckbox(value as boolean);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Логіка для відправки форми, якщо isFormValid === true
  };

  return (
    <main className="main__container">
      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Вхід</h1>

        <div className="form">
          <div className="form__item">
            <Field
              type="email"
              name="email"
              placeholder="Електронна пошта"
              onEmailChange={handleInput}
            />
          </div>

          <div className="form__item">
            <FieldPasswordLogin
              name="password"
              placeholder="Пароль"
              onPasswordChangeLog={handleInput}
            />
          </div>
        </div>

        <button
          className={`button ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Увійти
        </button>

        <span className="link__prefix">
          Забули пароль?
          <NavLink to="/auth/recovery" className="link">
            Відновити
          </NavLink>
        </span>

        <span className="alert alert--disabled">Увага, помилка!</span>
      </form>
    </main>
  );
};

export default LoginPage;
