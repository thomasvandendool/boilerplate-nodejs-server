import { BaseError } from "./base-error";
import { HttpStatusCode } from "./types";

export class ValidationError extends BaseError {
  public readonly description: string;
  public readonly fields: string[];
  constructor(
    description = `Request validation error`,
    fields: string[],
    statusCode = HttpStatusCode.BAD_REQUEST,
    isOperational = true
  ) {
    super(ValidationError.name, description, statusCode, isOperational);
    this.description = description;
    this.fields = fields;

    Error.captureStackTrace(this, ValidationError);
  }
}
