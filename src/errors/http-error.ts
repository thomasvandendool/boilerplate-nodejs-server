import { BaseError } from "./base-error";
import { HttpStatusCode } from "./types";

export class HttpError extends BaseError {
  public description: string;
  constructor(
    description: string,
    statusCode = HttpStatusCode.INTERNAL_SERVER
  ) {
    super(HttpError.name, description, statusCode, true);
    this.description = description;

    Error.captureStackTrace(this, HttpError);
  }
}
