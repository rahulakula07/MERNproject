import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getCoupon, validateCoupon } from "../controlles/coupon.controller.js"

const router=express.Router()

router.get("/",protectRoute, getCoupon)
router.post("/coupons/validate",protectRoute, validateCoupon)

export default router