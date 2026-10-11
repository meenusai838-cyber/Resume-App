// Creates an Error that carries an HTTP status, so the error middleware can respond with it.
function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}

// Wraps an async route handler so rejected promises go to the error middleware.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { httpError, asyncHandler };
