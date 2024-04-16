const orderSchema=require('../model/orderData')


const addReturnProduct= async (req,res)=>{
try {
    const {reason,productId,orderId}=req.body
    console.log('11')
    console.log(reason)
    console.log('11')

    console.log(orderId)
    console.log('11')

    console.log(productId)
    console.log('11')

    const orderDetails = await orderSchema.findOne({ userId: req.session.user_id,_id: orderId}).populate('products.productId').populate('userId');
   
    console.log('llllllllllllllll',orderDetails)

    const updatedOrder = orderDetails.products.find((product) => {
        return product._id.equals(productId);
    });

    console.log('llllllllllllllll',updatedOrder)

        updatedOrder.reason = reason;

        await orderDetails.save()

    

        
    
    res.redirect('/loadProfile')
    
} catch (error) {
    console.log(error)
}
}

module.exports={

    addReturnProduct
}