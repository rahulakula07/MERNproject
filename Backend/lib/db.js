 import mongoose from "mongoose";
 export const connectDB=async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI)
        console.log(`mongoDb connecte:${conn.connection.host}`);    
    }catch(error){
        console.log("error from MongoDb",error.message);
        process.exit(1)
    }

 }