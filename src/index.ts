import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { APP_ORIGIN, PORT } from "./constants/env";
import { connectDB } from "./config/MongoDBClient";
import errorHandler from "./middleware/errorHandler";
import authRouter from "./routes/auth-router";





const app = express();
app.use(express.json({}));
app.use(cookieParser());

app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.options("*", cors());
app.use("/auth", authRouter);
app.use(errorHandler);

app.listen(PORT, async () => {
    await connectDB()
    console.log(`Server is running on port ${PORT}`);
})