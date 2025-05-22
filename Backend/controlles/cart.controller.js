import Product from "../Models/product.model.js"

export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;

    const productIds = user.cartItems.map(item => item.id);

    const products = await Product.find({ _id: { $in: productIds } });

    const cartItems = products.map(product => {
      const item = user.cartItems.find(ci => ci.id.toString() === product._id.toString());
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const addToCart=async (req,res)=>{
    try {
        const {productId}=req.body
        const user=req.user

        const exsistingItem=user.cartItems.find(item=>item.id===productId)
        if(exsistingItem){
            exsistingItem.quantity+=1
        }else{
            user.cartItems.push({id:productId , quantity:1})
        }
        await user.save()
        res.json(user.cartItems)
    
    } catch (error) {
        console.log("Error in cartitem controller",error.message)
        res.status(500).json({message:"server error",error:error.message})
    }
}


export const removeAllFromCart= async (req,res)=>{
    try {
        const {productId}=req.body
        const user=req.user
        if(!productId){
            user.cartItems=[]
        }else{
            // user.cartItem=user.cartItems.filter((item)=>item.id !== productId)
            user.cartItems = user.cartItems.filter(item => item.id.toString() !== productId.toString());

        }
        await user.save()
        res.json(user.cartItems)
    } catch (error) {
        console.log("Error in removefromcart controller",error.message)
        res.status(500).json({message:"server error",error:error.message})
    }
}

export const updateQuantity= async (req,res)=>{
    try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		const existingItem = user.cartItems.find((item) => item.id.toString() === productId);
        console.log(existingItem)
		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

