import { MongoClient } from 'mongodb';

async function handler(req, res) {
  const eventId = req.query.eventId;

  const DB_URL = process.env.NEXT_PUBLIC_MONGO_DB_URL;
  //console.log("DB_URL = ", DB_URL);
  const client = await MongoClient.connect(DB_URL)

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
        res.status(422).json({message : 'Invalid input.'})
        return;
    }

    //console.log(email, name, text);
    const newComment = {
        id : new Date().toISOString,
        email,
        name,
        text,
        eventId
    }
    console.log(newComment);

    const db = client.db();
    const collection = db.collection('comments');
    let result = await collection.insertOne({comment : newComment});
    newComment.id = result.insertedId;

    res.status(201).json({message : 'Added comment.', comment : newComment})
  }

  if (req.method === "GET") {
      const dummyList = [
        { id : 'c1', name : 'Amrit', text : 'Hello' },
        { id : 'c2', name : 'Honey', text : 'hi' }  
      ]
      res.status(200).json({ comments : dummyList });
  }

  client.close();
}

export default handler;
