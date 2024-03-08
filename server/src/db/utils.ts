export enum PgErrorCodes {
  duplicateRecord = "23505",
}

interface DbDuplicateRecordError extends Error {
  code: PgErrorCodes.duplicateRecord;
}

export const isDbDuplicateRecordError = (
  error: any
): error is DbDuplicateRecordError =>
  error &&
  typeof error === "object" &&
  "code" in error &&
  error.code === PgErrorCodes.duplicateRecord;
