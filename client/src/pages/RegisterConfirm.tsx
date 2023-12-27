import { FC, useState, useEffect } from "react";
import { validateCode } from "../utils/validators";
import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";

const RegisterConfirmPage: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const isPasswordValid = code.trim() !== "";

    setIsFormValid(isPasswordValid);
  }, [code]);

  console.log("code:", code);

  const handleInput = (name: string, value: string | boolean) => {
    if (name === "code") {
      const isValidCode = validateCode(value as string);

      if (isValidCode) {
        setCode(value as string);
      } else {
        setCode("");
      }
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Виконайте логіку для відправки форми, якщо isFormValid === true
  };

  return (
    <main className="main__container">
      <ButtonBack />

      <form action="/check" method="post" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Confirm account</h1>

        <p className="form__text">Write the code you received</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="code"
              name="code"
              placeholder="123456"
              label="Code"
              onCodeChange={handleInput}
            />
          </div>
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Confirm
        </button>

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>
    </main>
  );
};

export default RegisterConfirmPage;
