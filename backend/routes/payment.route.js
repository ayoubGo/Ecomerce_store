import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, clearCart, createCheckout } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckout);
router.post("/checkout-success", protectRoute, checkoutSuccess);
router.delete("/clear", protectRoute, clearCart);



export default router;