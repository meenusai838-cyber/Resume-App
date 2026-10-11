require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const analysisRoutes = require("./routes/analysis");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const PORT = process.env.PORT || 5000;

// Makes sure the database is connected before any /api route runs.
// connectDB caches the connection, so this is cheap after the first request on an instance.
function ensureDatabase() {
  if (!process.env.MONGODB_URI) {
    return Promise.reject(new Error("MONGODB_URI is not set."));
  }
  return connectDB(process.env.MONGODB_URI);
}

// CLIENT_ORIGIN may hold one origin or a comma-separated list. Trailing slashes and spaces are ignored,
// so "https://site.vercel.app/" and "https://site.vercel.app" both match the browser's Origin header.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

function corsOriginCheck(origin, callback) {
  // Requests without an Origin header (curl, server-to-server) aren't browser CORS requests.
  callback(null, !origin || allowedOrigins.includes(origin));
}

function createApp() {
  const app = express();

  app.use(cors({ origin: corsOriginCheck }));
  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.use("/api", async (req, res, next) => {
    try {
      await ensureDatabase();
      next();
    } catch (err) {
      next(err);
    }
  });
  app.use("/api", analysisRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

const app = createApp();

// Vercel loads this module through api/index.js and sends requests to the exported app.
// Only listen when the file is run directly (npm run dev / npm start).
if (require.main === module) {
  ensureDatabase()
    .then(() => app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`)))
    .catch((err) => {
      console.error("Failed to start:", err.message);
      process.exit(1);
    });
}

module.exports = app;
