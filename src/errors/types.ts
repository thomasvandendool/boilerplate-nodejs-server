/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum HttpStatusCode {
  BAD_REQUEST = 400,
  NOT_AUTHORIZED = 403,
  NOT_AUTHENTICATED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
}

export enum HttpErrorMessage {
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  NOT_AUTHORIZED = "NOT_AUTHORIZED",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
  FORBIDDEN = "FORBIDDEN",
}
