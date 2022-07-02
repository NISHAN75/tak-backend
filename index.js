const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const { reset } = require("nodemon");


const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.de1jh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
  try {
    await client.connect();
    const takasCollection = client.db("taks").collection("name");
    const conformCollection = client.db("completedTakas").collection("conformName");
    
  

    app.get("/takas", async (req, res) => {
     
      const takas = await takasCollection.find().toArray();
      res.send(takas);
    });
    app.get("/completed", async (req, res) => {
      const query = {};
      const cursor = conformCollection.find(query);
      const conformTakas = await cursor.toArray();
      res.send(conformTakas);
    });

    app.post("/takas", async (req, res) => {
      const newTitle = req.body;
      const result = await takasCollection.insertOne(newTitle);
      res.send(result);
    });
    app.post("/completed", async (req, res) => {
      const conformTakas = req.body;
      console.log(conformTakas);
      
      const result = await conformCollection.insertOne(conformTakas);
      res.send(result);
    });

    // update title
    app.put("/takas/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      
      const editTitle = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: editTitle.name,
        },
      };
      const result = await takasCollection.updateOne(filter, updateDoc,options);
      res.send(result);
    });
    // delete 
    app.delete("/takas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await takasCollection.deleteOne(query);
      console.log(result);
      
      res.send(result);
    });
    app.delete("/completed/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      
      const query = { _id: ObjectId(id) };
      const result = await conformCollection.deleteOne(query);
      res.send(result);
      console.log(result);
      
    });


    
  } finally {
  }
}
run();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
