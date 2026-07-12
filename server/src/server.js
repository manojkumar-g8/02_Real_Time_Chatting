import express from "express";
import "dotenv/config";
import cookieparser from "cookie-parser";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
const PORT = process.env.PORT;

// middlewares
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);
app.use(cookieparser());
app.use(express.json());

// connect database
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// listen to the PORT
server.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});
