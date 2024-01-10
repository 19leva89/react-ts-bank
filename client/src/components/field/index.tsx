import { FC, Fragment, useEffect, useRef } from "react";

import "./style.css";

interface FieldProps {
  type: string;
  name: string;
  label?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export const Field: FC<FieldProps> = ({
  type,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current?.focus(); // Фокус на інпуті email після завантаження
    }
  }, []);

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
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <span className={`form__error ${error ? "form__error--active" : ""}`} data-name={name}>
        {error}
      </span>
    </Fragment>
  );
};
