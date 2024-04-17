const orderSchema=require('../model/orderData')


//--------------------return user-------------------------

const addReturnProduct= async (req,res)=>{
try {
    const {reason,orderId,productObjectId}=req.body
    console.log("------------------",productObjectId)
    console.log("------------------",orderId)

    const orderDetails = await orderSchema.findOne({ userId: req.session.user_id,_id: orderId}).populate('products.productId').populate('userId');

    const updatedOrder = orderDetails.products.find((product) => {
        return product._id.equals(productObjectId);
    });

        updatedOrder.reason = reason;

        await orderDetails.save()

        res.redirect('/loadProfile')
    
} catch (error) {
    console.log(error)
}
}

//-------------------return admin-------------------------------
const   acceptReturn= async (req,res)=>{
    try {
        const{productObjectId,orderId}=req.body
        if(req.body.status==='accepted'){
            console.log('jjjssssssiimm')
            const orderDetails = await orderSchema.findOne({_id: orderId}).populate('products.productId').populate('userId');

        const updatedOrder = orderDetails.products.find((product) => {
            return product._id.equals(productObjectId);
        });
        updatedOrder.orderStatus = "returned";
        updatedOrder.reason = undefined;
        await orderDetails.save()


        }
        if(req.body.status==='rejected'){
            console.log('jjddddddddm')
            const orderDetails = await orderSchema.findOne({_id: orderId}).populate('products.productId').populate('userId');

            const updatedOrder = orderDetails.products.find((product) => {
                return product._id.equals(productObjectId);
            });
        updatedOrder.reason = undefined;
        await orderDetails.save()

        }
     
        
    } catch (error) {
        console.log(error)
    }
    }

module.exports={

    addReturnProduct,
    acceptReturn
}