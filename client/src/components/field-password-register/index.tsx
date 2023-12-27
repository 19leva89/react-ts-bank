import { FC, Fragment, useState, ChangeEvent } from "react";
import { validatePassword } from "../../utils/validators";
import "./style.css";

type FieldPasswordRegisterProps = {
  label: string;
  onPassChangeReg: (name: string, value: string) => void;
  onPassChangeAgainReg: (name: string, value: string) => void;
};

export const FieldPasswordRegister: FC<FieldPasswordRegisterProps> = ({
  label,
  onPassChangeReg,
  onPassChangeAgainReg,
}) => {
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const [error, setError] = useState("");
  const [errorAgain, setErrorAgain] = useState("");

  const toggleIcon = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleIconAgain = () => {
    setShowPasswordAgain((prevState) => !prevState);
  };

  const handleInputPas = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log(`Поле ${name} було змінено на ${value}`);

    setPassword(value.toString());

    const isValidPassword = validatePassword(value); // Перевірка на валідний пароль
    if (!isValidPassword) {
      setError(
        "Пароль повинен бути мінімум 8 символів у довжину і містити малі та великі латинські літери, а також цифри"
      );
    } else {
      setError("");
    }

    onPassChangeReg(name, value);
  };

  const handleInputPasAgain = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log(`Поле ${name} було змінено на ${value}`);

    setPasswordAgain(value.toString());

    if (value !== password) {
      setErrorAgain("Паролі не співпадають");
    } else {
      setErrorAgain("");
    }

    onPassChangeAgainReg(name, value);
  };

  return (
    <Fragment>
      <Fragment>
        <div className="field field--password">
          <label htmlFor="password" className="field__label">
            {label}
          </label>

          <div className="field__wrapper">
            <input
              className={`field__input validation ${error ? "validation--active" : ""}`}
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              onChange={handleInputPas}
            />
            <span className={`field__icon ${showPassword ? "show" : ""}`} onClick={toggleIcon} />
          </div>
        </div>

        <span className={`form__error ${error ? "form__error--active" : ""}`} data-name="password">
          {error}
        </span>
      </Fragment>

      <Fragment>
        <div className="field field--password">
          <div className="field__wrapper">
            <input
              className={`field__input validation ${errorAgain ? "validation--active" : ""}`}
              name="passwordAgain"
              type={showPasswordAgain ? "text" : "password"}
              placeholder="Пароль ще раз"
              onChange={handleInputPasAgain}
            />
            <span
              className={`field__icon ${showPasswordAgain ? "show" : ""}`}
              onClick={toggleIconAgain}
            />
          </div>
        </div>

        <span
          className={`form__error ${errorAgain ? "form__error--active" : ""}`}
          data-name="passwordAgain"
        >
          {errorAgain}
        </span>
      </Fragment>
    </Fragment>
  );
};
