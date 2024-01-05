import { FC, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/authProvider";
import { validateCode } from "../utils/validators";
import { saveSession } from "../script/session";

import { Field } from "../components/field";
import { ButtonBack } from "../components/button-back";
import { FieldPasswordRegister } from "../components/field-password-register";

const RecoveryConfirmPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [isFormValid, setIsFormValid] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isCodeValid = code.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsFormValid(isCodeValid && isPasswordValid);
  }, [code, password]);

  // console.log("code:", code);
  // console.log("password:", password);

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

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isFormValid && authContext) {
      const userData = {
        code: Number(code),
        password: password,
      };
      console.log("recovery-confirm userData:", userData);

      try {
        const res = await fetch("http://localhost:4000/recovery-confirm", {
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
          authContext.recovery(token, user);

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
