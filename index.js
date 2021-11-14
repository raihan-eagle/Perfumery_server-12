const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// assign12
// PDv9x8wdcIwonArn

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xqctd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('connected to db')
        const database = client.db('assign12');
        const reviewsCollection = database.collection('reviews')
        const usersCollection = database.collection('users')
        const servicesCollection = database.collection('services')
        const ordersCollection = database.collection('orders')
        

//      // GET Services API

        app.get('/services', async (req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

//      // GET Orders API

        app.get('/orders', async (req,res)=>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

//      //Get single services
        app.get('/services/:id', async (req, res)=> {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

//      //Review GET API

        app.get('/reviews', async (req,res)=>{
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);

        })
//      //Admin check GET API

        app.get('/users/:email', async (req,res)=>{
            const email = req.params.email;
            const query = {email : email};
            const user = await usersCollection.findOne(query);
            let isAdmin =false
            if(user?.role === 'admin'){
                isAdmin = true
            }
            res.send({admin : isAdmin});

        })
//      //By Email GET API

        app.get('/orders/:email', async (req,res)=>{
            const email = req.params.email;
            const query = {email : email};
            const order = await ordersCollection.find(query).toArray();
            console.log(order)
            res.json(order);

        })
        
        // Service POST API
        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log('hit the',service)   
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        });

        // Review POST API
        app.post('/review', async(req, res)=>{
            const review = req.body;
            console.log('hit the',review)   
            const result = await reviewsCollection.insertOne(review);
            console.log(result)
            res.json(result)
        });
        // Users POST API
        app.post('/users', async(req, res)=>{
            const user = req.body;
            console.log('hit the',user)   
            const result = await usersCollection.insertOne(user);
            console.log(result)
            res.json(result)
        });
        // Orders POST API
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            console.log('hit the',order)   
            const result = await ordersCollection.insertOne(order);
            console.log(result)
            res.json(result)
        });
        // Admin PUT API
        app.put('/users/admin', async(req, res)=>{
            const user = req.body;
            const filter = {email: user.email} 
            const updateDoc = {$set:{role:'admin'}} 
            const result = await usersCollection.updateOne(filter, updateDoc);
            console.log(result)
            res.json(result)
        });

        // DELETE API
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })

        // DELETE ORDER API
        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally{
        //await.client.close();
    }

}
run().catch(console.dir)





app.get('/',(req, res)=>{
    res.send('i am the response from server')
    console.log(req.body)
});

app.listen(port, ()=>{
    console.log('server running fine at', port)
})