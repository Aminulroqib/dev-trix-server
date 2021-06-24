const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpmfy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
    const eventCollection = client.db("devTrix").collection("service");
    const reviewCollection = client.db("devTrix").collection("review");
    
       app.post('/addEvent', (req, res)=>{
           const newEvent = req.body;
           console.log('adding new:', newEvent)
           reviewCollection.insertOne(newEvent)
           .then(result => {
            console.log('inserted:', result.insertedCount);
            res.send(result.insertedCount > 0)
           })
       })
       
       app.get('/events', (req, res)=>{
        eventCollection.find()
        .toArray((err, items)=>{
            res.send(items);
        })
    })

    app.post('/addReview', (req, res)=>{
        const newReview = req.body;
        console.log('adding new review:', newReview);
        reviewCollection.insertOne(newReview)
           .then(result => {
            console.log('inserted:', result.insertedCount);
            res.send(result.insertedCount > 0)
           })
    })

    app.get('/reviews', (req, res)=>{
        reviewCollection.find()
        .toArray((err, testimonials)=>{
            res.send(testimonials);
        })
    })

    })


app.listen(process.env.PORT || port)