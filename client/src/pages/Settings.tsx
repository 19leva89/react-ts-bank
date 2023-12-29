import { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/AuthProvider";
import { validateEmail } from "../utils/validators";

import { ButtonBack } from "../components/button-back";
import { Field } from "../components/field";
import { FieldPasswordLogin } from "../components/field-password-login";
import { FieldPasswordRenew } from "../components/field-password-renew";
import { Divider } from "../components/divider";

const SettingsPage: FC = () => {
  const authContext = useContext(AuthContext);
  const [isFormEmailValid, setIsFormEmailValid] = useState(false);
  const [isFormPasswordEmailValid, setIsFormPasswordEmailValid] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const isNewEmailValid = newEmail.trim() !== "";
    const isPasswordValid = password.trim() !== "";
    const isNewPasswordValid = newPassword.trim() !== "";

    setIsFormEmailValid(isNewEmailValid && isPasswordValid);

    setIsFormPasswordEmailValid(isPasswordValid && isNewPasswordValid);
  }, [newEmail, password, newPassword]);

  const handleInputChangeEmail = (name: string, value: string | boolean) => {
    if (name === "newEmail") {
      const isValidEmail = validateEmail(value as string);

      if (isValidEmail) {
        setNewEmail(value as string);
      } else {
        setNewEmail("");
      }
    }

    if (name === "password") {
      setPassword(value as string);
    }
  };

  const handleInputChangePassword = (name: string, value: string | boolean) => {
    if (name === "password") {
      setPassword(value as string);
    }

    if (name === "newPassword") {
      setNewPassword(value as string);
    }
  };

  const handleSubmitChangeEmail = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isFormEmailValid && authContext) {
      const storedSessionAuth = localStorage.getItem("sessionAuth");
      const sessionAuth = storedSessionAuth ? JSON.parse(storedSessionAuth) : null;
      const userId = sessionAuth?.user?.id;

      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const userData = {
        id: userId,
        newEmail: newEmail,
        password: password,
      };

      try {
        const res = await fetch("http://localhost:4000/user-new-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await res.json();
        // console.log("Data from server:", data);

        if (res.ok) {
          const token: string | null = authContext.authState.token;
          const updatedToken: string = token !== null ? token : "";
          authContext.update(updatedToken, data.user.email);

          // Отримання поточних даних з localStorage
          const storedSessionAuth = localStorage.getItem("sessionAuth");
          const sessionAuth = storedSessionAuth ? JSON.parse(storedSessionAuth) : null;

          // Оновлення email у збережених даних
          if (sessionAuth) {
            sessionAuth.user.email = data.user.email;

            // Збереження оновлених даних у localStorage
            localStorage.setItem("sessionAuth", JSON.stringify(sessionAuth));
          }
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

  const handleSubmitChangePassword = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  const handleSubmitLogout = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
  };

  return (
    <main className="main__container">
      <div className="menu__container">
        <ButtonBack />
        <h1 className="form__title">Settings</h1>
        <div className="stub"></div>
      </div>

      <form action="" method="" className="form__container" onSubmit={handleSubmitChangeEmail}>
        <p className="form__text--big">Change email</p>

        <div className="form form--slim">
          <div className="form__item form__item--slim">
            <Field
              type="email"
              name="newEmail"
              placeholder="Email"
              label="New email"
              onNewEmailChange={handleInputChangeEmail}
            />
          </div>

          <div className="form__item form__item--slim">
            <FieldPasswordLogin
              label="Password"
              name="password"
              placeholder="Password"
              onPasswordChangeLog={handleInputChangeEmail}
            />
          </div>
        </div>

        <button
          className={`button button__transparent button__slim ${
            isFormEmailValid ? "" : "button--disabled"
          }`}
          type="submit"
          disabled={!isFormEmailValid}
        >
          Save Email
        </button>

        <div className="form__item form__item--slim">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>

      <Divider />

      <form action="" method="" className="form__container" onSubmit={handleSubmitChangePassword}>
        <p className="form__text--big">Change password</p>

        <div className="form form--slim">
          <div className="form__item form__item--slim">
            <FieldPasswordLogin
              label="Old password"
              name="password"
              placeholder="Password"
              onPasswordChangeLog={handleInputChangePassword}
            />
          </div>

          <div className="form__item form__item--slim">
            <FieldPasswordRenew
              label="New password"
              name="newPassword"
              placeholder="Password"
              onPasswordNewChangeLog={handleInputChangePassword}
            />
          </div>
        </div>

        <button
          className={`button button__transparent button__slim ${
            isFormPasswordEmailValid ? "" : "button--disabled"
          }`}
          type="submit"
          disabled={!isFormPasswordEmailValid}
        >
          Save Password
        </button>

        <div className="form__item form__item--slim">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>

      <Divider />

      <form action="" method="" className="form__container" onSubmit={handleSubmitLogout}>
        <button className={"button button__warning button__slim"} type="submit">
          Logout
        </button>

        <div className="form__item form__item--slim">
          <span className="alert alert--disabled">Увага, помилка!</span>
        </div>
      </form>
    </main>
  );
};

export default SettingsPage;
