import { CustomError } from "@src/Types";
import ApiResponse from "@utils/ApiResponse";
import { getEnv } from "@utils/getEnv";
import { Response } from "express";
import { AppError } from "./AppError";

/**
 * It typically sits at the top level of your Express application and is used as middleware
 * to catch and process errors that occur during the request-response cycle.
 * It captures errors that are thrown or passed to the next() function in middleware etc.
 */
class ErrorHandler {
  responseStream: Response;
  error: CustomError | AppError;

  constructor(responseStream: Response, error: CustomError | AppError) {
    this.responseStream = responseStream;
    this.error = error;
  }

  async handleError() {
    await this.logError();
    return (
      await this.checkForDatabaseErrorAndSendResponse() ||
      await this.crashIfUntrustedErrorOrSendResponse()
    );
  }

  async logError() {
    console.error(this.error, "error Logger");
  }

  async crashIfUntrustedErrorOrSendResponse() {
    if (this.error instanceof AppError) {
      return this.responseStream
          .status(this.error.statusCode)
          .send(errorResponseObj(this.error));
      /*
  ======= To Catch the Prisma Unique Constraint Errors from db (useful to catch if 3 or more fields are unique) =======
      */
      // if (this.error instanceof Prisma.PrismaClientKnownRequestError && this.error.code === 'P2002') {
      //   // Unique constraint violation error
      //   const modelName = this.error.meta?.modelName;
      //   const targetFields = this.error.meta?.target as [] || [];
      //   const errorMessage = `The ${targetFields.join(', ')} in ${modelName} must be unique`;
      //   return this.responseStream.status(400).send(ApiResponse.error(errorMessage, 400));
      // }
    } else {
      // crash the application
      this.error.statusCode = 500;
      if (getEnv("DEV_ENV") === "development") {
        return this.responseStream
            .status(500)
            .send(errorResponseObj(this.error));
      } else {
        this.error.message = "Internal Server Error";
        return this.responseStream
            .status(500)
            .send(errorResponseObj(this.error));
      }
    }
  }

  async checkForDatabaseErrorAndSendResponse() {
    return null;
  }
}

export default ErrorHandler;

/*
 * Generates an error response object based on the provided error.
 * Returns a different error response object depending on the development environment.
 */
function errorResponseObj(error: AppError | CustomError) {
  if (getEnv("DEV_ENV") === "development") {
    return {
      ...error,
      error: true,
      message: error.message,
      stack: error.stack,
      data: [],
    };
  } else {
    return ApiResponse.error(error.message, error.statusCode);
  }
}
