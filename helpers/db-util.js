import { MongoClient } from 'mongodb';

export async function connectDatabase(){
    const DB_URL = process.env.NEXT_PUBLIC_MONGO_DB_URL;
    console.log("DB_URL = ", DB_URL);
    const client = await MongoClient.connect(DB_URL);
    return client;
}


export async function insertDocuments(client, collectionName, data){
    const db = client.db();
    const collection = db.collection(collectionName);
    let result = await collection.insertOne(data);
    return result;
}

export async function getAllDocuments(client, collectionName, sortData){
    const db = client.db();
    const collection = db.collection(collectionName);
    let documents = await collection.find().sort(sortData).toArray();
    return documents;
}