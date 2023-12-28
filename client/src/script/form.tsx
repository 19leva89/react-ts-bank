export const REG_EXP_EMAIL = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
export const REG_EXP_PASSWORD = new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/);

interface FieldError {
  [key: string]: string | null;
}

interface FieldValue {
  [key: string]: any;
}

export class Form {
  FIELD_NAME: Record<string, string> = {};
  FIELD_ERROR: FieldError = {};
  value: FieldValue = {};
  error: FieldError = {};
  disabled = true;

  change = (name: string, value: any): void => {
    const error = this.validate(name, value);
    this.value[name] = value;

    if (error) {
      this.setError(name, error);
    } else {
      this.setError(name, null);
      delete this.error[name];
    }

    this.checkDisabled();
  };

  setError = (name: string, error: string | null): void => {
    const span = document.querySelector(`.form__error[name="${name}"]`);
    const field = document.querySelector(`.validation[name="${name}"]`) as HTMLElement | null;

    if (span) {
      span.classList.toggle("form__error--active", Boolean(error));
      span.textContent = error || "";
    }

    if (field) {
      field.classList.toggle("validation--active", Boolean(error));
    }
  };

  checkDisabled = (): void => {
    let disabled = false;

    Object.values(this.FIELD_NAME).forEach((name) => {
      if (this.error[name] || this.value[name] === undefined) {
        disabled = true;
      }
    });

    const el = document.querySelector(".button");

    if (el) {
      el.classList.toggle("button--disabled", Boolean(disabled));
    }

    this.disabled = disabled;
  };

  validateAll = (): void => {
    Object.values(this.FIELD_NAME).forEach((name) => {
      const error = this.validate(name, this.value[name]);

      if (error) {
        this.setError(name, error);
      }
    });
  };

  validate = (name: string, value: any): string | null => {
    // Add your validation logic here
    // Example:
    if (name === "email" && !REG_EXP_EMAIL.test(value)) {
      return "Invalid email format";
    }

    if (name === "password" && !REG_EXP_PASSWORD.test(value)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long";
    }

    return null;
  };

  setAlert = (status: string, text?: string): void => {
    const el = document.querySelector(".alert") as HTMLElement | null;

    if (el) {
      if (status === "progress") {
        el.classList.add("alert--progress");
      } else if (status === "success") {
        el.classList.add("alert--success");
      } else if (status === "error") {
        el.classList.add("alert--error");
      } else {
        el.classList.add("alert--disabled");
      }

      if (text) {
        el.textContent = text;
      }
    }
  };
}
