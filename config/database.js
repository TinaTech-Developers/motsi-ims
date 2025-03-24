import mongoose from "mongoose";

// Ensure the environment variable is defined
const MONGODB_URI = process.env.MONGODB_URI;
if (typeof MONGODB_URI !== "string") {
  throw new Error("Missing MongoDB URI in environment variables.");
}

// Initialize cache if it doesn’t exist
let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
