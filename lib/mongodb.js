import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  });
  cachedClient = client;
  cachedDb = client.db("nail-studio");

  return { client: cachedClient, db: cachedDb };
}
