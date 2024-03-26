const orderSchema = require('../model/orderData')
const addressSchema = require('../model/addressData')
const cartSchema = require('../model/cartData')         

const loadAdminOrder = async (req, res) => {
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
const loadOrder=async (req,res)=>{
    try {
       console.log('4444444')
       const {selectedAddress,selectedPaymentOption} =req.body
    //    quantity=req.flash('quantity').toString()
    req.flash('selectedAddress', selectedAddress);
req.flash('selectedPaymentOption', selectedPaymentOption);

       console.log(selectedAddress)
       res.send({ status: 'success', message: 'Order placed successfully'});
    } catch (error) {
        console.log(error.message);
    }
}
const viewOrder=async (req,res)=>{
    try {
        const selectedAddress=req.flash('selectedAddress').toString()
        const selectedPaymentOption=req.flash('selectedPaymentOption').toString()
       

        const cartData=await cartSchema.findOne({userId:req.session.user_id})
    const productDetails=[]

    cartData.products.forEach(products=>{

        productToAdd ={
            productId: products.productId,
            quantity:products.quantity,
            totalAmount:products.totalAmount,
            deliveryDate: new Date(),
            shippingDate: new Date(),
            orderStatus: "pending",
        };
        productDetails.push(productToAdd)
    })

         const orderData =new orderSchema({
            products:productDetails,
            userId:req.session.user_id,
            addressId:selectedAddress, 
            paymentOption:selectedPaymentOption, 
            orderedAt:new Date(),
             
         })   
         await orderData.save();
        
        const orderDetails = await orderSchema.findOne({ userId: req.session.user_id })
        .populate('products.productId')
        .populate('userId')
        .populate('addressId');
        
        

        res.render('order',{orderDetails})
    
    } catch (error) {
        console.log(error.message);
    }
}
const orderDetails=async (req,res)=>{
    try {

        const orderDetails = await orderSchema.findOne({ userId: req.session.user_id })
        .populate('cartId')
        .populate('userId')
        .populate({
            path: 'cartId',
            populate: {
                path: 'products.productId'
            }
        })
        .populate('addressId');
        
        
       res.render('orderDetails',{orderDetails})
    } catch (error) {
        console.log(error.message);
    }
}
const cancelOrder=async (req,res)=>{
    try {
        const productId=req.query._id
        console.log('[[[[[')
        const orderData = await orderSchema.findOneAndUpdate(
            { 
                userId: req.session.user_id,
                'products.productId': productId 
            },
            { 
                $set: {
                    'products.$.orderStatus': 'cancelled' 
                }
            }
        );
        
        
        orderData.save()
        console.log('[[[????[[')
        res.redirect('/loadOrder')
        
       
    } catch (error) {
        console.log(error.message);
    }
}




module.exports={
    loadAdminOrder,
    adminOrderDetails,
    loadOrder,
    viewOrder,
    orderDetails,
    cancelOrder,
    
}