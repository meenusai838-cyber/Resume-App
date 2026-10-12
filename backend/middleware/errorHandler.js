// Responds to requests for routes that don't exist.
function notFound(req, res) {
  res.status(404).json({ error: "Not found" });
}

// Express needs all four arguments to recognize this as an error handler.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message;

  if (err.code === "LIMIT_FILE_SIZE") {
    status = 413;
    message = "Resume must be 4 MB or smaller.";
  }
  if (status >= 500) {
    console.error(err);
    // Errors marked expose (such as AI service errors) already have a message that is safe to show.
    if (!err.expose) message = "Something went wrong on the server.";
  }

  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
