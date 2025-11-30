import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import chatRoutes from "./routes/chat.route.js";

import cors from "cors";
import * as Sentry from "@sentry/node";

const app = express();

// JSON body parsing
app.use(express.json());

// CORS (allow OPTIONS for preflight)
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Clerk middleware (req.auth available)
app.use(clerkMiddleware({ secretKey: ENV.CLERK_SECRET_KEY }));

// Sentry test route
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

app.get("/", (req, res) => {
  res.send("Hello World! 123");
});

// Inngest routes
app.use("/api/inngest", serve({ client: inngest, functions }));

// Chat routes
app.use("/api/chat", chatRoutes);

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// DB connect and start server (optional listen for local dev)
connectDB()
  .then(() => {
    console.log("DB connected");
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log(`Server running on port ${ENV.PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

// Export app for Vercel serverless
export default app;
