import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export default async function connectDB() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in .env.local");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).catch((e) => {
      cached.promise = null;
      throw e;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
