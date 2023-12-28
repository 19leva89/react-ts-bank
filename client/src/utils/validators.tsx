export const validateEmail = (email: string): boolean => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
};

export const validateCode = (code: string): boolean => {
  return /^\d{4}$/.test(code);
};

export const validateSum = (sum: string): boolean => {
  return /^(?!0+(\.0+)?$)\d+(\.\d{1,2})?$/.test(sum);
};
