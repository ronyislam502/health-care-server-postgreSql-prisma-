/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const statusCode = 400;

  // Check if Prisma duplicate error (P2002)
  if (error.code === "P2002") {
    const fieldName = error.meta?.target?.[0] ?? "field";

    const errorSources: TErrorSources = [
      {
        path: fieldName,
        message: `${fieldName} already exists`,
      },
    ];

    return {
      statusCode,
      message: `${fieldName} already exists`,
      errorSources,
    };
  }

  // Fallback: unknown structure
  const errorSources: TErrorSources = [
    {
      path: "",
      message: "Duplicate entry",
    },
  ];

  return {
    statusCode,
    message: "Duplicate entry",
    errorSources,
  };

  // // Prisma duplicate error code
  // if (error.code === "P2002") {
  //   // Extract the first duplicated field name from error.meta.target array
  //   const errorMessage = error.meta?.target?.[0] ?? "Duplicate value";

  //   const errorSources: TErrorSources = [
  //     {
  //       path: errorMessage,
  //       message: `${errorMessage} is already exists`,
  //     },
  //   ];

  //   const statusCode = 400;

  //   return {
  //     statusCode,
  //     message: `${errorMessage} is already exists`,
  //     errorSources,
  //   };
  // }

  // // fallback to generic error
  // const match = error.message.match(/"([^"]*)"/);
  // const errorMessage = match && match[1];

  // const errorSources: TErrorSources = [
  //   {
  //     path: "",
  //     message: errorMessage
  //       ? `${errorMessage} is already exists`
  //       : "Duplicate value error",
  //   },
  // ];
  // const statusCode = 400;

  // return {
  //   statusCode,
  //   message: "Invalid Id",
  //   errorSources,
  // };
};

export default handleDuplicateError;
