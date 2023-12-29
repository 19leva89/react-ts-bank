import { FC, Fragment, useEffect, useRef, useState, ChangeEvent } from "react";
import { validateCode, validateEmail, validateSum } from "../../utils/validators";
import "./style.css";

type FieldProps = {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  onEmailChange?: (name: string, value: string) => void;
  onNewEmailChange?: (name: string, value: string) => void;
  onSumChange?: (name: string, value: string) => void;
  onCodeChange?: (name: string, value: string) => void;
};

export const Field: FC<FieldProps> = ({
  type,
  name,
  placeholder,
  label,
  onEmailChange,
  onNewEmailChange,
  onSumChange,
  onCodeChange,
}) => {
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
        if (onEmailChange) {
          onEmailChange(name, value);
        }
      }
    }

    if (name === "newEmail") {
      const isValidEmail = validateEmail(value); // Перевірка на валідний email

      if (!isValidEmail) {
        setError("Введіть коректне значення e-mail адреси");
      } else {
        setError("");
        if (onNewEmailChange) {
          onNewEmailChange(name, value);
        }
      }
    }

    if (name === "sum") {
      const isValidSum = validateSum(value);

      if (!isValidSum) {
        setError("Введіть коректне число більше нуля");
      } else {
        setError("");
        if (onSumChange) {
          onSumChange(name, value);
        }
      }
    }

    if (name === "code") {
      const isValidCode = validateCode(value);

      if (!isValidCode) {
        setError("Введіть число з чотирьох цифр");
      } else {
        setError("");
        if (onCodeChange) {
          onCodeChange(name, value);
        }
      }
    }
  };

  return (
    <Fragment>
      <div className="field">
        <label
          htmlFor={name}
          className={`field__label field__error ${error ? "field__error--active" : ""}`}
        >
          {label}
        </label>
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
