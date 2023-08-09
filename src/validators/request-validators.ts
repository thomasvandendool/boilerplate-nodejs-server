import { Request } from "express";
import { ZodTypeDef, z } from "zod";
import { ErrorMessageOptions, generateErrorMessage } from "zod-error";
import { ValidationError } from "../errors/validation-error";

const options: ErrorMessageOptions = {
    transform: ({ errorMessage, index }) => `#${index + 1}: ${errorMessage}`,
};
const toFields = (errorMessage: string) => errorMessage.split("#").slice(1);

export const validateBody = <O, D extends ZodTypeDef>(
    schema: z.ZodSchema<O, D>,
    req: Request
) => {
    const body = req.body;
    const validated = schema.safeParse(body);
    if (!validated.success) {
        const errorMessage = generateErrorMessage(validated.error.issues, options);

        throw new ValidationError(
            "Request body validation error",
            toFields(errorMessage)
        );
    }
    return validated.data;
};

export const validateParams = <O, D extends ZodTypeDef>(
    schema: z.ZodSchema<O, D>,
    req: Request
) => {
    const params = req.params;
    const validated = schema.safeParse(params);
    if (!validated.success) {
        const errorMessage = generateErrorMessage(validated.error.issues, options);

        throw new ValidationError(
            "Request parameter validation error",
            toFields(errorMessage)
        );
    }
    return validated.data;
};

export const validateQuery = <O, D extends ZodTypeDef>(
    schema: z.ZodSchema<O, D>,
    req: Request
) => {
    const query = req.query;
    const validated = schema.safeParse(query);
    if (!validated.success) {
        const errorMessage = generateErrorMessage(validated.error.issues, options);

        throw new ValidationError(
            "Request query string validation error",
            toFields(errorMessage)
        );
    }
    return validated.data;
};
