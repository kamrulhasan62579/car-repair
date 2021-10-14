const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()


const { MongoClient, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlpbo.mongodb.net/repairService?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.use(cors())


client.connect(err => {
// review collection:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const reviewCollection = client.db("repairService").collection("review");
  app.post("/addReview", (req, res) =>{
    reviewCollection.insertOne(req.body)
    .then(result => {
      res.send(result.insertedCount < 0)
    })
  })

    app.get("/getReview", (req, res) =>{
    reviewCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  // addmin Collection:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  const adminCollection =  client.db("repairService").collection("admin");
  app.post('/addAdmin', (req, res) =>{
    adminCollection.insertOne(req.body)
    .then(result=>{
      res.send(result.insertedCount > 0)
    })
  })
   app.get('/getAdmin', (req, res) =>{
    adminCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  // finding admin by email ;;;;;;;;;;;;;;;
  app.get("/getAdmin/:email",(req, res) => {
    adminCollection.find({email: req.query.email})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  // delete admin::::::::::::::::::::
  app.delete("/deleteAdmin/:id", (req, res ) => {
    const adminId = req.params.id;
    console.log(adminId)
    adminCollection.deleteOne({_id : ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
  
// services collection::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    const serviceCollection = client.db("repairService").collection("service");
    app.post('/addService', (req, res) => {
      serviceCollection.insertOne(req.body)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })

        app.get('/getService', (req, res) => {
       serviceCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
    })
     // delete servic::::::::::::::::::::
  app.delete("/deleteService/:id", (req, res ) => {
    const adminId = req.params.id;
    console.log(adminId)
    serviceCollection.deleteOne({_id : ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })

    // booking collection::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    const bookingListCollection = client.db("repairService").collection("bookingList");
    app.post('/bookingList', (req, res) => {
        bookingListCollection.insertOne(req.body)
        .then(result=> {
          res.send(result.insertedCount > 0)
        })
    })

    app.get('/bookingList/:email', (req, res) => {
      adminCollection.find({email: req.query.email})
      .toArray((err, documents) => {
        const filter = {} ;
        if (documents.length === 0) {
           filter.email = req.query.email
        }
        bookingListCollection.find(filter)
      .toArray((err, documents) => {
        res.send(documents)
      })
      })
    })
    console.log('Database Connected');
});


app.get('/', function (req, res) {
  res.send('hello world Zackerburg')
})

app.listen(process.env.PORT || 3011, () => console.log('Listening from port 3011'))