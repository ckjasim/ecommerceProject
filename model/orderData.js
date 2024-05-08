const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({ 

    products:[{
        productId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'products'},
        quantity:{type:Number,required:true,default:1},
        orderedPrice:{type:Number,required:true},
        totalAmount:{type:Number,default:0},
        deliveryDate:{type:Date,required:true},
        shippingDate:{type:Date,required:true},
        orderStatus:{type:String,required:true},
        reason:{type:String}
        
    }],
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'users'},
    addressId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'address'},
    paymentOption:{type:String,required:true},
    orderedAt:{type:Date,required:true},
    couponDiscount:{type:Number},
    offerDiscount:{type:Number},
    orderedAddress:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'address'},
})

module.exports=mongoose.model('order',orderSchema )