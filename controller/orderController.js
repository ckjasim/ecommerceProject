const orderSchema = require('../model/orderData')
const addressSchema = require('../model/addressData')
const cartSchema = require('../model/cartData')  
const productSchema = require('../model/productData')  

//---------------------ADMIN-----------------------------

const loadAdminOrder = async (req, res) => {
    try {

        const orderData = await orderSchema.find()
    .populate('userId') 
    .populate('addressId')
    .populate('products.productId')
        
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
    .populate('products.productId')
    
  
    res.render('adminOrderDetails',{orderData})

    } catch (error) {
        console.log(error.message);
    }
}

//-----------------------USER---------------------------


const loadOrder=async (req,res)=>{
    try {
        const cartDetails = await cartSchema.findOne({ userId: req.session.user_id })
       
            
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
        const cartDetails = await cartSchema.findOne({ userId: req.session.user_id })
        


        const selectedAddress=req.flash('selectedAddress').toString()
        const selectedPaymentOption=req.flash('selectedPaymentOption').toString()
       

        const cartData = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId');
            const productDetails = [];

            cartData.products.forEach(cartProduct => {
                const productItem = cartProduct.productId; 

                const productToAdd = {
                    productId: productItem._id,
                    quantity: cartProduct.quantity,
                    orderedPrice: productItem.price,
                    totalAmount: cartProduct.totalAmount,
                    deliveryDate: new Date(),
                    shippingDate: new Date(),
                    orderStatus: "pending"
                };
                productDetails.push(productToAdd);

            });

            console.log(productDetails); 

            const orderData = new orderSchema({
                products: productDetails,
                userId: req.session.user_id,
                addressId: selectedAddress, 
                paymentOption: selectedPaymentOption, 
                orderedAt: new Date(),
                orderedAddress: selectedAddress
            });   

            await orderData.save();


           

            cartData.products.forEach(async (cartProduct) => {
                const productItem = cartProduct.productId; 
                console.log(cartProduct.quantity);
                console.log('kkkkkkkkkkkkkkkkk');
                console.log( productItem._id )
                
                try {
                    const result = await productSchema.findByIdAndUpdate(
                        { _id: productItem._id },
                        { $inc: { quantity: -cartProduct.quantity } }
                        // { new: true } 
                    );
                    console.log('Product updated successfully:', result);
                } catch (error) {
                    console.error('Error updating product:', error);
                }
            });
            
                  
            await cartSchema.findOneAndDelete({userId:req.session.user_id})
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
        const productId =req.query._id
        
        const orderDetails =await orderSchema.findOne(
            { 
                userId: req.session.user_id,
                'products.productId': productId 
            },
            
        ).populate('userId')
        .populate('products.productId')
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