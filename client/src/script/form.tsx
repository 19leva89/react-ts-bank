import { useEffect, useState } from "react";

export const REG_EXP_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const REG_EXP_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const REG_EXP_AMOUNT = /^(?!0+(\.0+)?$)\d+(\.\d{1,2})?$/;
export const REG_EXP_CODE = /^\d{0,4}$/;

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

    if (name === "amount" && !REG_EXP_AMOUNT.test(value)) {
      return "NEW Введіть коректне число більше нуля";
    }

    if (name === "code" && !REG_EXP_AMOUNT.test(value)) {
      return "NEW Введіть число з чотирьох цифр";
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

  useEffect(() => {
    console.log("Disabled on form:", disabled);
  }, [disabled]);

  return {
    fields,
    errors,
    setError,
    disabled,
    setDisabled,
    change,
    validate,
    validateAll,
    alertStatus,
    alertText,
    setAlert,
  };
};

export default useForm;
