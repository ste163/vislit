import { ZodError } from "zod";

export default function handleError(error: any | Error): Error {
  console.error(error);
  if (error instanceof ZodError)
    return new Error("Request does not match schema");
  return error;
}
