import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

// Provide fallback for the specific connection string provided by the user
const fallbackUri = "mongodb+srv://sukkamanikantagoud_db_user:ZZBbpijo3jun3Oc0@astrustedconsultany.5wcilrm.mongodb.net/?appName=ASTRUSTEDCONSULTANY";
const uri = fallbackUri; // Force override stale environment variables globally to ensure connectivity

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const options = {
  maxPoolSize: 10,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  attachDatabasePool(client);
  clientPromise = client.connect();
}

export default clientPromise;
