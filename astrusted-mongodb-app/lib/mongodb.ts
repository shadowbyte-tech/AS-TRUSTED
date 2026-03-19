import { MongoClient, type MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://Vercel-Admin-as-trusted-consultancy:DEyNeV57jM73uap3@as-trusted-consultancy.ehwtipr.mongodb.net/?retryWrites=true&w=majority';
const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverApi: {
    version: '1',
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
    throw error;
  }
}

export async function getDatabase() {
  return await connectToDatabase();
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (cachedClient) {
    await cachedClient.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
