export class AppError extends Error {
  constructor(status, code, message, details) { super(message); this.status = status; this.code = code; this.details = details; }
}
export const errors = {
  badRequest: (message, details) => new AppError(400, "VALIDATION_ERROR", message, details),
  unauthorized: (message = "Authentication required") => new AppError(401, "UNAUTHORIZED", message),
  forbidden: (message = "You do not have permission to perform this action") => new AppError(403, "FORBIDDEN", message),
  notFound: (message = "Resource not found") => new AppError(404, "NOT_FOUND", message),
  conflict: (message) => new AppError(409, "CONFLICT", message),
  rateLimited: (message = "Too many requests. Try again later.") => new AppError(429, "RATE_LIMITED", message),
};
export const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
export const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
