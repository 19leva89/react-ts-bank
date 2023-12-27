import { useState, useEffect, FC, SetStateAction } from "react";
import { validateEmail } from "../utils/validators";
import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";

const RecoveryPage: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";

    setIsFormValid(isEmailValid);
  }, [email]);

  console.log("email:", email);

  const handleInput = (name: string, value: SetStateAction<string>) => {
    if (name === "email") {
      const isValidEmail = validateEmail(value as string);

      if (isValidEmail) {
        setEmail(value as string);
      } else {
        setEmail("");
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

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Recover password</h1>

        <p className="form__text">Choose a recovery method</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="email"
              name="email"
              placeholder="Електронна пошта"
              label="Email"
              onEmailChange={handleInput}
            />
          </div>
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Send code
        </button>

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>
    </main>
  );
};

export default RecoveryPage;
