import { FC, Fragment, useState, ChangeEvent } from "react";
import { validatePassword } from "../../utils/validators";
import "./style.css";

type FieldPasswordRegisterProps = {
  label: string;
  onPassChangeReg: (name: string, value: string) => void;
};

export const FieldPasswordRegister: FC<FieldPasswordRegisterProps> = ({
  label,
  onPassChangeReg,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const toggleIcon = () => {
    setShowPassword((prevState) => !prevState);
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

  return (
    <Fragment>
      <div className="field field--password">
        <label
          htmlFor="password"
          className={`field__label field__error ${error ? "field__error--active" : ""}`}
        >
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
  );
};
