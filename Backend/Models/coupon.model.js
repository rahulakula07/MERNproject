import { constants } from "crypto";
import mongoose from "mongoose";

const couponSchema=new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
    },
    discountPercentage:{
        type:Number,
        required:true,
        min:0,
        max:100,
    },
    expirationDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        // unique:true,
    },

},{timestamps:true,})

 const Coupon=mongoose.model("coupon",couponSchema)

 export default Coupon