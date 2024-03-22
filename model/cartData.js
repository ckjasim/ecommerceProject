const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({ 
    products:[{
        productId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'products'},
        quantity:{type:Number,required:true,default:1},
        totalAmount:{type:Number,required:true},
        inStock:{type:Number,required:true},
       
    }],
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'users'}
})

module.exports=mongoose.model('cart',cartSchema )