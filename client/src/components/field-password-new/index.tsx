import { FC, Fragment, useState, ChangeEvent } from "react";
import "./style.css";

type FieldPasswordNewProps = {
  name: string;
  placeholder: string;
  label: string;
  onPasswordNewChangeLog: (name: string, value: string) => void;
};

export const FieldPasswordNew: FC<FieldPasswordNewProps> = ({
  name,
  placeholder,
  label,
  onPasswordNewChangeLog,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleIcon = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log(`Поле ${name} було змінено на ${value}`);

    if (name === "newPassword") {
      setPassword(value);
    }

    onPasswordNewChangeLog(name, value);
  };

  return (
    <Fragment>
      <div className="field field--password">
        <label htmlFor="password" className="field__label">
          {label}
        </label>

        <div className="field__wrapper">
          <input
            className="field__input validation"
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            onChange={handleInput}
          />
          <span className={`field__icon ${showPassword ? "show" : ""}`} onClick={toggleIcon} />
        </div>
      </div>
    </Fragment>
  );
};
