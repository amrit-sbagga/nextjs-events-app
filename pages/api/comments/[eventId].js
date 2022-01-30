import { connectDatabase, fetchDocuments, insertDocuments } from '../../../helpers/db-util';

async function handler(req, res) {
  const eventId = req.query.eventId;

  let client;
  try {
      client = await connectDatabase();
  } catch (error) {
      res.status(500).json({message : 'Connecting to database failed.'});
      return;
  }

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

    try {
      let data = {text : text, name : name, email : email};
      let result = await insertDocuments(client, 'comments', data);
      newComment._id = result.insertedId;
      res.status(201).json({message : 'Added comment.', comment : newComment})
    } catch (error) {
      res.status(500).json({message : 'Inserting data failed.'});
      client.close();
    }
    
  }

  if (req.method === "GET") {
    try {
      let documents = await fetchDocuments(client, 'comments');
      res.status(200).json({ comments : documents });
    } catch (error) {
      res.status(500).json({message : 'Fetching data failed.'});
      client.close();
    }   
  }

}

export default handler;
