import { ZodError } from "zod";

export interface HttpError extends Error {
  statusCode: number;
  errors?: { field: string; message: string }[]; 
}

export const errorHandler = (
  statusCode: number,
  message: string | ZodError
): HttpError => {
  const error = new Error() as HttpError;
  error.statusCode = statusCode;

  if (message instanceof ZodError) {
    error.message = "Validation failed";
    error.errors = message.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  } else {
    error.message = message;
  }

  return error;
};
