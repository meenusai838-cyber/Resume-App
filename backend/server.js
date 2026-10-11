require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, isConnected } = require("./config/db");
const analysisRoutes = require("./routes/analysis");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const PORT = process.env.PORT || 5000;

// Serverless invocations share one connection attempt, so the database is opened once per instance.
let dbPromise = null;
function ensureDatabase() {
  if (isConnected()) return Promise.resolve();
  if (!process.env.MONGODB_URI) {
    return Promise.reject(new Error("MONGODB_URI is not set."));
  }
  dbPromise ??= connectDB(process.env.MONGODB_URI).catch((err) => {
    dbPromise = null; // allow the next request to retry
    throw err;
  });
  return dbPromise;
}

function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
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

// Vercel imports this module and handles requests itself. Only listen when run directly (npm run dev / start).
if (require.main === module) {
  ensureDatabase()
    .then(() => app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`)))
    .catch((err) => {
      console.error("Failed to start:", err.message);
      process.exit(1);
    });
}

module.exports = app;
