const mongoose = require("mongoose");

const isConnected = () => mongoose.connection.readyState === 1;

async function connectDB(uri) {
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}

module.exports = { connectDB, isConnected };
