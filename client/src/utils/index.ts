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
