import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js"

export const getAllProducts = async (req , res) => {
    try{
        const products = await Product.find({}) // we will get all the products 
        req.json({products});
    }catch(error){  
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({message: "Server Error", error : error.message});
    }

}

export const getFeaturedProducts = async (req, res) => { 

    try {
        let featuredProduct = await redis.get("featured_products");
        if(featuredProduct){
            return res.json(JSON.parse(featuredProduct));
        }

        // if not in redis , fetch from mongodb
        // .lean() is gonna return a plain javaSript object instead of mongodb  document
        featuredProduct = await Product.find({isFeatured: true}).lean();

        if(!featuredProduct){
            return res.status(404).json({message : "No featured products found"});
        }

        // store in redis for future quick access
        await  redis.set("featured_products", JSON.stringify(featuredProduct));

        res.json(featuredProduct);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({message : "Server error", error: error.message});
    }
};


export const createProduct = async (req, res) => {
    
}