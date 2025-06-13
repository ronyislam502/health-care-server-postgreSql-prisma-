/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  // Prisma duplicate error code
  if (error.code === "P2002") {
    // Extract the first duplicated field name from error.meta.target array
    const errorMessage = error.meta?.target?.[0] ?? "Duplicate value";

    const errorSources: TErrorSources = [
      {
        path: errorMessage,
        message: `${errorMessage} is already exists`,
      },
    ];

    const statusCode = 400;

    return {
      statusCode,
      message: `${errorMessage} is already exists`,
      errorSources,
    };
  }

  // fallback to generic error
  const match = error.message.match(/"([^"]*)"/);
  const errorMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: errorMessage
        ? `${errorMessage} is already exists`
        : "Duplicate value error",
    },
  ];
  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid Id",
    errorSources,
  };
};

export default handleDuplicateError;
