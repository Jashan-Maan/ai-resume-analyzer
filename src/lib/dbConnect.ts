import mongoose from "mongoose";

type Connection = {
  isConnected?: number;
};

const connection: Connection = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected === 1) {
    console.log("Already connected");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in .env file");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;
    console.log("Db Connection successful");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Db connection failed", message);
    throw new Error("Failed to connect to database");
  }
}

export default dbConnect;
