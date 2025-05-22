import express from "express"
import dotenv, { config } from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import ProductsRoutes from "./routes/products.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/paymnet.route.js"
import analyticRoutes from "./routes/analytic.route.js"
import path from "path"



import { connectDB } from "./lib/db.js"
dotenv.config()
const app=express()
// console.log(process.env.PORT)
const PORT=process.env.PORT ||5000;

const __dirname = path.resolve()
app.use(express.json({limit:"10mb"}))
app.use(cookieParser())


app.use("/api/auth",authRoutes )
app.use("/api/products",ProductsRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/coupons",couponRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/analytics",analyticRoutes)

if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/Frontend/dist")));
    app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "Frontend", "dist", "index.html"));
	});
}
app.listen(PORT,()=>{
    console.log("server is running on http://localhost:"+PORT);
    connectDB()
    
})