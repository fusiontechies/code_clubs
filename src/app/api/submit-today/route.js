import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const uri = process.env.MONGODB_URI; // MongoDB URI
const dbName = process.env.MONGODB_DB; // Database name
const collectionName = process.env.MONGODB_COLLECTION; // Collection name

// Configuration for Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    console.log('Environment Variables:');
    console.log('MONGODB_URI:', uri);
    console.log('MONGODB_DB:', dbName);
    console.log('MONGODB_COLLECTION:', collectionName);
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);
    console.log('Cloudinary Config:', {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        // Parse the incoming request body (form data)
        const formData = await request.formData();
        const date = formData.get('date');
        const createdBy = formData.get('user');
        const career = formData.get('career');
        const health = formData.get('health');
        const achievement = formData.get('achievement');
        const water = formData.get('water');
        const miscellaneousText = formData.get('miscellaneousText');
        const file = formData.get('miscellaneousImage');

        console.log('Form Data:', {
            date,
            createdBy,
            career,
            health,
            achievement,
            water,
            miscellaneousText,
            file
        });

        // Initialize MongoDB client
        const client = new MongoClient(uri, { connectTimeoutMS: 20000 });

        // Connect to the MongoDB server
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Prepare the image data if an image is included
        let imageUrl = null;
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image' },
                    (error, result) => {
                        if (error) {
                            reject(new Error('Cloudinary upload failed: ' + error.message));
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(buffer);
            });
            imageUrl = uploadResult.secure_url;
            console.log('Image uploaded to Cloudinary at:', imageUrl);
        }

        // Construct the document to be saved in MongoDB
        const document = { date, createdBy };

        // Add category-specific data to the document based on the payload
        if (career) document.career = career;
        if (health) document.health = JSON.parse(health);
        if (achievement) document.achievement = achievement;
        if (water) document.water = water;
        if (miscellaneousText || imageUrl) {
            document.miscellaneous = {
                text: miscellaneousText,
                image: imageUrl, // Store the Cloudinary image URL
                imageId: imageUrl ? imageUrl.split('/').pop().split('.')[0] : null, // Extract the image ID
            };
        }

        console.log('Document to be inserted:', document);

        // Insert the document into the MongoDB collection
        const result = await collection.insertOne(document);
        console.log('Document inserted with ID:', result.insertedId);

        // Close MongoDB connection
        await client.close();
        console.log('MongoDB connection closed');

        // Send a success response back to the frontend
        return NextResponse.json(
            {
                message: 'Data saved successfully',
                insertedId: result.insertedId,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error saving data to MongoDB:', error);
        return NextResponse.json(
            { error: 'Failed to save data to MongoDB' },
            { status: 500 }
        );
    }
}
