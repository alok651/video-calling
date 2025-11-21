import express from 'express';
import dotenv from 'dotenv';
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import {clerkMiddleware} from "@clerk/express";
import { inngest, functions } from './config/inngest.js';
import { serve } from "inngest/express";

dotenv.config();

const app=express();


app.use(clerkMiddleware())//req.auth will be available

app.use(express.json());//req.body will be available
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get('/',(req,res)=>{
    res.send('Hello, World!');
});


const startServer=async()=>{
    try{
        await connectDB();
        if(ENV.NODE_ENV!=="production"){
            app.listen(ENV.PORT,()=>{
                console.log("Server started on port ",ENV.PORT);
            });
        }

    }catch(error){
        console.error("Error starting server: ",error);
        process.exit(1);
    }
} ;
startServer();

export default app;



