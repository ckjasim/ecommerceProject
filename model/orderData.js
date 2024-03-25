const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({ 
    
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'users'},
    addressId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'address'},
    cartId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'cart'},
    paymentOption:{type:String,required:true},
    orderedAt:{type:Date,required:true},

    
})

module.exports=mongoose.model('order',orderSchema )