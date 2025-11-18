import express from  "express";
import { createProduct, getAllProducts, getFeaturedProducts } from "../controllers/getAllProducts.controllers.js";
import { admineRoute, protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();


router.get("/" ,protectRoute , admineRoute,  getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/",protectRoute, admineRoute, createProduct);

export default router;