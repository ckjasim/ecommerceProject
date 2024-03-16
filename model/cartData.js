const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    quantity:{type:Number,required:true},
    totalAmount:{type:Number,required:true},
    createdAt:{type:Date,required:true}, 
    productId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'products'}
})

module.exports=mongoose.model('cart',cartSchema )