const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const usersRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product')
const cartRoute = require('./routes/order')

const ordersRoute = require('./routes/cart')


dotenv.config();

mongoose.connect(process.env.MongoURL).then(()=> {
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

app.listen(process.env.PORT || 5000,()=> {
    console.log('Backend is Running');
})