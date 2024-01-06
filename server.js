const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//connection with db 
mongoose.connect(process.env.DB , {useNewUrlParser : true , useUnifiedTopology : true});

const db = mongoose.connection;

db.on('error' , (err)=>{
    console.log(err);
});
db.once('open' , ()=>{
    console.log('Database is connected');
});

const userRouter = require('./routers/userRouter');


const app = express();
app.use(express.json());
const port = process.env.PORT 
app.listen(port , ()=>{
    console.log(`http://localhost:${port}`);
});

app.use('/' , userRouter);
