import { connectDatabase, insertDocuments } from '../../helpers/db-util';

async function handler(req, res) {
    if(req.method === 'POST'){
        //console.log("hereeee...!!!");
        const userEmail = req.body.email;

        if(!userEmail || !userEmail.includes('@')){
            res.status(422).json({message : 'Invalid email address.'});
            return;
        }
       
        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
            res.status(500).json({message : 'Connecting to database failed.'});
            return;
        }
       
        try {
            let data = {email : userEmail};
            await insertDocuments(client, 'newsletter', data);
            client.close();
        } catch (error) {
            res.status(500).json({message : 'Inserting data failed.'});
            return;
        }

        console.log("userEmail = ", userEmail);
        res.status(201).json({message : 'Signed up!'})
    }
}

export default handler;