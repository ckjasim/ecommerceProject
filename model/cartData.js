const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    quantity:{type:Number,required:true},
    totalAmount:{type:Number,required:true},
    createdAt:{type:Date,required:true}, 
    products:[{
        productId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'products'},
        name:{type:String,required:true},
        price:{type:Number,required:true},
        quantity:{type:Number,required:true},
        img:{type:Array,required:true},
        color:{type:String,required:true},
        size:{type:String,required:true},
    }],
    userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'users'}
})

module.exports=mongoose.model('cart',cartSchema )