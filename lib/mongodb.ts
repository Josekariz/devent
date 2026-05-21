import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Reuse a cached value in development to avoid creating multiple connections
// during hot reloads. In production, this still resolves to a single connection
// per server process.
const cache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

export async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection immediately when available.
  if (cache.conn) {
    return cache.conn;
  }

  // Create the initial connection promise once, then reuse it for concurrent calls.
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Reset the promise so future calls can retry after a failed attempt.
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}

export default connectToDatabase;
