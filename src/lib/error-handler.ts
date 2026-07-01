export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, errorCode: string = "INTERNAL_SERVER_ERROR", isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// Exception classification mapping
export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED_ACCESS",
  FORBIDDEN: "ACTION_FORBIDDEN",
  NOT_FOUND: "RESOURCE_NOT_FOUND",
  VALIDATION_FAILED: "INPUT_VALIDATION_FAILED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR: "INTERNAL_SERVER_ERROR"
};

// Global error logger exception classifier
export function handleError(error: Error | AppError): { message: string; code: string; status: number } {
  console.error(`[App Exception Error Log]:`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(error instanceof AppError ? { code: error.errorCode, status: error.statusCode } : {})
  });

  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.errorCode,
      status: error.statusCode
    };
  }

  // Fallback for unhandled native runtime exceptions
  return {
    message: "An unexpected server error occurred.",
    code: ErrorCodes.INTERNAL_ERROR,
    status: 500
  };
}
