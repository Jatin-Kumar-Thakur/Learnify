import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnection from './configs/db.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import { clerkMiddleware, requireAuth } from "@clerk/express";
import educatorRoute from './routes/educatorRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import { protectEducator } from './middleware/authMiddleware.js';
import courseRoute from './routes/courseRoute.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

const app = express();

// Apply Clerk middleware before any route that uses authentication
app.use(express.json());
app.use(clerkMiddleware());

// Database connection
await dbConnection();
await connectCloudinary();

// Allow cross-origin requests
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("Home route"));

// Webhook route — no authentication needed
app.post("/clerk", clerkWebhooks);

//Other Routes
app.use("/api/educator", requireAuth(), educatorRoute);
app.use("/api/course", courseRoute);
app.use("/api/user", userRoute);
app.post("/stripe",express.raw({type:'application/json'}) , stripeWebhooks)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is Running on port", PORT);
});
