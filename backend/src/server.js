import "../instrument.mjs"; //sentry setup k liye
import express from 'express'
import {ENV} from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
// import { clerkClient } from '@clerk/express';
import { inngest , functions } from './config/inngest.js';
import { serve } from 'inngest/express';
import chatRoutes from './routes/chat.route.js';
import cors from 'cors';
import * as Sentry from "@sentry/node";

const app = express();
app.use(express.json()); //middleware to parse json body

app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}));


app.use(clerkMiddleware()); //req.auth property will be available

app.use(clerkMiddleware({ secretKey: ENV.CLERK_SECRET_KEY }));

app.get("/debug-sentry", (req, res) => {
    throw new Error("My first Sentry error!");
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use("/api/inngest", serve ({ client : inngest , functions}));   
app.use("/api/chat", chatRoutes);   

Sentry.setupExpressErrorHandler(app); //sentry error handler middleware




const startServer = async () => {
    try {
        await connectDB();
        if (ENV.NODE_ENV !== 'production') {
            app.listen(ENV.PORT, () => {
                console.log("Server is running on port:" , ENV.PORT);
            });
        }} catch (error) {
        console.error("Error starting server:", error);
        process.exit(1); //1 means failure 0 means success
    }};


startServer();

export default app;