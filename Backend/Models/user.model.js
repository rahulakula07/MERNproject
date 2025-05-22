 import mongoose, { Schema } from "mongoose";
 import bcrypt from "bcryptjs";
import Product from "./product.model.js";
 const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password must be at least 6 charaters long"]
    },
    cartItems:[
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", 
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer"
    },
    
 },{
        timestamps:true
})


userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt)
        next()
    }
    catch(error){
        next(error)
    }
})

userSchema.methods.comparePassword=async function (password) {
    return bcrypt.compare(password,this.password)
}
const User=mongoose.model("Users",userSchema)
export default User;