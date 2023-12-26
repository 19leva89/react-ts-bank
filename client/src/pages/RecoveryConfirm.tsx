import { useState, useEffect, FC, SetStateAction } from "react";
import { validateEmail } from "../utils/validators";
import { Field } from "../components/field";

const RecoveryConfirmPage: FC = () => {
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
      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Відновлення паролю</h1>

        <div className="form">
          <div className="form__item">
            <Field
              type="email"
              name="email"
              placeholder="Електронна пошта"
              onEmailChange={handleInput}
            />
          </div>
        </div>

        <button
          className={`button ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Відновити пароль
        </button>

        <span className="alert alert--disabled">Увага, помилка!</span>
      </form>
    </main>
  );
};

export default RecoveryConfirmPage;
