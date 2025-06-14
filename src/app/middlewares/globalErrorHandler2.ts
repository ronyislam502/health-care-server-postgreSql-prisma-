/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { TErrorSources } from "../interface/error";
import config from "../config";

// Custom AppError
import AppError from "../errors/AppError";
import handleZodError from "../errors/handleZodError";
import handlePrismaValidationError from "../errors/handleValidationError";
import handlePrismaCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorSources: TErrorSources = [
    {
      path: req.originalUrl || "",
      message: "Something went wrong",
    },
  ];

  // Zod validation error
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;

    // Prisma known validation/cast constraint errors
  } else if (
    error.code === "P2000" ||
    error.code === "P2018" ||
    error.code === "P2003" ||
    error.code === "P2023" ||
    error.code === "P2025"
  ) {
    const simplifiedError = handlePrismaValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;

    // Prisma client validation error (e.g. required field missing)
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    const simplifiedError = handlePrismaValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;

    // Prisma cast error (invalid ID or UUID)
  } else if (error.code === "P2023") {
    const simplifiedError = handlePrismaCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;

    // Duplicate field (e.g. email already exists)
  } else if (error.code === "P2002") {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;

    // Manually thrown custom AppError
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [
      {
        path: req.originalUrl || "",
        message: error.message,
      },
    ];

    // Native JavaScript error
  } else if (error instanceof Error) {
    message = error.message;
    errorSources = [
      {
        path: req.originalUrl || "",
        message: error.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === "development" ? error.stack : null,
  });
};

export default globalErrorHandler;
