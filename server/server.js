import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnection from './configs/db.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import { clerkMiddleware, requireAuth } from "@clerk/express";
import educatorRoute from './routes/educatorRoute.js';

dotenv.config();

const app = express();

// Apply Clerk middleware before any route that uses authentication
app.use(express.json());
app.use(clerkMiddleware());

// Database connection
await dbConnection();

// Allow cross-origin requests
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("Home route"));

// Webhook route — no authentication needed
app.post("/clerk", clerkWebhooks);

// Protect educator routes with Clerk authentication
app.use("/api/educator", requireAuth(), educatorRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is Running on port", PORT);
});
