import { useState } from "react";

export const REG_EXP_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const REG_EXP_PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const REG_EXP_AMOUNT = /^(?!0+(\.0+)?$)\d+(\.\d{1,2})?$/;
export const REG_EXP_CODE = /^\d{4}$/;

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
    setFields({ ...fields, [name]: value });
    const newErrors = { ...errors, [name]: validate(name, value) };
    setErrors(newErrors);

    // Перевірка помилок у всіх полях після кожного вводу
    const hasErrors = Object.values(newErrors).some((error) => error !== null);
    setDisabled(hasErrors);
  };

  const validate = (name: string, value: any) => {
    if ((name === "email" || name === "newEmail") && !REG_EXP_EMAIL.test(value)) {
      return "Please enter a valid email address";
    }

    if (
      (name === "password" || name === "oldPassword" || name === "newPassword") &&
      !REG_EXP_PASSWORD.test(value)
    ) {
      return "The password must be at least 8 characters long and contain both uppercase and lowercase letters, as well as numbers";
    }

    if (name === "amount" && !REG_EXP_AMOUNT.test(value)) {
      return "Please input a valid number above zero";
    }

    if (name === "code" && !REG_EXP_CODE.test(value)) {
      return "Enter a four-digit number";
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

    // Викликаємо checkDisabled після валідації всіх полів
    checkDisabled();
  };

  const checkDisabled = () => {
    let isDisabled = false;

    // Перевірка наявності помилок у будь-якому з полів
    Object.keys(errors).forEach((name) => {
      if (errors[name] !== null) {
        isDisabled = true;
      }
    });

    // Перевірка наявності значення у всіх полях
    Object.keys(fields).forEach((name) => {
      if (fields[name] === undefined || fields[name] === "") {
        isDisabled = true;
      }
    });

    setDisabled(isDisabled);
  };

  const setError = (name: string, error: string | null) => {
    setErrors({ ...errors, [name]: error });
  };

  const setAlert = (status: string, text?: string) => {
    setAlertStatus(status);
    setAlertText(text || "");
  };

  return {
    fields,
    errors,
    disabled,
    change,
    validateAll,
  };
};

export default useForm;
