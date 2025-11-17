import mongoose from "mongoose";


export const connectDB = async () => {
    try{

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connnected ${conn.connection.host}`)
    }catch(error){
        console.log("Error connectiong to MongoDB", error.message);
        process.exit(0);
    }
}