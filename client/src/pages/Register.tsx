import { FC, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validators";
import { Field } from "../components/field";
import { FieldPasswordRegister } from "../components/field-password-register";

const RegisterPage: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  console.log("email:", email);
  console.log("password:", password);

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
      const isValidPassword = validatePassword(value as string);

      if (isValidPassword) {
        setPassword(value as string);
      } else {
        setPassword("");
      }
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Виконайте логіку для відправки форми, якщо isFormValid === true
  };

  return (
    <main className="main__container">
      <form action="/auth/check" method="post" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Register</h1>

        <p className="form__text">Choose a registration method</p>

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
            <FieldPasswordRegister
              label="Password"
              onPassChangeReg={handleInput}
              onPassChangeAgainReg={handleInput}
            />
          </div>
        </div>

        <button
          className={`button ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Зареєструватися
        </button>

        <span className="link__prefix">
          Маєте акаунт?
          <NavLink to="/login" className="link">
            Увійти
          </NavLink>
        </span>

        <span className="alert alert--disabled">Увага, помилка!</span>
      </form>
    </main>
  );
};

export default RegisterPage;
