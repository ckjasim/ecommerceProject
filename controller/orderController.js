const orderSchema = require('../model/orderData')
const addressSchema = require('../model/addressData')
const cartSchema = require('../model/cartData')  
const productSchema = require('../model/productData')  
const walletSchema = require('../model/walletData')  
const Razorpay = require('razorpay')  
const crypto = require('crypto')  
const fs=require('fs')

var easyinvoice = require('easyinvoice');

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

const orderStatusChange =async (req,res)=>{
    try {
        const {selectedValue,productObjectId,orderId}=req.body
 
         console.log(selectedValue)
         console.log(productObjectId)
         console.log(orderId)
         
         const orderDetails = await orderSchema.findOne({_id: orderId}).populate('products.productId').populate('userId');
         console.log(orderDetails)
    const updatedOrder = orderDetails.products.find((product) => {
        return product._id.equals(productObjectId);
    });

        updatedOrder.orderStatus = selectedValue;

        await orderDetails.save()
        res.send({message:'order status changed'})

     } catch (error) {
         console.log(error.message)
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
    console.log('4444444')
    const { selectedAddress, selectedPaymentOption, razorpay_payment_id, razorpay_order_id, razorpay_signature,cartTotal,couponDiscount ,couponCode} = req.body;
    console.log('aaaaaalllll');
    console.log(selectedPaymentOption)


    req.flash('selectedAddress', selectedAddress);
    
    req.flash('selectedPaymentOption', selectedPaymentOption);
    req.flash('cartTotal', cartTotal);
    req.flash('couponDiscount', couponDiscount);
    req.flash('couponCode', couponCode);


    
    if (selectedPaymentOption === 'RazorPay') {
        const KEY_ID = process.env.KEY_ID;
        const YOUR_SECRET = process.env.YOUR_SECRET;

       { const cartDetails = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId').populate('userId');

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

            res.send({ status: 'success', order });
            
        }
   
       
    }else if(selectedPaymentOption === 'Cash on Delivery'){
        res.send({ status: 'success', message: 'Order place'});
    }else if(payment === 'failed'){
        res.send({ status: 'success', message: 'Order place'});
    }else if(selectedPaymentOption === 'Wallet'){

        const walletData = await walletSchema.findOne({userId:req.session.user_id})
        console.log(walletData)
        if(!walletData){

            const wallet='null'
            res.send({ status: 'failed', message: 'Order not place',wallet});

        }else{
        
            if(walletData.walletAmount<cartTotal){
                console.log('not enough money in wallet')
                const wallet='noMoney'
            res.send({ status: 'failed', message: 'Order not place',wallet});
            }else{
                const updatedWalletData = await walletSchema.findOneAndUpdate(
                    { userId: req.session.user_id },
                    { 
                        $inc: { walletAmount: -cartTotal },
                        $push: { 
                            wallets: {
                                amount:cartTotal,
                                description: "Product purchase",
                                status: "debit",
                                date:new Date()
                                
                            }
                        }
                    },
                    { new: true }
                );
                
        res.send({ status: 'success', message: 'Order place'});

            }
        }
    }

    }

    } catch (error) {
        console.log(error.message);
    }

}

const paymentFailed=async (req,res)=>{
    try {
        req.session.payment='failed'

        res.send({ status: 'success', message: 'Order place'});
    } catch (error) {
        console.log(error.message);
    }
}



const viewOrder=async (req,res)=>{
    try {

       
        const selectedAddress=req.flash('selectedAddress').toString()
        const selectedPaymentOption=req.flash('selectedPaymentOption').toString()
        const cartTotal=req.flash('cartTotal').toString()
        const couponDiscount=req.flash('couponDiscount').toString()
        const couponCode=req.flash('couponCode').toString()

       
        let paymentOption
        const payment=req.session.payment
       if(payment==="failed"){
         paymentOption ='failed'
        }else{
         paymentOption =selectedPaymentOption

       }
       

        const cartData = await cartSchema.findOne({ userId: req.session.user_id }).populate('products.productId');
        if(cartData) {
        const productDetails = [];

            cartData.products.forEach(cartProduct => {
                const productItem = cartProduct.productId; 

                const productToAdd = {
                    productId: productItem._id,
                    quantity: cartProduct.quantity,
                    orderedPrice: cartProduct.totalAmount/cartProduct.quantity,
                    totalAmount: cartTotal,
                    deliveryDate: new Date(),
                    shippingDate: new Date(),
                    orderStatus: "pending"
                };
                productDetails.push(productToAdd);


            });

            const actualPrice = cartData.products.reduce((total, product) => {
                return total + product.productId.price;
            }, 0);
            const offerDiscount =actualPrice- cartTotal-couponDiscount

      

            const orderData = new orderSchema({
                products: productDetails,
                userId: req.session.user_id,
                addressId: selectedAddress, 
                paymentOption: paymentOption,
                couponDiscount:couponDiscount, 
                offerDiscount:offerDiscount, 
                orderedAt: new Date(),
                orderedAddress: selectedAddress
            });   

            await orderData.save();
            
            cartData.products.forEach(async (cartProduct) => {
                const productItem = cartProduct.productId; 
           
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

        await couponSchema.findOneAndUpdate({code:couponCode.toUpperCase()},{
            $push:{users:req.session.user_id}
          })

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
        
        const orderDetails = await orderSchema.findOne({ userId: req.session.user_id, _id: orderId }).populate('products.productId').populate('userId').populate('addressId');
        
        // const orderDetails = orderData.products.find((product) => {
        //     return product._id.equals(productId);
        // });
        
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

const downloadInvoice = async (req, res) => {
    try {
        const { orderId } = req.body;
        const orderData = await orderSchema.findOne({ _id: orderId }).populate('userId').populate('addressId').populate('products.productId');

        const products = orderData.products.map((product) => ({
            quantity: product.quantity,
            description: product.productId.name,
            couponDiscount: orderData.couponDiscount, 
            offerDiscount: orderData.offerDiscount,  
            taxRate: 6,
            price: product.orderedPrice
        }));

        const formatDate = (date) => {
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return date.toLocaleDateString('en-IN', options);
        };

        var data = {
            apiKey: "free",
            mode: "development",
            images: {
                logo: "https://public.budgetinvoice.com/img/logo_en_original.png",
            },
            sender: {
                company: "prinDecor",
                address: "Bangaluru",
                zip: "1234 AB",
                city: "madiwala",
                country: "India"
            },
            client: {
                company: orderData.userId.fName,
                address: orderData.addressId.address,
                zip: orderData.addressId.pincode,
                city: orderData.addressId.city,
                country: "India"
            },
            information: {
                number: "2021.0001",
                date: formatDate(new Date()),
            },
            products: products,
            // bottomNotice: "Kindly pay your invoice within 15 days.",
            settings: {
                currency: "INR",
            },
        };

        const result = await easyinvoice.createInvoice(data);
        const pdfBuffer = Buffer.from(result.pdf, 'base64');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
        res.send(pdfBuffer);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


const payAgain=async (req,res)=>{
    try {
        const KEY_ID = process.env.KEY_ID;
        const YOUR_SECRET = process.env.YOUR_SECRET;

        const orderId=req.body.orderId
        console.log(orderId)

        { const orderData = await orderSchema.findOne({ _id:orderId })

        const totalAmount=orderData.products.reduce((total,product)=>{
          return  total+product.totalAmount
        },0)
        console.log('jjjj',totalAmount)

        var instance = new Razorpay({ key_id: KEY_ID, key_secret: YOUR_SECRET });
    
            const order = await instance.orders.create({
                amount: totalAmount * 100,
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

         await orderSchema.findOneAndUpdate({ _id:orderId },{paymentOption:"Razorpay"})

        
        res.send({ status: 'success', message: 'payment  successfull',});
       
    } catch (error) {
        console.log(error.message);
    }
}
const paymentSuccess=async (req,res)=>{
    try {
        
            
      

       
        
       
       
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
    orderStatusChange,
    downloadInvoice,
    paymentFailed,
    payAgain,
    paymentSuccess   
    
}