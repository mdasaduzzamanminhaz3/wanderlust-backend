import express from "express";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("wanderlust");
const desCollection = db.collection("destination");
const bookingCollection = db.collection("bookings");
app.post("/add-destination", async (req, res) => {
  const data = req.body;
  const result = await desCollection.insertOne(data);
  console.log(result);
  res.send(result);
});
app.get("/destinations", async (req, res) => {
  const result = await desCollection.find().toArray();
  res.send(result);
});

app.get("/destination/:id", async (req, res) => {
  const { id } = req.params;
  const result = await desCollection.findOne({ _id: new ObjectId(id) });
  res.send(result);
});

app.patch("/destination/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await desCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData },
  );
  res.json(result);
});

app.delete("/destination/:id", async (req, res) => {
  const { id } = req.params;
  const result = await desCollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.post('/booking',async(req,res)=> {
  const data = req.body;
  const result = await bookingCollection.insertOne(data);
  res.send(result);
})


app.get('/my-bookings/:email',async(req,res)=> {
    const {email} = req.params;
    const result = await bookingCollection.find({email:email}).toArray();
    res.send(result);
})

app.delete('/my-bookings/:id',async(req,res)=> {
  const {id} = req.params;
  const result = await bookingCollection.deleteOne({_id: new ObjectId(id)})
  res.send(result);
})

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
