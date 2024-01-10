import { FC, Fragment, useState, ChangeEvent } from "react";
import useForm from "../../script/form";

import "./style.css";

interface FieldPasswordProps {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  value: any;
  onChange: (name: string, value: string) => void;
}

export const FieldPassword: FC<FieldPasswordProps> = ({ name, placeholder, label }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { errors, change } = useForm();

  const toggleIcon = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log(`Поле ${name} було змінено на ${value}`);

    // const error = validate(name, value);
    // setError(name, error || "");

    change(name, value);
  };

  return (
    <Fragment>
      <div className="field field--password">
        <label
          htmlFor="password"
          className={`field__label field__error ${errors[name] ? "field__error--active" : ""}`}
        >
          {label}
        </label>

        <div className="field__wrapper">
          <input
            className={`field__input validation ${errors[name] ? "validation--active" : ""}`}
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            onChange={handleInput}
          />
          <span className={`field__icon ${showPassword ? "show" : ""}`} onClick={toggleIcon} />
        </div>
      </div>

      <span
        className={`form__error ${errors[name] ? "form__error--active" : ""}`}
        data-name="password"
      >
        {errors[name]}
      </span>
    </Fragment>
  );
};
