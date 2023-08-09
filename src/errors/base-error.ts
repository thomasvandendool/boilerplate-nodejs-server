import { HttpStatusCode } from "./types";
export class BaseError extends Error {
  public readonly name: string;
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    description: string,
    statusCode: HttpStatusCode,
    isOperational: boolean
  ) {
    super(description);

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
