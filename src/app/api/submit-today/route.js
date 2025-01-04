import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

const uri = process.env.MONGODB_URI; // MongoDB URI
const dbName = process.env.MONGODB_DB; // Database name
const collectionName = process.env.MONGODB_COLLECTION; // Collection name

export async function POST(request) {
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

        // Initialize MongoDB client
        const client = new MongoClient(uri);

        // Connect to the MongoDB server
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Prepare the image data if an image is included
        let imagePath = null, filename = null;
        if (file) {
            console.log(file.name);
            const buffer = Buffer.from(await file.arrayBuffer());
            filename = Date.now() + file.name.replaceAll(' ', '_');
            imagePath = path.join('public/uploads/', filename);
            const uploadDir = path.join(process.cwd(), 'public/uploads/');
            await mkdir(uploadDir, { recursive: true });
            await writeFile(path.join(uploadDir, filename), buffer);
        }

        // Construct the document to be saved in MongoDB
        const document = { date, createdBy };

        // Add category-specific data to the document based on the payload
        if (career) document.career = career;
        if (health) document.health = JSON.parse(health);
        if (achievement) document.achievement = achievement;
        if (water) document.water = water;
        if (miscellaneousText || imagePath) {
            document.miscellaneous = {
                text: miscellaneousText,
                image: filename, // Store the image path
            };
        }

        // Insert the document into the MongoDB collection
        const result = await collection.insertOne(document);

        // Close MongoDB connection
        await client.close();

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
