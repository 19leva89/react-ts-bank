import { FC, useState, useEffect, useContext } from "react";
import { validateCode } from "../utils/validators";
import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import { getTokenSession, saveSession } from "../script/session";

const RegisterConfirmPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
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

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isFormValid && authContext) {
      const token = getTokenSession();
      const userData = {
        code: Number(code),
        token: token,
      };

      try {
        const res = await fetch("http://localhost:4000/register-confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        const data = await res.json();
        console.log("Data from server:", data);

        if (res.ok) {
          saveSession(data.session);

          const { token, user } = data.session;
          authContext.update(token, user);

          navigate("/balance");
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

      <form action="/check" method="post" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Confirm account</h1>

        <p className="form__text">Write the code you received</p>

        <div className="form">
          <div className="form__item">
            <Field
              type="code"
              name="code"
              placeholder="1234"
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
