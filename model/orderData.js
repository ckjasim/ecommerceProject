const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({ 

    products:[{
        productId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'products'},
        quantity:{type:Number,required:true,default:1},
        totalAmount:{type:Number,required:true},
        deliveryDate:{type:Date,required:true},
        shippingDate:{type:Date,required:true},
        orderStatus:{type:String,required:true},
    }],
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'users'},
    addressId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'address'},
    paymentOption:{type:String,required:true},
    orderedAt:{type:Date,required:true},
})

module.exports=mongoose.model('order',orderSchema )