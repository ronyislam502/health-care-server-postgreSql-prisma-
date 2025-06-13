import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// error.code === "P2023"

const handlePrismaValidationError = (error: any): TGenericErrorResponse => {
  let errorSources: TErrorSources = [];

  // Common Prisma validation-related error codes:
  // P2000 = String too long for column
  // P2018 = Constraint violation
  // P2003 = Foreign key constraint violation
  // P2023 = Invalid cast (type error)

  if (
    error.code === "P2000" ||
    error.code === "P2018" ||
    error.code === "P2003"
  ) {
    // Try to get the field or constraint name from error.meta
    const field = error.meta?.field_name || error.meta?.constraint_name || "";

    errorSources.push({
      path: field,
      message: error.message || "Validation failed for field",
    });
  } else if (error.errors && typeof error.errors === "object") {
    // If there are nested validation errors (custom cases)
    errorSources = Object.values(error.errors).map((val: any) => ({
      path: val.path || "",
      message: val.message || "Validation error",
    }));
  } else {
    // Fallback for unknown errors
    errorSources.push({
      path: "",
      message: error.message || "Unknown validation error",
    });
  }

  return {
    statusCode: 400, // Bad Request
    message: "Validation Error",
    errorSources,
  };
};

export default handlePrismaValidationError;
