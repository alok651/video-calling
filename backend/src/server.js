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

app.use(express.json());

// ------ FIXED CORS ------
const allowedOrigins = [
  "https://video-frontend-coral.vercel.app",
  "https://video-frontend-git-main-alok-kumars-projects-c8e3c07a.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors()); // allow preflight
// --------------------------

// Clerk Middleware
app.use(clerkMiddleware());

// Sentry Debug Test
app.get("/debug-sentry", () => {
  throw new Error("My first Sentry error!");
});

// Test Route
app.get("/", (req, res) => {
  res.send("Hello World! 123");
});

// Inngest API
app.use("/api/inngest", serve({ client: inngest, functions }));

// Chat API
app.use("/api/chat", chatRoutes);

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Run server only in dev, not production
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("🚀 Server started on port:", ENV.PORT);
      });
    }
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
