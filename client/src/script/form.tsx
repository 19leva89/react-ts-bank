import { useState } from "react";

export const REG_EXP_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const REG_EXP_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

interface Fields {
  [key: string]: any;
}

interface Errors {
  [key: string]: string | null;
}

const useForm = () => {
  const [fields, setFields] = useState<Fields>({});
  const [errors, setErrors] = useState<Errors>({});
  const [disabled, setDisabled] = useState<boolean>(true);
  const [alertStatus, setAlertStatus] = useState<string>("");
  const [alertText, setAlertText] = useState<string>("");

  const change = (name: string, value: any) => {
    const error = validate(name, value);
    setFields({ ...fields, [name]: value });

    if (error) {
      setErrors({ ...errors, [name]: error });
    } else {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }

    checkDisabled();
  };

  const setError = (name: string, error: string | null) => {
    setErrors({ ...errors, [name]: error });
  };

  const checkDisabled = () => {
    let isDisabled = false;

    Object.keys(fields).forEach((name) => {
      if (errors[name] !== null || fields[name] === undefined) {
        isDisabled = true;
      }
    });

    setDisabled(isDisabled);
  };

  const validate = (name: string, value: any) => {
    if (name === "email" && !REG_EXP_EMAIL.test(value)) {
      return "NEW Введіть коректне значення e-mail адреси";
    }

    if (name === "newEmail" && !REG_EXP_EMAIL.test(value)) {
      return "NEW Введіть коректне значення e-mail адреси";
    }

    if (name === "password" && !REG_EXP_PASSWORD.test(value)) {
      return "NEW Пароль повинен бути мінімум 8 символів у довжину і містити малі та великі латинські літери, а також цифри";
    }

    if (name === "newPassword" && !REG_EXP_PASSWORD.test(value)) {
      return "NEW Пароль повинен бути мінімум 8 символів у довжину і містити малі та великі латинські літери, а також цифри";
    }

    return null;
  };

  const validateAll = () => {
    Object.entries(fields).forEach(([name, value]) => {
      const error = validate(name, value);

      if (error) {
        setErrors({ ...errors, [name]: error });
      }
    });
  };

  const setAlert = (status: string, text?: string) => {
    setAlertStatus(status);
    setAlertText(text || "");
  };

  return {
    fields,
    errors,
    setError,
    disabled,
    change,
    validate,
    validateAll,
    alertStatus,
    alertText,
    setAlert,
  };
};

export default useForm;
