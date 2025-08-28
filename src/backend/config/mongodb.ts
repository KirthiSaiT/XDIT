// src/backend/config/mongodb.ts
import mongoose from "mongoose";
import { env } from "./environment";

// --- FIX ---
// Renamed the global variable to avoid conflict with the imported 'mongoose' library.
// This makes the code clearer and prevents accidental misuse.
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

if (!env.mongodb.uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
// Use the new, clearer cache variable name.
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection.");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("🔌 Creating new MongoDB connection...");
    cached.promise = mongoose.connect(env.mongodb.uri, opts).then((mongooseInstance) => {
      console.log("✅ MongoDB connected successfully");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Failed to connect to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}

export { connectToDatabase };
