const mongoose = require("mongoose");

let connectionPromise = null;

const isConnected = () => mongoose.connection.readyState === 1;

// Opens the connection once and reuses it. A warm serverless instance keeps this module loaded,
// so later requests skip the connect. A failed attempt is cleared so the next request can retry.
function connectDB(uri) {
  if (isConnected()) return Promise.resolve();

  connectionPromise ??= mongoose
    .connect(uri)
    .then(() => {
      console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
    })
    .catch((err) => {
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
}

module.exports = { connectDB, isConnected };
