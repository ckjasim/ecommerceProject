const orderSchema = require('../model/orderData')

const loadOrder = async (req, res) => {
    try {

        const orderData = await orderSchema.find()
    .populate('userId') 
    .populate('addressId')
    .populate('cartId')
    .populate({
        path: 'cartId',
        populate: {
            path: 'products.productId'
        }
    });
        
        console.log(orderData)
        res.render('orders',{orderData})
        
      
        
    } catch (error) {
        console.log(error.message);
    }
}
const adminOrderDetails = async (req, res) => {
    try {
        const orderId=req.query._id
        console.log(orderId)

        const orderData = await orderSchema.find({_id:orderId})
    .populate('userId') 
    .populate('addressId')
    .populate('cartId')
    .populate({
        path: 'cartId',
        populate: {
            path: 'products.productId'
        }
    });
  
    res.render('adminOrderDetails',{orderData})

    } catch (error) {
        console.log(error.message);
    }
}



module.exports={
    loadOrder,
    adminOrderDetails
    
}