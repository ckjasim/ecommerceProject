const cartSchema = require('../model/cartData')
// const productSchema = require('../model/productData')

const loadCart=async (req,res)=>{
    try {

        const cartData=await cartSchema.find().populate('products')

        res.render('cart',{cartData})
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    loadCart
}