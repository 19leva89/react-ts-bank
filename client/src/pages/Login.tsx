import { FC } from "react";
import { NavLink } from "react-router-dom";
import { REQUEST_ACTION_TYPE } from "../utils/requestReducer";

import { Field } from "../components/field";
import { FieldPassword } from "../components/field-password";
import { ButtonBack } from "../components/button-back";
import { Alert, Loader } from "../components/load";

import useLoginContainer from "../containers/login";

const LoginPage: FC = () => {
  const { isFormValid, requestState, handleInput, handleSubmit } = useLoginContainer();

  return (
    <main className="main__container">
      {requestState.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}

      <ButtonBack />

      <form action="" method="" className="form__container" onSubmit={handleSubmit}>
        <h1 className="form__title">Login</h1>

        <p className="form__text">Select login method</p>

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

          <div className="form__item">
            <FieldPassword
              label="Password"
              name="password"
              placeholder="password"
              onPasswordChange={handleInput}
            />
          </div>
        </div>

        <div className="form__item">
          <span className="link__prefix">
            Forgot your password?
            <NavLink to="/recovery" className="link">
              <> </>Restore
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

        {requestState.status === REQUEST_ACTION_TYPE.ERROR && (
          <section className="form__item form__alert">
            <Alert status={requestState.status} message={requestState.message} />
          </section>
        )}
      </form>
    </main>
  );
};

export default LoginPage;
