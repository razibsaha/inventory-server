const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@inventory.902vx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const itemscollection = client.db("inventory").collection("items");

    app.get("/inventories", async (req, res) => {
      const query = {};
      const cursor = itemscollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    app.get('/inventory/:id', async(req,res)=> {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const items = await itemscollection.findOne(query);
        res.send(items);
    } )

    // myItems sorting

    app.get('/inventories', async(req,res) => {
      const email = req.query.email;
      console.log('here is the email',email);
      const query = {email:email};
      const cursor = itemscollection.find(query);
      const myItems = await cursor.toArray();
      res.send(myItems)
    })

    // post data

    app.post('/inventory', async(req,res)=>{
        const newItem = req.body;
        const result = await itemscollection.insertOne(newItem);
        res.send(result);
    })

    //update data 

    app.put('/inventory/:id', async(req,res)=> {
        const id = req.params.id;
        const newQuantity = req.body
        console.log(newQuantity)
        const find = {_id: ObjectId(id)};
        const options = { upsert : true};
        const updatedQuantity = {
            $set: {
                quantity: newQuantity.quantity
            }
        }
        const result = await itemscollection.updateOne(find, updatedQuantity, options);  
        res.send(result);
    })
    
    //update delivered 

    app.put('/inventory/:id', async(req,res)=> {
        const id = req.params.id;
        const newDelivered = req.body;
        console.log(newDelivered)
        const find = {_id: ObjectId(id)};
        const options = { upsert : true};
        const updatedDelivered = {
            $set: {
                sold: newDelivered.sold
            }
        }

        const result = await itemscollection.updateOne(find, updatedDelivered, options);
        res.send(result);
    })



    // delete 

    app.delete('/inventory/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await itemscollection.deleteOne(query);
        res.send(result);
    })



  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
