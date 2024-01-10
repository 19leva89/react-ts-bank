import { FC, Fragment, useState } from "react";

import "./style.css";

interface FieldPasswordProps {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export const FieldPassword: FC<FieldPasswordProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleIcon = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <Fragment>
      <div className="field field--password">
        <label
          htmlFor={name}
          className={`field__label field__error ${error ? "field__error--active" : ""}`}
        >
          {label}
        </label>

        <div className="field__wrapper">
          <input
            className={`field__input validation ${error ? "validation--active" : ""}`}
            type={showPassword ? "text" : "password"}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className={`field__icon ${showPassword ? "show" : ""}`} onClick={toggleIcon} />
        </div>
      </div>

      <span className={`form__error ${error ? "form__error--active" : ""}`} data-name={name}>
        {error}
      </span>
    </Fragment>
  );
};
