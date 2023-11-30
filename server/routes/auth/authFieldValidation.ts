import { LoginFormValues, RegisterFormValues } from "../../types";

// Most popular upvoted Stack Overflow regex for testing email format validity
// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
const validateEmail = (email: string) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(email).toLowerCase()
  );
};

// https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters
const validatePassword = (password: string) => {
  return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
};

const MAX_FIELD_LENGTH = 255;

export const validateLoginFields = ({
  usernameOrEmail,
  password,
}: LoginFormValues) => {
  if (usernameOrEmail.length > MAX_FIELD_LENGTH) {
    return "Email or username is too long";
  }

  if (password.length > MAX_FIELD_LENGTH) {
    return "Password does not meet requirements";
  }

  return null;
};

export const validateRegistrationFields = ({
  username,
  email,
  password,
}: RegisterFormValues) => {
  if (username.length > MAX_FIELD_LENGTH) {
    return "Username is too long";
  }

  if (email.length > MAX_FIELD_LENGTH || !validateEmail(email)) {
    return "Email address format is not valid";
  }

  if (password.length > MAX_FIELD_LENGTH || !validatePassword(password)) {
    return "Password does not meet requirements";
  }

  return null;
};
