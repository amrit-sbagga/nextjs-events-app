import { MongoClient } from 'mongodb';

async function handler(req, res) {
    if(req.method === 'POST'){
        //console.log("hereeee...!!!");
        const userEmail = req.body.email;

        if(!userEmail || !userEmail.includes('@')){
            res.status(422).json({message : 'Invalid email address.'});
            return;
        }

        const DB_URL = process.env.NEXT_PUBLIC_MONGO_DB_URL;
        //process.env.NEXT_PUBLIC_MONGO_DB_URL;
        //console.log("DB_URL = ", DB_URL);
        const client = await MongoClient.connect(DB_URL)
        const db = client.db();
        const collection = db.collection('newsletter');
        await collection.insertOne({email : userEmail})
        client.close();

        console.log("userEmail = ", userEmail);
        res.status(201).json({message : 'Signed up!'})
    }
}

export default handler;