import express, { json } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import productsRoutes from "./routes/products.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import { connectDB } from "./lib/bd.js";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoute from "./routes/analyticts.route.js";
import path from "path";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json({limit:"10mb"}));  // allow us to parse the body of the request
app.use(cookieParser()); // so we can have access to the cookies 


app.use("/api/auth",authRoutes);
app.use("/api/products",productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoute);


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));


    app.get("*" ,(req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(5000, () => {
    console.log("server i running on http://localhost:" + PORT);
    connectDB();
});