import { BaseError } from "./base-error";
import { HttpStatusCode } from "./types";
export class ApiError extends BaseError {
  public readonly description: string;
  constructor(
    description: string,
    statusCode = HttpStatusCode.INTERNAL_SERVER,
    isOperational = true
  ) {
    super(ApiError.name, description, statusCode, isOperational);
    this.description = description;

    Error.captureStackTrace(this, ApiError);
  }
}
