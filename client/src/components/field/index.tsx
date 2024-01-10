import { FC, Fragment, useEffect, useRef, ChangeEvent } from "react";
import useForm from "../../script/form";

import "./style.css";

interface FieldProps {
  type: string;
  name: string;
  label?: string;
  placeholder: string;
  value: any;
  onChange: (name: string, value: string) => void;
}

export const Field: FC<FieldProps> = ({ type, name, placeholder, label }) => {
  const { errors, change } = useForm();

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current?.focus(); // Фокус на інпуті email після завантаження
    }
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log(`Поле ${name} було змінено на ${value}`);

    change(name, value);
  };

  return (
    <Fragment>
      <div className="field">
        <label
          htmlFor={name}
          className={`field__label field__error ${errors[name] ? "field__error--active" : ""}`}
        >
          {label}
        </label>
        <input
          className={`field__input validation ${errors[name] ? "validation--active" : ""}`}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={handleInput}
          ref={inputRef}
        />
      </div>
      <span className={`form__error ${errors[name] ? "form__error--active" : ""}`} data-name={name}>
        {errors[name]}
      </span>
    </Fragment>
  );
};
