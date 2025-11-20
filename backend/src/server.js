import express from 'express';
import dotenv from 'dotenv';
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app=express();




app.get('/',(req,res)=>{
    res.send('Hello, World!');
});




app.listen(ENV.PORT,()=>{
    console.log("Server is running on port ",ENV.PORT)
connectDB()

}); 