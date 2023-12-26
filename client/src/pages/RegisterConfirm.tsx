import { FC, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { validateEmail, validatePassword } from "../utils/validators";
import { Field } from "../components/field";
import { FieldPasswordRegister } from "../components/field-password-register";

const RegisterConfirmPage: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [role, setRole] = useState("");
  const [checkbox, setCheckbox] = useState(false);

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isPasswordValid = password.trim() !== "" && password === passwordAgain;
    const isRoleValid = role.trim() !== "";
    const isCheckboxChecked = checkbox === true;

    setIsFormValid(isEmailValid && isPasswordValid && isRoleValid && isCheckboxChecked);
  }, [email, password, passwordAgain, role, checkbox]);

  console.log("email:", email);
  console.log("password:", password);
  console.log("passwordAgain:", passwordAgain);
  console.log("role:", role);
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
      const isValidPassword = validatePassword(value as string);

      if (isValidPassword) {
        setPassword(value as string);
      } else {
        setPassword("");
      }
    }

    if (name === "passwordAgain") {
      const isValidPassword = validatePassword(value as string);

      if (isValidPassword) {
        setPasswordAgain(value as string);
      } else {
        setPasswordAgain("");
      }
    }

    if (name === "role") {
      setRole(value as string);
    }

    if (name === "checkbox") {
      setCheckbox(value as boolean);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Виконайте логіку для відправки форми, якщо isFormValid === true
  };

  return (
    <main className="main__container">
      <form action="/auth/check" method="post" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Реєстрація користувача</h1>

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
            <FieldPasswordRegister
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
          Маєте акаунт?{" "}
          <NavLink to="/auth/login" className="link">
            Увійти
          </NavLink>
        </span>

        <span className="alert alert--disabled">Увага, помилка!</span>
      </form>
    </main>
  );
};

export default RegisterConfirmPage;
