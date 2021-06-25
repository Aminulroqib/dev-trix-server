const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra')
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpmfy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('reviews'));
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
    const adminCollection = client.db("devTrix").collection("admin");
    
       app.post('/addEvent', (req, res)=>{
           const newEvent = req.body;
           console.log('adding new:', newEvent)
           eventCollection.insertOne(newEvent)
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
        const file = req.files.file;
        const name = req.body.name;
        const company = req.body.company;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

          var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        reviewCollection.insertOne({ name, company, description, image })
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/reviews', (req, res)=>{
        reviewCollection.find({})
        .toArray((err, testimonials)=>{
            res.send(testimonials);
        })
    })

    app.post('/addAdmin', (req, res)=>{
        const newAdmin = req.body;
           console.log('adding new:', newAdmin)
           adminCollection.insertOne(newAdmin)
           .then(result => {
            console.log('inserted admin:', result.insertedCount);
            res.send(result.insertedCount > 0)
           })
    })
    app.get('/admins', (req, res)=>{
        adminCollection.find()
        .toArray((err, admins)=>{
            res.send(admins);
        })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({email: email})
            .toArray((err, admns) => {
                res.send(admns.length > 0);
            })
    })

    })


app.listen(process.env.PORT || port)