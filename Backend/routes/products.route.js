import express from "express"
import  { adminRoute, protectRoute } from "../middleware/auth.middleware.js"
import { createProduct, deleteProduct, getAllproducts,getFeaturedproducts, getproductsByCategory, getRecommendationProducts,toggleFeaturedProduct } from "../controlles/product.controller.js"

const router =express.Router()

router.get("/", protectRoute, adminRoute, getAllproducts)
router.get("/featured", getFeaturedproducts)
router.get("/category/:category", getproductsByCategory)
router.get("/recommendations",getRecommendationProducts)
router.post("/", protectRoute, adminRoute, createProduct)
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct)
router.delete("/:id", protectRoute, adminRoute, deleteProduct)


export default router
