import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // MongoDB URI
const dbName = process.env.MONGODB_DB; // Database name
const collectionName = process.env.MONGODB_COLLECTION; // Collection name

export async function GET(request) {
    console.log('Environment Variables:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('MONGODB_DB:', process.env.MONGODB_DB);
    console.log('MONGODB_COLLECTION:', process.env.MONGODB_COLLECTION);

    const { searchParams } = new URL(request.url);
    const filterDate = searchParams.get('date');  // Get the date from query parameter (if provided)
    const createdBy = searchParams.get('user');
    
    let client;

    try {
        console.log('Connecting to MongoDB...');
        client = new MongoClient(uri, { connectTimeoutMS: 20000 });  // Increase timeout to 20 seconds
        try {
            await client.connect();
            console.log('Connected to MongoDB');
        } catch (connectError) {
            if (connectError.name === 'MongoNetworkError') {
                console.error('Connection timeout:', connectError);
                return new Response(
                    JSON.stringify({ message: 'Connection timeout', error: connectError.message }),
                    {
                        status: 504,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }
            throw connectError;
        }

        const db = client.db(dbName);
        console.log(`Using database: ${dbName}`);
        const collection = db.collection(collectionName);
        console.log(`Using collection: ${collectionName}`);

        let query = {};
        if (filterDate === 'all') {
            query = {};
        } else if (filterDate) {
            query.date = filterDate;
        } else {
            console.log('No filter date applied.');
        }

        if (createdBy) {
            query.createdBy = createdBy;
        }

        console.log('Query:', JSON.stringify(query));

        const blogs = await collection.find(query, { projection: { createdBy: 0 } }).sort({ date: -1 }).toArray();
        console.log('Blogs fetched:', blogs.length);

        return new Response(JSON.stringify(blogs || []), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return new Response(
            JSON.stringify({ message: 'Error fetching blogs', error: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } finally {
        if (client) {
            console.log('Closing MongoDB connection');
            await client.close();
        }
    }
}