import { MongoClient } from 'mongodb';

const uri = 'YOUR_NEW_MONGODB_URL_HERE'; // Replace with your new database URL
const options = {
  maxPoolSize: 10,
  serverApi: {
    version: '1' as const,
    strict: true,
    deprecationErrors: true,
  },
};

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    cachedClient = client;
    console.log('✅ Connected to MongoDB Atlas');
    return client;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('🔄 Falling back to JSON file storage');
    return null; // Return null to indicate fallback needed
  }
}

export async function getDatabase() {
  const client = await connectToDatabase();
  if (client) {
    return client.db('as-trusted-consultancy');
  }
  return null; // Indicates fallback to JSON storage
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (cachedClient) {
    await cachedClient.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
