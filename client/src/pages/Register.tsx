import { FC, useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Session } from "../class/session";
import { validateEmail, validatePassword } from "../utils/validators";
import { AuthContext } from "../utils/AuthProvider";

import { Field } from "../components/field";
import { FieldPasswordRegister } from "../components/field-password-register";
import { ButtonBack } from "../components/button-back";

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const isEmailValid = email.trim() !== "";
    const isPasswordValid = password.trim() !== "";

    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  // console.log("email:", email);
  // console.log("password:", password);

  const handleInput = (name: string, value: string | boolean) => {
    if (name === "email") {
      const isValidEmail = validateEmail(value as string);

      if (isValidEmail) {
        setEmail(value as string);
      } else {
        setEmail("");
      }
    }

    if (name === "password") {
      const isValidPassword = validatePassword(value as string);

      if (isValidPassword) {
        setPassword(value as string);
      } else {
        setPassword("");
      }
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isFormValid && authContext) {
      const userData = {
        email: email,
        isConfirm: false,
      };
      const newSession = Session.create(userData);
      const token = newSession.token;

      try {
        const response = await fetch("http://localhost:4000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          authContext.login(token, userData);
          navigate("/register-confirm");
        } else {
          // Обробити помилку від сервера
        }
      } catch (error) {
        // Обробити помилку від fetch
      }
    } else {
      navigate("/");
    }
  };

  return (
    <main className="main__container">
      <ButtonBack />

      <form action="/auth/check" method="post" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Register</h1>

        <p className="form__text">Choose a registration method</p>

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
            <FieldPasswordRegister label="Password" onPassChangeReg={handleInput} />
          </div>
        </div>

        <div className="form__item">
          <span className="link__prefix">
            Already have an account?
            <NavLink to="/login" className="link">
              <> </>Login
            </NavLink>
          </span>
        </div>

        <button
          className={`button button__primary ${isFormValid ? "" : "button--disabled"}`}
          type="submit"
          disabled={!isFormValid}
        >
          Continue
        </button>

        <div className="form__item">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>
    </main>
  );
};

export default RegisterPage;
