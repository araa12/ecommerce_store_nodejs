const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const usersRoute = require('./src/routes/user');
const authRoute = require('./src/routes/auth');
const productRoute = require('./src/routes/product')
const cartRoute = require('./src/routes/order')
const ordersRoute = require('./src/routes/cart')


require('dotenv').config();
  console.log(process.env.MongoURL);


mongoose.connect(process.env.MongoURL,{useNewUrlParser: true,})
.then(()=> {
    console.log('Connected to Database');   
}).catch((err)=> {
console.log(err);
});

app.use(express.json());
app.use("/api/users",usersRoute); 
app.use("/api/auth",authRoute);
app.use('/api/products',productRoute);
app.use('/api/orders',ordersRoute);
app.use('/api/carts',cartRoute);

// app.use(bodyParser.json());

app.get('/',(req,res)=> {
res.send('Running');
});

app.listen(process.env.PORT || 5000,"192.168.176.180",()=> {
    console.log('Backend is Running');
})