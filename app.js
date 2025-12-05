const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const userRoutes = require('./routes/user.routes')
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());

connectDB();
app.get('/',(req,res)=>{
    res.send("Hii i am home page");
})

app.use('/users',userRoutes);


module.exports = app;