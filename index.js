const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
// this is a comment i wrote to check vercel 
app.use(cors({
  origin:[
    
   
  
  ],
  credentials: true
}))
// console.log(process.env.DB_PASS)

// mongo db start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qmpng5e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //collection
    const contestCollection = client.db("contestdb").collection("contests");
    const cartCollection = client.db("contestdb").collection("cart");
    const userCollection = client.db("contestdb").collection("users");
    


      // sending the data with email query in added components
      app.get("/contests", async (req, res) => {
        let query ={}
        if(req.query.email){
           query= {email: req.query.email}

        }
      const cursor = contestCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
      });

        // updating a product
        app.put('/contest/:id', async(req,res)=>{
          const id = req.params.id;
          const filter = {_id : new ObjectId(id)}
          const options =   {upsert : true}
          const updatedProduct = req.body;
          const product ={
            $set:{
              name : updatedProduct.name,
              image : updatedProduct.image   ,
              category : updatedProduct.category,
              quantity : updatedProduct.quantity,
              details : updatedProduct.details,
              price : updatedProduct.price,
              made_by : updatedProduct.made_by,
              short_details : updatedProduct.short_details,
            }
          }
          const result = await contestCollection.updateOne(filter , product , options);
          res.send(result);
      }) 




    // add a thing  in Collection
    app.post('/contest', async(req , res)=>{
      const newProduct = req.body;
      // console.log(newProduct); 
      const result = await contestCollection.insertOne(newProduct);
      res.send(result);

  })

    app.get("/contests/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await contestCollection.findOne(query);
      res.send(result);
    });
    // sending data to cart by post 
    app.post('/contest-cart', async(req,res)=>{
      const addCartProduct = req.body;
      const addCart = await cartCollection.insertOne(addCartProduct);
      console.log(addCart);
      res.send(addCart);
    });
      // showing all the booked products with email query
    app.get('/contest-cart', async(req,res)=>{
      console.log(req.query);
      let query ={}
        if(req.query.email){
           query= {email: req.query.email}

        }
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // delete from cart 
    app.delete('/contest-cart/:id',async(req,res)=>{
      const id = req.params.id;
      const query= {_id : new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
   

    //getting user form after the login 
    app.post('/user', async(req , res)=>{
      const newUser = req.body;
      console.log(newUser); 
      const result = await userCollection.insertOne(newUser);
      res.send(result);
      
  })


  // show the users
  app.get('/user',async(req,res)=>{
    const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })
  
  // delete a user from database 
  app.delete('/user/:id',async(req,res)=>{
    const id = req.params.id;
    const query= {_id : new ObjectId(id)}
    const result = await userCollection.deleteOne(query);
    res.send(result);
  });

  // make admin 
  app.patch('/user/admin/:id',async(req, res)=>{
    const id = req.params.id;
    const filter  = { _id: new ObjectId(id)}
    const updatedDoc ={
      $set:{
        role:'admin'
      }
      
    }
    const result = await userCollection.updateOne(filter,updatedDoc);
    res.send(result);

  })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongo  end
app.get("/", (req, res) => {
  res.send("contest  is running");
});

app.listen(port, () => {
  console.log(`contest is running on port ${port}`);
});
