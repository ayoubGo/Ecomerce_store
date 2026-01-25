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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({limit:"10mb"}));  // allow us to parse the body of the request
app.use(cookieParser()); // so we can have access to the cookies 


app.use("/api/auth",authRoutes);
app.use("/api/products",productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoute);

app.listen(5000, () => {
    console.log("server i running on http://localhost:" + PORT);
    connectDB();
});