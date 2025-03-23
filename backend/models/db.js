const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_CONN 

mongoose.connect(mongo_url).then(()=>{
    console.log("Connected to MongoDB successfully")}).catch((err)=>{
        console.log("Error occured while connecting to MongoDB:", err)
    })
