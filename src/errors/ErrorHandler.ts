import { CustomError } from "@src/Types";
import ApiResponse from "@utils/ApiResponse";
import { getEnv } from "@utils/getEnv";
import { AppError } from "./AppError";
import { Response } from "express";

/**
 * It typically sits at the top level of your Express application and is used as middleware
 * to catch and process errors that occur during the request-response cycle.
 * It captures errors that are thrown or passed to the next() function in middleware etc.
 */
class ErrorHandler {
  responseStream: Response;
  error: CustomError | AppError;

  constructor(responseStream: Response, error: CustomError) {
    this.responseStream = responseStream;
    this.error = error;
  }

  async handleError() {
    await this.logError();
    return (
      (await this.checkForDatabaseErrorAndSendResponse()) ||
      (await this.crashIfUntrustedErrorOrSendResponse())
    );
  }

  async logError() {
    console.error(this.error);
  }

  async crashIfUntrustedErrorOrSendResponse() {
    if (this.error instanceof AppError) {
      return this.responseStream
        .status(this.error.statusCode)
        .send(errorResponseObj(this.error));
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

/**
 * Sends a error response according to DEV_ENV.
 * Sends Different error response in development and production.
 */
function errorResponseObj(error: AppError | CustomError) {
  if (getEnv("DEV_ENV") === "development") {
    return {
      error: true,
      stack: error.stack,
      data: [],
      ...error,
    };
  } else {
    return ApiResponse.error(error.message, error.statusCode);
  }
}
