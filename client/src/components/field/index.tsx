import { FC, Fragment, useEffect, useRef, useState, ChangeEvent } from "react";
import { validateEmail } from "../../utils/validators";
import "./style.css";

type FieldProps = {
  type: string;
  name: string;
  placeholder: string;
  onEmailChange: (name: string, value: string) => void;
};

export const Field: FC<FieldProps> = ({ type, name, placeholder, onEmailChange }) => {
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current?.focus(); // Фокус на інпуті email після завантаження
    }
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log(`Поле ${name} було змінено на ${value}`);

    if (name === "email") {
      const isValidEmail = validateEmail(value); // Перевірка на валідний email

      if (!isValidEmail) {
        setError("Введіть коректне значення e-mail адреси");
      } else {
        setError("");
      }
    }

    onEmailChange(name, value);
  };

  return (
    <Fragment>
      <div className="field">
        <input
          className={`field__input validation ${error ? "validation--active" : ""}`}
          name={name}
          type={type}
          placeholder={placeholder}
          onInput={handleInput}
          ref={inputRef}
        />
      </div>
      <span className={`form__error ${error ? "form__error--active" : ""}`} data-name={name}>
        {error}
      </span>
    </Fragment>
  );
};
