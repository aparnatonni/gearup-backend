// A single error class you throw anywhere in your service layer.
// e.g. throw new AppError(404, "Gear item not found")
// The globalErrorHandler middleware catches these and turns them into
// the { success, message, errorDetails } shape required by the assignment.
class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
