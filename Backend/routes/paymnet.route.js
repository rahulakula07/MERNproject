 import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { checkoutSucess, createCheckoutSession } from "../controlles/paymnet.controller.js"


 const router=express.Router()

 router.post("/create-checkout-session",protectRoute, createCheckoutSession)
 router.post("/checkout-success",protectRoute, checkoutSucess)

 
 export default router