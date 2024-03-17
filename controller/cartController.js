const cartSchema = require('../model/cartData')
// const productSchema = require('../model/productData')

const loadCart=async (req,res)=>{
    try {

        const cartData= await cartSchema({
            
        })

        const cartDetails=await cartSchema.findOne({userId:req.session.user_id}).populate('productId').populate('userId')

        res.render('cart',{cartDetails})
        
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    loadCart
}