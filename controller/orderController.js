const orderSchema = require('../model/orderData')
const addressSchema = require('../model/addressData')
const cartSchema = require('../model/cartData')  
const productSchema = require('../model/productData')  
const Razorpay = require('razorpay')  
const crypto = require('crypto')  

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
        const cartData = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId');
        

        const response = [];

        cartData.products.forEach(cartProduct => {
            const productItem = cartProduct.productId;
    
            if (cartProduct.quantity > productItem.quantity) {
                const inStock = false;
                const stockQuantity = productItem.quantity;
        
               
                response.push({
                    productId: productItem._id,
                    status: 'error',
                    message: 'Product out of stock',
                    inStock,
                    stockQuantity
                });
            } 
        });
        
        if (response.length > 0) {
            res.send({ status: 'success', message: 'Out of stock',response});
        } else {
    //         console.log('4444444')
    //         const {selectedAddress,selectedPaymentOption,razorpay_payment_id,razorpay_order_id,razorpay_signature} =req.body
    //         console.log('aaaaaalllll')
    //         console.log(razorpay_signature)
    //         const signature =razorpay_signature
    //      //    quantity=req.flash('quantity').toString()
    //      req.flash('selectedAddress', selectedAddress);
    //  req.flash('selectedPaymentOption', selectedPaymentOption);
    //  req.flash('razorpay_signature', razorpay_signature);
     

    //  if(selectedPaymentOption==='RazorPay'){
     

    //     const KEY_ID=process.env.KEY_ID
    
    //      const YOUR_SECRET = process.env.YOUR_SECRET
    //      const cartDetails = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId').populate('userId')
    //     const cartTotal = cartDetails.products.reduce((Total, amount) => Total + amount.totalAmount, 0);

    //     var instance = new Razorpay({ key_id:KEY_ID, key_secret:YOUR_SECRET })
        
    //     instance.orders.create({
    //         amount: cartTotal * 100,
    //         currency: "INR",
    //         receipt: "receipt#1",
    //         notes: {
    //             key1: "value3",
    //             key2: "value2"
    //         }
    //     }).then(function(order) {

    //         console.log("Order created:", order);
          
    //         const KEY_ID=process.env.KEY_ID
            
    //         res.send({ status: 'success', message: 'Order placed successfully',order,KEY_ID});
    //         // const razorpay_signature=req.body.razorpay_signature
    //         const razorpay_signature=req.flash('razorpay_signature').toString()
    //         console.log("Ordsig:", razorpay_signature);
    //         const generated_signature = crypto.createHmac('sha256', YOUR_SECRET).update(order.id + "|" + razorpay_payment_id).digest('hex');
    //         console.log(generated_signature,'--------------',razorpay_signature)
    //         if (generated_signature === razorpay_signature) {
    //             console.log('Payment succeeded');
    //         } else {
    //             console.error('Payment signature verification failed');
    //         }
    //     }).catch(function(error) {

    //         console.error("Error creating order:", error);
    //         res.send({ status: 'success', message: 'Order razor failed'});
    //     });
        


    console.log('4444444')
    const { selectedAddress, selectedPaymentOption, razorpay_payment_id, razorpay_order_id, razorpay_signature,cartTotal } = req.body;
    console.log('aaaaaalllll');
    console.log('88888888888888888888888888888', razorpay_signature);
    // const signature = razorpay_signature;
    

    req.flash('selectedAddress', selectedAddress);
    req.flash('selectedPaymentOption', selectedPaymentOption);
    req.flash('cartTotal', cartTotal);
    // req.flash('razorpay_signature', razorpay_signature);
    
    if (selectedPaymentOption === 'RazorPay') {
        const KEY_ID = process.env.KEY_ID;
        const YOUR_SECRET = process.env.YOUR_SECRET;

       { const cartDetails = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId').populate('userId');
        // const cartTotal = cartDetails.products.reduce((Total, amount) => Total + amount.totalAmount, 0);

        var instance = new Razorpay({ key_id: KEY_ID, key_secret: YOUR_SECRET });
    
            const order = await instance.orders.create({
                amount: cartTotal * 100,
                currency: "INR",
                receipt: "receipt#1",
                notes: {
                    key1: "value3",
                    key2: "value2"
                }
            });
    
            console.log("Order created:", order);
            console.log("Order iddd:", order.id);
    

            res.send({ status: 'success', order });
            
        }
        res.send({ status: 'success', message: 'Order place'});
            // console.log("Ordsig:", razorpay_signature);
    
            // // Generating signature
            // const generated_signature = crypto.createHmac('sha256', YOUR_SECRET).update(order.id + "|" + razorpay_payment_id).digest('hex');
            // console.log(generated_signature, '--------------', razorpay_signature);
    
            // // Comparing signatures
            // if (generated_signature === razorpay_signature) {
            //     console.log('Payment succeeded');
            // } else {
            //     console.error('Payment signature verification failed');
            // }
       
    }else if(selectedPaymentOption === 'Cash on Delivery'){
        res.send({ status: 'success', message: 'Order place'});
    }
    

        

      
        // res.send({ status: 'success', message: 'Order razor place',KEY_ID,});
    }
    // res.send({ status: 'success', message: 'Order place'});

          
       
      
        

    } catch (error) {
        console.log(error.message);
    }

}
const viewOrder=async (req,res)=>{
    try {

       
        const selectedAddress=req.flash('selectedAddress').toString()
        const selectedPaymentOption=req.flash('selectedPaymentOption').toString()
        const cartTotal=req.flash('cartTotal').toString()
        console.log('-------')
        console.log(selectedPaymentOption)
        console.log('-------')
       
        
       

        const cartData = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId');
        if(cartData) {
        const productDetails = [];

            cartData.products.forEach(cartProduct => {
                const productItem = cartProduct.productId; 

                const productToAdd = {
                    productId: productItem._id,
                    quantity: cartProduct.quantity,
                    orderedPrice: productItem.price,
                    totalAmount: cartTotal,
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
        }
        const orderDetails = await orderSchema.find({ userId: req.session.user_id })
        .populate('products')
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
        const { productId, orderId } = req.query;
        console.log('qqqqqq',productId, orderId);
        
        const orderData = await orderSchema.findOne({ userId: req.session.user_id, _id: orderId }).populate('products.productId').populate('userId');
        
        const orderDetails = orderData.products.find((product) => {
            return product._id.equals(productId);
        });
        
        console.log('sss', orderDetails);
        

       res.render('orderDetails',{orderDetails,orderId})
    } catch (error) {
        console.log(error.message);
    }
}


const cancelOrder=async (req,res)=>{
    try {
        const productId=req.body.productId
        const orderId=req.body.orderId
        console.log(productId)
        console.log(req.session.user_id)
        const orderData = await orderSchema.findOneAndUpdate(
            { 
                userId: req.session.user_id,
                'products.productId': productId ,
                _id:orderId
            },
            { 
                $set: {
                    'products.$.orderStatus': 'cancelled' 
                }
            }
        );
        console.log(orderData)
        
        if (orderData) {
            await orderData.save();
        } else {
            console.log("No matching order found.");
        }
        
        res.send({ status: 'success', message: 'Order cancelled successfully',orderStatus});
       
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