import express, { json } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/bd.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());  // allow us to parse the body of the request
app.use(cookieParser()); // so we can have access to the cookies 


app.use("/api/auth",authRoutes)

app.listen(5000, () => {
    console.log("server i running on http://localhost:" + PORT);
    connectDB();
});