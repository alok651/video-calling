import express from 'express'
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
// import { clerkClient } from '@clerk/express';
import { inngest , functions } from './config/inngest.js';
import { serve } from 'inngest/express';


const app = express();
app.use(express.json()); //middleware to parse json body


app.use(clerkMiddleware()); //req.auth property will be available

app.use(clerkMiddleware({ secretKey: ENV.CLERK_SECRET_KEY }));

app.use("/api/inngest", serve ({ client : inngest , functions}));   

app.get('/', (req, res) => {
    res.send('Hello World!');
});



const startServer = async () => {
    try {
        await connectDB();
        if (!ENV.NODE_ENV !== 'production') {
            app.listen(ENV.PORT, () => {
                console.log("Server is running on port:" , ENV.PORT);
            });
        }} catch (error) {
        console.error("Error starting server:", error);
        process.exit(1); //1 means failure 0 means success
    }};


startServer();

export default app; //for testing