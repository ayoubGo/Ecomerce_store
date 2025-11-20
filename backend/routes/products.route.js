import express from  "express";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductByCategory, 
    getRecommendedProducts, toogleFeaturedProduct } from "../controllers/getAllProducts.controllers.js";
import { admineRoute, protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();


router.get("/" ,protectRoute , admineRoute,  getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommended", getRecommendedProducts);
router.get("/category/:category", getProductByCategory);
router.get("/:id",protectRoute, admineRoute, toogleFeaturedProduct);
router.post("/",protectRoute, admineRoute, createProduct);
router.delete("/:id", protectRoute, admineRoute, deleteProduct);

export default router;