import Product from "../Models/product.model.js"
import { redis } from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"



export const getAllproducts=async(req,res)=>{
    try{
        const products=await Product.find({})//find all products
        console.log(products)
        res.json({products})

    }catch(error){
        console.log("erroe in getAllProducts controller",error.message)
        res.status(500).json({message:"server error", error:error.message})

    }
} 

export const getFeaturedproducts=async (req,res)=>{
     try {
        let feacturedProducts=await redis.get("featured_products")
        if(feacturedProducts){
            return res.json(JSON.parse(feacturedProducts))
        }

        //if not in redis we need to fetched it from the mongodb
        //lean is gonna resutrn plain js object insted of mongodn=b abject which is good for perfor manace
        feacturedProducts=await Product.find({isFeatured:true}).lean()

        if(!feacturedProducts){
            return res.status(404).json({message:"no featured product found"})
        }

        //store in redis for feaure quick access
        await redis.set("featured_products",JSON.stringify(feacturedProducts))
        res.json(feacturedProducts)
     } catch (error) {
        console.log("Error in getFeature products controller",error.message)
        res.status(500).json({message:"server error",error:error.message})
     }
}

export const createProduct=async  (req,res)=> {
    try {
        const{name,description,price,category,image}=req.body
        let cloudinaryResponse= null;
        if (image){
           cloudinaryResponse= await cloudinary.uploader.upload(image,{folder:"products"})
        }

        const product=await Product.create({
            name,
            description,
            price,
            category,
            image:cloudinaryResponse?.secure_url?cloudinaryResponse.secure_url:"",

        })
        res.status(201).json(product)
    } catch (error) {
        console.log("erroe for createproduct console",error.message)
        return res.status(500).json({message:"server error",error:error.message})
    }
}

export const deleteProduct=async (req,res)=>{
    try {
        const product= await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({message:"product not found"})
        }

        if(product.image){
            const publicId=product.image.split("/").pop().split(".")[0]//this will get the id of the image
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("delete form cloudinary");
                
            } catch (error) {
                console.log("delete form the cloudinary",error.message);
                
            }

            await Product.findByIdAndDelete(req.params.id)
            res.json({message:"products deleted sucessfully"})
        }
    } catch (error) {
        console.log("errer in delete product controller",error.message);
         res.status(500).json({message:"server error",error:error.message})
        
    }
}

export const getRecommendationProducts=async (req,res)=>{
    try {
        const products = await Product.aggregate([
            {
                $sample:{size:4}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1

                }
            }
        ])
        res.json(products)
    } catch (error) {
        console.log("error in get recommendation",error.message);
         res.status(500).json({message:"server error",error:error.message})
        
    }
}

export const getproductsByCategory=async(req,res)=>{
    const{category}=req.params
    try {
        const products=await Product.find({category})
        res.json({products})

    } catch (error) {
        console.log("error in getproductsbycategory",error.message);
         res.status(500).json({message:"server error",error:error.message})
        
    }
}

export const toggleFeaturedProduct=async(req,res)=>{
    try {
        const product= await Product.findById(req.params.id)
        if(product){
            product.isFeatured=!product.isFeatured
            const updatedProduct=await product.save()
            //update the cahce
            await updateFeaturedProductsCahce()
            res.json(updatedProduct)
        }else{
            res.status(401).json({message:"product not found"})
        }
    } catch (error) {
        console.log("error in toggleFeaturedProdct",error.message);
         res.status(500).json({message:"server error",error:error.message})
        
    }
}

async function updateFeaturedProductsCahce(){
    try {
        // lean() is used to return plain js object insteaed of mogose object.this can significantly iincrese the performance
        const feacturedProducts=await Product.find({isFeatured:true}).lean()
        await redis.set("featured_products",JSON.stringify(feacturedProducts))
    } catch (error) {
        console.log("error in update chace function",error.message);
        res.status(500).json({message:"server error",error:error.message})
        
    }
}