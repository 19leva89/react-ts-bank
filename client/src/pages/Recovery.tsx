import { useState, useEffect, FC, SetStateAction, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authProvider";
import { validateEmail } from "../utils/validators";
import { saveSession } from "../script/session";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";

const RecoveryPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";

    setIsFormValid(isEmailValid);
  }, [email]);

  // console.log("email:", email);

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

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isFormValid && authContext) {
      const userData = {
        email: email,
      };

      try {
        const res = await fetch("http://localhost:4000/recovery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await res.json();
        // console.log("Data from server:", data);

        if (res.ok) {
          saveSession(data.session);
          navigate("/recovery-confirm");
        } else {
          if (data && data.message) {
            // Обробка повідомлення про помилку з сервера
            console.error("Server error:", data.message);
          } else {
            // Обробка загальної помилки від сервера
            console.error("Server error:", res.statusText);
          }
        }
      } catch (err) {
        // Обробити помилку від fetch
        console.error("Fetch error:", err);
      }
    }
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
              placeholder="example@mail.com"
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
