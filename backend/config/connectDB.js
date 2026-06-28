import mongoose from "mongoose";

// Cache the connection for serverless environments (Vercel)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("MongoDB connected ");
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Error connecting to MongoDB:", error);
  }
  return cached.conn;
};

