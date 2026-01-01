import cloudinary from "../lib/claudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js"

export const getAllProducts = async (req , res) => {
    try{
        const products = await Product.find({}) // we will get all the products 
        res.json({products});
    }catch(error){  
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({message: "Server Error", error : error.message});
    }

};

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
    try{
        const {name , description , price, image, category } = req.body;

        let cloudinaryResponse = null;

        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"});
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        });

        res.status(201).json(product);

    }catch(error){
        console.log("Error in createProduct comtroller", error.message);
        res.status(500).json({message: "Server error" , error: error.message})
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("deleted image from cloudinary");
            } catch (error) {
                console.log("error deleting image from cloudinary", error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({message :"Product deleated successfully"});
    } catch (error) {
        console.log("Error in deleteProducts controller ", error.message);
        res.status(500).json({message : "Server error", error : error.message});
    }
};

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {size:3}
            },
            {
                $project:{
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price : 1
                }
            }
        ])

        res.status(200).json(products)
    } catch (error) {
        console.log("Error in getRecommendedProducts controller ", error.message);
        res.status(500).json({message :"server error", error : error.message});
    }
};

export const getProductByCategory = async (req, res) => {
    try {
        const {category} = req.params;
        
        const products = await Product.find({category});
        res.json({products});

} catch (error) {
    console.log("Error in getProductByCategory controller ", error.message);
    res.status(500).json({message : "Server Error" , error: error.message});
}
};

export const toogleFeaturedProduct = async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);
        if(product){
            product.isFeatured = ! product.isFeatured;
            const updatedProduct = await product.save();
            await updatedFeaturedProductCache();
            res.json(updatedProduct);
        }else{
            res.status(404).json({message : "Product not found"});
        }

    } catch (error) {
        console.log("Error in toogleFeaturedProduct controller", error.message);
        res.status(500).json({message : "Server error", error : error.message });
    }
};


async function updatedFeaturedProductCache (){
    try {
        /* the lean() method is used to return plain JavaScript objects instead of full Mongoose documents 
        this can significantly  improve performance */

        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("error in update cache function");
    }
}