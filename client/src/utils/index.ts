// Most popular upvoted Stack Overflow regex for testing email format validity
// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
export const validateEmail = (email: string) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(email).toLowerCase()
  );
};

// https://stackoverflow.com/questions/12090077/javascript-regular-expression-password-validation-having-special-characters
export const validatePassword = (password: string) => {
  return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
};

export const trimObjectStringValues = <T>(obj: any): T =>
  Object.keys(obj).reduce((accumulated, nextKey) => {
    const key = nextKey as keyof T;

    return {
      ...accumulated,
      [key]: typeof obj[key] == "string" ? obj[key].trim() : obj[key],
    };
  }, {} as T);

export enum HttpResponseCodes {
  Success = 200,
  Created = 201,
  BadRequest = 400,
  AlreadyExists = 409,
  TransformError = 418,
  ServerError = 500,
  AuthTokenExpired = 403,
}

export const MAX_INPUT_TEXT_LENGTH = 255;
