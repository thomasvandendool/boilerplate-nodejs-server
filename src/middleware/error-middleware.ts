import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error";
import { BaseError } from "../errors/base-error";
import { HttpError } from "../errors/http-error";
import { HttpStatusCode, HttpErrorMessage } from "../errors/types";
import { ValidationError } from "../errors/validation-error";

function isOperationalError(error: Error) {
    if (error instanceof BaseError) {
        return error.isOperational;
    }
    return false;
}

export const errorMiddleware = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const defaultServerErrorResponse = () =>
        res
            .status(HttpStatusCode.INTERNAL_SERVER)
            .json({ message: HttpErrorMessage.INTERNAL_SERVER_ERROR });

    if (
        error instanceof SyntaxError &&
        error.message.includes("Unexpected token")
    ) {
        console.error("Malformed JSON");
        return res.status(400).send({ error: "Malformed JSON" });
    } else {
        next();
    }

    if (!isOperationalError(error)) {
        console.error(
            `⚡️[NON OPERATIONAL ERROR] ${req.method} ${req.path} -> Description: \n`,
            error
        );
        next(HttpErrorMessage.INTERNAL_SERVER_ERROR);
    }

    if (error instanceof ValidationError) {
        console.error(
            `⚡️[ERROR] ${req.method} ${req.path} -> StatusCode: ${error.statusCode}, Description: \n`,
            error.description
        );
        console.log(error.fields);
        return res
            .status(error.statusCode)
            .json({ message: error.description, fields: error.fields });
    }

    if (error instanceof HttpError) {
        console.error(
            `⚡️[ERROR] ${req.method} ${req.path} -> StatusCode: ${error.statusCode}, Description: \n`,
            error.stack
        );
        return res.status(error.statusCode).json({ message: error.description });
    }

    if (error instanceof ApiError) {
        const statusText = `StatusCode: ${error.statusCode},`;
        console.error(
            `⚡️[ERROR] ${req.method} ${req.path} -> ${error.statusCode && statusText
            } Description: \n`,
            error.stack
        );
        return defaultServerErrorResponse();
    }
};

process.on("unhandledRejection", (error: Error) => {
    throw error;
});

process.on("uncaughtException", (error: Error) => {
    console.error(
        new Date().toUTCString() + " uncaughtException: ",
        error.message,
        "\n",
        error.stack
    );
    if (!isOperationalError(error)) {
        process.exit(1);
    }
});
