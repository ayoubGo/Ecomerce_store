
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCopoun } from "../controllers/coupon.route.js";


const router = express.Router();


router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCopoun);

export default router