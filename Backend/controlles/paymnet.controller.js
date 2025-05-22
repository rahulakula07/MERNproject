import Coupon from "../Models/coupon.model.js"
import { stripe } from "../lib/stripe.js"
import Order from "../Models/order.model.js"


export const createCheckoutSession=async (req,res)=>{
    try {
        const {products,couponCode}=req.body
        if(!Array.isArray(products) || products.length === 0){
            return res.status(404).json({error:"Invalid or empty product array"})
        }


        let totalAmount=0
        const lineItems=products.map(product=>{
            const amount=Math.round(product.price*100)
            totalAmount+=amount* product.quantity
             return{
            price_data:{
                currency:"inr",
                product_data:{
                    name:product.name,
                    images:[product.image],

                },
                unit_amount:amount,
            },
            quantity: product.quantity || 1,
        }
        })

        let coupon=null
        if(couponCode){
            coupon=await Coupon.findOne({code:couponCode,userId:req.user._id,isActive:true})

                console.log('User ID:', req.user?._id);

            if(coupon){
                totalAmount-= Math.round(totalAmount * coupon.discountPercentage / 100)

            }
        }

        const session =await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:`${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.CLIENT_URL}/purchase?cancel`,
            discounts:coupon?[
                    {
                       coupon:await createStripeCoupon(coupon.discountPercentage) 
                    },
            ]:
            [],
            metadata:{
                userId:req.user._id.toString(),
                couponCode:couponCode || "",
                products:JSON.stringify(
                    products.map((p)=>({
                        id:p._id,
                        quantity:p.quantity,
                        price:p.price,
                    }))
                )
            }
        })

        if(totalAmount >= 20000){
            await createNewCoupon(req.user._id)
        }
        res.status(200).json({id:session.id,totalAmount: totalAmount/100})

    } catch (error) {
        console.log("error in processing payment ",error.message)
        res.status(500).json({message:"error processing sucessful checkout",error:error.message}) 
    }
 }


export const checkoutSucess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Check if order already exists
      const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
      if (existingOrder) {
        return res.status(200).json({
          success: true,
          message: "Order already exists",
          orderId: existingOrder._id,
        });
      }

      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }

      const products = JSON.parse(session.metadata.products);

      const newOrder = new Order({
        user: session.metadata.userId,
        product: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });

      await newOrder.save();

      return res.status(200).json({
        success: true,
        message: "Payment successful, order created, and coupon deactivated if used.",
        orderId: newOrder._id,
      });
    } else {
      return res.status(400).json({ error: "Payment not completed." });
    }
  } catch (error) {
    console.log("error in processing payment", error.message);
    return res.status(500).json({
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};


 async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupon.create({
        percent_off:discountPercentage,
        duration:"once"
    })
   return coupon.id
 }


 async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({userId })
    const newCoupon = new Coupon({
        code:"GIFT"+ Math.random().toString(36).substring(2,8).toUpperCase(),
        discountPercentage:10,
        expirationDate:new Date(Date.now()+30*24*60*60*1000),//30days
        userId:userId
    })

await newCoupon.save()
return newCoupon
 }

 