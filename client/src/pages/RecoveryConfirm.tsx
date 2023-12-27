import { FC, useState, useEffect } from "react";
import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { FieldPasswordRegister } from "../components/field-password-register";
import { validateCode } from "../utils/validators";

const RecoveryConfirmPage: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isCodeValid = code.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsFormValid(isCodeValid && isPasswordValid);
  }, [code, password]);

  console.log("code:", code);
  console.log("password:", password);

  const handleInput = (name: string, value: string | number) => {
    if (name === "code") {
      const isValidCode = validateCode(value as string);

      if (isValidCode) {
        setCode(value as string);
      } else {
        setCode("");
      }
    }

    if (name === "password") {
      setPassword(value as string);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Виконайте логіку для відправки форми, якщо isFormValid === true
  };

  return (
    <main className="main__container">
      <ButtonBack />

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Recover password</h1>

        <p className="form__text">Write the code you received</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="code"
              name="code"
              placeholder="Code"
              label="Code"
              onCodeChange={handleInput}
            />
          </div>

          <div className="form__item">
            <FieldPasswordRegister label="Password" onPassChangeReg={handleInput} />
          </div>
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Restore password
        </button>

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>
    </main>
  );
};

export default RecoveryConfirmPage;
