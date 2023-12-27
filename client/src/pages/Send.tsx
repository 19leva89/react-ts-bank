import { FC, useState, useEffect } from "react";
import { validateEmail, validateSum } from "../utils/validators";
import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";

const SendPage: FC = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [sum, setSum] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isSumValid = parseFloat(sum as string) > 0;

    setIsFormValid(isEmailValid && isSumValid);
  }, [email, sum]);

  console.log("email:", email);
  console.log("sum:", sum);

  const handleInput = (name: string, value: string | number) => {
    if (name === "email") {
      const isValidEmail = validateEmail(value as string);

      if (isValidEmail) {
        setEmail(value as string);
      } else {
        setEmail("");
      }
    }

    if (name === "sum") {
      const isValidSum = validateSum(value as string);

      if (isValidSum) {
        setSum(value as string);
      } else {
        setSum("");
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
        <h1 className="form__title">Send</h1>

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

          <div className="form__item">
            <Field type="sum" name="sum" placeholder="$500" label="Sum" onSumChange={handleInput} />
          </div>
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Send
        </button>

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>
    </main>
  );
};

export default SendPage;
